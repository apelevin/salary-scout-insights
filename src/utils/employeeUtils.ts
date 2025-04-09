
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
    
    // Find operational and strategic circle info and count
    const { operationalCircleType, operationalCircleCount } = findOperationalCircleInfo(lastName, firstName, rolesData, circlesData);
    const strategicCircleCount = findStrategicCircleCount(lastName, firstName, rolesData);
    
    return {
      ...emp,
      roles,
      totalFTE,
      normalizedRolesFTE,
      standardSalary,
      operationalCircleType,
      operationalCircleCount,
      strategicCircleCount
    };
  });
};

// Function to find the operational circle information for an employee
export const findOperationalCircleInfo = (
  lastName: string,
  firstName: string,
  rolesData: RoleData[],
  circlesData: CircleData[]
): { operationalCircleType?: string, operationalCircleCount?: number } => {
  // Constant for the operational circle leader role name
  const OPERATIONAL_CIRCLE_LEADER_ROLE = "лидер операционного круга";
  
  // Find the employee by name
  const employeeRoles = rolesData.filter(role => {
    const participantName = formatName(role.participantName);
    return participantName.toLowerCase().includes(lastName.toLowerCase()) &&
           (!firstName || participantName.toLowerCase().includes(firstName.toLowerCase()));
  });
  
  // Check if the employee has the operational circle leader role
  const operationalCircleRoles = employeeRoles.filter(role => 
    role.roleName.toLowerCase().includes(OPERATIONAL_CIRCLE_LEADER_ROLE.toLowerCase())
  );
  
  // If the employee is not an operational circle leader, return empty values
  if (operationalCircleRoles.length === 0) {
    return { operationalCircleType: undefined, operationalCircleCount: undefined };
  }
  
  // Count the number of operational circles
  const operationalCircleCount = operationalCircleRoles.length;
  
  // Get the functional type from the first operational circle found
  let operationalCircleType: string | undefined = undefined;
  
  if (operationalCircleRoles[0].circleName) {
    const circle = circlesData.find(circle => 
      circle.name.toLowerCase() === operationalCircleRoles[0].circleName?.toLowerCase()
    );
    
    operationalCircleType = circle ? cleanFunctionalType(circle.functionalType) : undefined;
  }
  
  return { 
    operationalCircleType, 
    operationalCircleCount
  };
};

// Function to find the strategic circle count for an employee
export const findStrategicCircleCount = (
  lastName: string,
  firstName: string,
  rolesData: RoleData[]
): number | undefined => {
  // Constant for the strategic circle leader role name
  const STRATEGIC_CIRCLE_LEADER_ROLE = "лидер стратегического круга";
  
  // Find the employee by name
  const employeeRoles = rolesData.filter(role => {
    const participantName = formatName(role.participantName);
    return participantName.toLowerCase().includes(lastName.toLowerCase()) &&
           (!firstName || participantName.toLowerCase().includes(firstName.toLowerCase()));
  });
  
  // Check if the employee has the strategic circle leader role
  const strategicCircleRoles = employeeRoles.filter(role => 
    role.roleName.toLowerCase().includes(STRATEGIC_CIRCLE_LEADER_ROLE.toLowerCase())
  );
  
  // If the employee has no strategic circle roles, return undefined
  if (strategicCircleRoles.length === 0) {
    return undefined;
  }
  
  // Return the number of strategic circles
  return strategicCircleRoles.length;
};

// The old function is replaced by the new findOperationalCircleInfo function
const findOperationalCircleType = findOperationalCircleInfo;

