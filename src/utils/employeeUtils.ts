
import { Employee, RoleData, EmployeeWithRoles, CircleData, LeadershipData } from "@/types";
import { formatName, cleanRoleName, cleanFunctionalType } from "./formatUtils";
import { calculateStandardSalary } from "./salaryUtils";
import { 
  findRolesWithFTEForEmployee, 
  calculateTotalFTE, 
  normalizeRolesFTE 
} from "./fteUtils";

// Re-export the formatters we need from formatUtils
export { formatName, formatSalary } from "./formatUtils";
export { calculateStandardSalary, getSalaryDifference } from "./salaryUtils";
export { calculateTotalFTE, normalizeRolesFTE } from "./fteUtils";

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
    
    // Log leadership data for debugging
    console.log(`Processing employee ${emp.name} with leadership:`, { 
      circleType, 
      circleCount, 
      leadershipDataEntries: leadershipData?.length || 0 
    });
    
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
  const GENERIC_LEADER_ROLE = "лидер";
  
  // Find the employee by name
  const employeeRoles = rolesData.filter(role => {
    if (!role.participantName) return false;
    
    const participantName = formatName(role.participantName);
    return participantName.toLowerCase().includes(lastName.toLowerCase()) &&
           (!firstName || participantName.toLowerCase().includes(firstName.toLowerCase()));
  });
  
  if (employeeRoles.length === 0) {
    console.log(`No roles found for employee: ${lastName} ${firstName}`);
    return { circleType: undefined, circleCount: 0 };
  }
  
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
    console.log(`No leadership roles found for: ${lastName} ${firstName}`);
    return { circleType: undefined, circleCount: 0 };
  }
  
  console.log(`Found ${leaderRoles.length} leadership roles for: ${lastName} ${firstName}`);
  
  // Count the total number of circles led
  const circleCount = leaderRoles.length;
  
  // Get the functional type from the first operational circle found (if any)
  let circleType: string | undefined = undefined;
  
  // First try to find an operational circle with functional type
  for (const role of leaderRoles) {
    if (role.roleName?.toLowerCase().includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) && role.circleName) {
      const circle = circlesData.find(circle => 
        circle.name && circle.name.toLowerCase() === role.circleName?.toLowerCase()
      );
      
      if (circle?.functionalType) {
        circleType = cleanFunctionalType(circle.functionalType);
        console.log(`Found functional type for ${lastName} ${firstName}: ${circleType} (from circle ${role.circleName})`);
        break;
      }
    }
  }
  
  // If no functional type was found, try to extract it from the circle name
  if (!circleType) {
    for (const role of leaderRoles) {
      if (role.circleName) {
        const circleName = role.circleName.toLowerCase();
        if (circleName.includes('delivery')) {
          circleType = 'Delivery';
          break;
        } else if (circleName.includes('discovery')) {
          circleType = 'Discovery';
          break;
        } else if (circleName.includes('platform')) {
          circleType = 'Platform';
          break;
        } else if (circleName.includes('enablement')) {
          circleType = 'Enablement';
          break;
        }
      }
    }
    
    if (circleType) {
      console.log(`Extracted functional type from circle name for ${lastName} ${firstName}: ${circleType}`);
    }
  }
  
  // Fallback: If still no type, use "Не указано" instead of "General"
  if (!circleType && circleCount > 0) {
    circleType = "Не указано";
    console.log(`Using fallback type "Не указано" for ${lastName} ${firstName}`);
  }
  
  return { 
    circleType, 
    circleCount
  };
};

// These functions are kept for backwards compatibility but are no longer used directly
export const findOperationalCircleInfo = findCircleLeadershipInfo;
export const findStrategicCircleCount = () => undefined;
