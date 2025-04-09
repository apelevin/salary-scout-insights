
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

export const processEmployeesWithRoles = (
  employees: Employee[], 
  rolesData: RoleData[], 
  customStandardSalaries: Map<string, number>,
  circlesData: CircleData[] = [],
  leadershipData: LeadershipData[] = []
) => {
  return employees.map(emp => {
    const nameParts = formatName(emp.name).split(' ');
    const lastName = nameParts[0];
    const firstName = nameParts.length > 1 ? nameParts[1] : '';
    
    const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName, rolesData);
    const roles = Array.from(rolesFTEMap.keys());
    const totalFTE = calculateTotalFTE(rolesFTEMap);
    
    const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
    
    // Find circle leadership info
    const { circleType, circleCount } = findCircleLeadershipInfo(lastName, firstName, rolesData, circlesData);
    
    // Debug log circle information
    console.log(`Employee: ${emp.name}, Circle Type: ${circleType}, Circle Count: ${circleCount}`);
    
    const standardSalary = calculateStandardSalary(
      normalizedRolesFTE, 
      rolesData, 
      employees, 
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
  const GENERIC_LEADER_ROLE = "лидер"; // Case insensitive
  
  // Find the employee by name
  const employeeRoles = rolesData.filter(role => {
    if (!role.participantName) return false;
    
    const participantName = formatName(role.participantName);
    return participantName.toLowerCase().includes(lastName.toLowerCase()) &&
           (!firstName || participantName.toLowerCase().includes(firstName.toLowerCase()));
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
  
  // Create a set to store unique functional types
  const circleTypes = new Set<string>();
  
  // Iterate over each leader role to find circle information
  for (const leaderRole of leaderRoles) {
    if (leaderRole.circleName) {
      const circle = circlesData.find(circle => 
        circle.name.toLowerCase() === leaderRole.circleName?.toLowerCase()
      );
      
      if (circle && circle.functionalType) {
        circleTypes.add(cleanFunctionalType(circle.functionalType));
      }
    }
  }
  
  // Combine circle types if there are multiple types
  let circleType: string | undefined = undefined;
  
  if (circleTypes.size > 0) {
    circleType = Array.from(circleTypes).join(' & ');
  }
  
  return { 
    circleType, 
    circleCount
  };
};

// These functions are kept for backwards compatibility but are no longer used directly
export const findOperationalCircleInfo = findCircleLeadershipInfo;
export const findStrategicCircleCount = () => undefined;
