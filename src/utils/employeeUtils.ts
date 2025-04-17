
import { Employee, RoleData, EmployeeWithRoles, CircleData, LeadershipData } from "@/types";
import { formatName, cleanRoleName, cleanFunctionalType } from "./formatUtils";
import { calculateStandardSalary } from "./salaryUtils";
import { 
  findRolesWithFTEForEmployee, 
  calculateTotalFTE, 
  normalizeRolesFTE 
} from "./fteUtils";

// Re-export formatters and utilities that are used elsewhere
export { 
  formatSalary, 
  formatName, 
  formatFTE, 
  cleanRoleName,
  cleanFunctionalType
} from "./formatUtils";

export { 
  calculateStandardSalary,
  getSalaryDifference
} from "./salaryUtils";

export { 
  calculateTotalFTE, 
  normalizeRolesFTE 
} from "./fteUtils";

// Function to filter employees by role
export const filterEmployeesByRole = (
  employees: (Employee | EmployeeWithRoles)[], 
  roleName: string
): (Employee | EmployeeWithRoles)[] => {
  if (!roleName) return employees;
  
  return employees.filter(emp => {
    if ('roles' in emp) {
      return emp.roles.some(role => 
        role.toLowerCase().includes(roleName.toLowerCase())
      );
    }
    return false;
  });
};

// Function to filter employees by circle
export const filterEmployeesByCircle = (
  employees: (Employee | EmployeeWithRoles)[], 
  circleName: string,
  rolesData: RoleData[]
): (Employee | EmployeeWithRoles)[] => {
  if (!circleName || !rolesData.length) return employees;
  
  // Find all employee names in this circle from roles data
  const employeesInCircle = new Set<string>();
  
  rolesData.forEach(role => {
    if (role.circleName && role.participantName && 
        role.circleName.toLowerCase() === circleName.toLowerCase()) {
      employeesInCircle.add(formatName(role.participantName).toLowerCase());
    }
  });
  
  // Filter employees by matching names
  return employees.filter(emp => 
    employeesInCircle.has(formatName(emp.name).toLowerCase())
  );
};

// Function to filter employees with roles
export const filterEmployeesWithRoles = (
  employees: (Employee | EmployeeWithRoles)[]
): EmployeeWithRoles[] => {
  return employees.filter(emp => 
    'roles' in emp && emp.roles.length > 0
  ) as EmployeeWithRoles[];
};

// Function to get employee circles
export const getEmployeeCircles = (
  employee: Employee | EmployeeWithRoles,
  rolesData: RoleData[]
): string[] => {
  const result: string[] = [];
  if (!rolesData.length) return result;
  
  const nameParts = formatName(employee.name).toLowerCase().split(' ');
  
  for (const roleData of rolesData) {
    if (!roleData.participantName || !roleData.circleName) continue;
    
    const participantNameParts = formatName(roleData.participantName).toLowerCase().split(' ');
    const matches = nameParts.some(part => 
      participantNameParts.some(namePart => namePart === part)
    );
    
    if (matches && !result.includes(roleData.circleName)) {
      result.push(roleData.circleName);
    }
  }
  
  return result;
};

// Function to merge duplicate employees (employees with the same name)
const mergeEmployeesByName = (employees: Employee[]): Employee[] => {
  const employeeMap = new Map<string, Employee>();
  
  employees.forEach(emp => {
    const formattedName = formatName(emp.name).toLowerCase();
    
    if (employeeMap.has(formattedName)) {
      const existingEmp = employeeMap.get(formattedName)!;
      
      // Merge properties
      existingEmp.salary += emp.salary; // Sum salaries
      
      // Merge other properties (keep the non-empty ones)
      if (emp.position && !existingEmp.position) {
        existingEmp.position = emp.position;
      }
      if (emp.department && !existingEmp.department) {
        existingEmp.department = emp.department;
      }
      
      // For other custom properties, keep them as arrays
      Object.keys(emp).forEach(key => {
        if (key !== 'id' && key !== 'name' && key !== 'salary' && 
            key !== 'position' && key !== 'department') {
          
          if (!existingEmp[key]) {
            existingEmp[key] = emp[key];
          } else if (existingEmp[key] !== emp[key]) {
            // If values differ, store as array
            if (Array.isArray(existingEmp[key])) {
              if (!existingEmp[key].includes(emp[key])) {
                existingEmp[key].push(emp[key]);
              }
            } else {
              existingEmp[key] = [existingEmp[key], emp[key]];
            }
          }
        }
      });
      
    } else {
      // Clone employee to avoid reference issues
      employeeMap.set(formattedName, { ...emp });
    }
  });
  
  return Array.from(employeeMap.values());
};

