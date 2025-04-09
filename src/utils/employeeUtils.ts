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
    
    // Find circle leadership info
    const { circleType, circleCount } = findCircleLeadershipInfo(lastName, firstName, rolesData, circlesData);
    
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
  
  // Find the employee by name
  const employeeRoles = rolesData.filter(role => {
    const participantName = formatName(role.participantName);
    return participantName.toLowerCase().includes(lastName.toLowerCase()) &&
           (!firstName || participantName.toLowerCase().includes(firstName.toLowerCase()));
  });
  
  // Check if the employee has any leader roles (operational or strategic)
  const leaderRoles = employeeRoles.filter(role => {
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
    role.roleName.toLowerCase().includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase())
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
