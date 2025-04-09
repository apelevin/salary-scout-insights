
import { Employee, RoleData, EmployeeWithRoles, CircleData } from "@/types";
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

export const processEmployeesWithRoles = (
  employees: Employee[], 
  rolesData: RoleData[], 
  customStandardSalaries: Map<string, number>,
  circlesData: CircleData[] = []
) => {
  return employees.map(emp => {
    const nameParts = formatName(emp.name).split(' ');
    const lastName = nameParts[0];
    const firstName = nameParts.length > 1 ? nameParts[1] : '';
    
    const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName, rolesData);
    const roles = Array.from(rolesFTEMap.keys());
    const totalFTE = calculateTotalFTE(rolesFTEMap);
    
    const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
    
    const standardSalary = calculateStandardSalary(normalizedRolesFTE, rolesData, employees, customStandardSalaries);
    
    // Check if the employee has the operational circle leader role
    const operationalCircleType = findOperationalCircleType(lastName, firstName, rolesData, circlesData);
    
    return {
      ...emp,
      roles,
      totalFTE,
      normalizedRolesFTE,
      standardSalary,
      operationalCircleType
    };
  });
};

// Function to find the operational circle type for an employee
export const findOperationalCircleType = (
  lastName: string,
  firstName: string,
  rolesData: RoleData[],
  circlesData: CircleData[]
): string | undefined => {
  // Constant for the operational circle leader role name
  const OPERATIONAL_CIRCLE_LEADER_ROLE = "лидер операционного круга";
  
  // Find the employee by name
  const employeeRoles = rolesData.filter(role => {
    const participantName = formatName(role.participantName);
    return participantName.toLowerCase().includes(lastName.toLowerCase()) &&
           (!firstName || participantName.toLowerCase().includes(firstName.toLowerCase()));
  });
  
  // Check if the employee has the operational circle leader role
  const operationalCircleRole = employeeRoles.find(role => 
    role.roleName.toLowerCase().includes(OPERATIONAL_CIRCLE_LEADER_ROLE.toLowerCase())
  );
  
  // If the employee is not an operational circle leader, return undefined
  if (!operationalCircleRole || !operationalCircleRole.circleName) {
    return undefined;
  }
  
  // Find the circle in the circles data
  const circle = circlesData.find(circle => 
    circle.name.toLowerCase() === operationalCircleRole.circleName?.toLowerCase()
  );
  
  // Return the cleaned functional type if found, otherwise undefined
  return circle ? cleanFunctionalType(circle.functionalType) : undefined;
};