export const processEmployeesWithRoles = (
  employees: Employee[], 
  rolesData: RoleData[], 
  customStandardSalaries: Map<string, number>,
  circlesData: CircleData[] = [],
  leadershipData: LeadershipData[] = []
) => {
  // Merge employees with identical names before processing
  const mergedEmployees = mergeEmployeesByName(employees);
  
  return mergedEmployees.map(emp => {
    const nameParts = formatName(emp.name).split(' ');
    const lastName = nameParts[0];
    const firstName = nameParts.length > 1 ? nameParts[1] : '';
    
    const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName, rolesData);
    const roles = Array.from(rolesFTEMap.keys());
    const totalFTE = calculateTotalFTE(rolesFTEMap);
    
    const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
    
    // Find circle leadership info
    const { circleType, circleCount } = findCircleLeadershipInfo(lastName, firstName, rolesData, circlesData);
    
    const standardSalary = calculateStandardSalary(
      normalizedRolesFTE, 
      rolesData, 
      mergedEmployees, // Use merged employees for salary calculation
      customStandardSalaries,
      leadershipData,
      circleType,
      circleCount
    );
    
    return {
      ...emp,
      roles,
      totalFTE,
      normalizedRolesFTE,
      standardSalary,
      operationalCircleType: circleType,
      operationalCircleCount: circleCount,
      strategicCircleCount: undefined // no longer needed as separate count
    };
  });
};

// Function to find the leadership information for an employee
export const findCircleLeadershipInfo = (
  lastName: string,
  firstName: string,
  rolesData: RoleData[],
  circlesData: CircleData[]
): { circleType?: string, circleCount: number } => {
  // Constants for the circle leader role names
  const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
  const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
  const GENERIC_LEADER_ROLE = "Лидер"; // Capitalized
  
  // Find the employee by name, with more lenient matching
  const employeeRoles = rolesData.filter(role => {
    if (!role.participantName) return false;
    
    const participantName = formatName(role.participantName).toLowerCase();
    const normalizedLastName = lastName.toLowerCase();
    const normalizedFirstName = firstName ? firstName.toLowerCase() : '';
    
    return participantName.includes(normalizedLastName) && 
           (!normalizedFirstName || participantName.includes(normalizedFirstName));
  });
  
  // Check if the employee has any leader roles (operational or strategic)
  const leaderRoles = employeeRoles.filter(role => {
    if (!role.roleName) return false;
    
    const roleName = role.roleName.toLowerCase();
    return roleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
           roleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase()) ||
           roleName === GENERIC_LEADER_ROLE.toLowerCase();
  });
  
  // If the employee is not a leader of any kind, return empty values
  if (leaderRoles.length === 0) {
    return { circleType: undefined, circleCount: 0 };
  }
  
  // Count the total number of circles led
  const circleCount = leaderRoles.length;
  
  // Get the functional type from the first operational circle found (if any)
  let circleType: string | undefined = undefined;
  
  // First try to find an operational circle with functional type
  const operationalCircle = leaderRoles.find(role => 
    role.roleName?.toLowerCase().includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase())
  );
  
  if (operationalCircle?.circleName) {
    const circle = circlesData.find(circle => 
      circle.name.toLowerCase() === operationalCircle.circleName?.toLowerCase()
    );
    
    if (circle) {
      circleType = cleanFunctionalType(circle.functionalType);
    }
  }
  
  return { 
    circleType, 
    circleCount
  };
};

// These functions are kept for backwards compatibility but are no longer used directly
export const findOperationalCircleInfo = findCircleLeadershipInfo;
export const findStrategicCircleCount = () => undefined;
