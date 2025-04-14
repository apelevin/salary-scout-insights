
import { CircleData, RoleData } from "@/types";
import { cleanFunctionalType } from "../formatUtils";

/**
 * Function to find the leadership information for an employee
 */
export const findCircleLeadershipInfo = (
  lastName: string,
  firstName: string,
  rolesData: RoleData[],
  circlesData: CircleData[]
): { circleType?: string, circleCount: number, leadCircles: CircleData[] } => {
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
    return { circleType: undefined, circleCount: 0, leadCircles: [] };
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
    return { circleType: undefined, circleCount: 0, leadCircles: [] };
  }
  
  console.log(`Found ${leaderRoles.length} leadership roles for: ${lastName} ${firstName}`);
  console.log(`Leadership roles:`, leaderRoles.map(r => ({ role: r.roleName, circle: r.circleName })));
  
  // Count the total number of circles led
  const circleCount = leaderRoles.length;

  // Track circles that the employee leads
  const leadCircles: CircleData[] = [];
  
  // Get the functional type from the first leader role that has a circleName defined
  let circleType: string | undefined = undefined;
  
  // First check leadership roles for functional type
  for (const role of leaderRoles) {
    if (role.circleName) {
      circleType = cleanFunctionalType(role.circleName);
      console.log(`Found functional type directly from leadership role: ${circleType}`);
      break;
    }
  }
  
  // If no functional type found directly from leadership roles, get it from the circles data
  if (!circleType) {
    for (const role of leaderRoles) {
      if (role.circleName) {
        const circleName = role.circleName.trim().replace(/["']/g, '');
        console.log(`Looking for circle "${circleName}" in circles data (${circlesData.length} entries)`);
        
        // Find the circle with matching name in circles data
        const circle = circlesData.find(circle => 
          circle.name && 
          circle.name.toLowerCase().trim() === circleName.toLowerCase().trim()
        );
        
        if (circle) {
          console.log(`Found circle "${circleName}" with functional type: "${circle.functionalType || 'Not specified'}"`);
          leadCircles.push(circle);
          if (circle.functionalType && !circleType) {
            circleType = cleanFunctionalType(circle.functionalType);
            console.log(`Found functional type for ${lastName} ${firstName}: ${circleType} (from circle ${role.circleName})`);
          } else if (circle) {
            console.log(`Circle "${role.circleName}" found but has no functional type`);
          }
        } else {
          // Even if the circle is not found in circlesData, create a basic entry for it
          leadCircles.push({ name: circleName, functionalType: '' });
          console.log(`Circle "${circleName}" not found in circles data, creating basic entry`);
        }
      }
    }
  }
  
  // If still no functional type, try to extract it from the circle name
  if (!circleType) {
    console.log(`No functional type found in circles data, trying to extract from circle names`);
    
    for (const role of leaderRoles) {
      if (role.circleName) {
        const circleName = role.circleName.toLowerCase();
        console.log(`Analyzing circle name: "${circleName}"`);
        
        if (circleName.includes('delivery') && circleName.includes('discovery')) {
          circleType = 'Delivery & Discovery';
          console.log(`Circle name contains "Delivery & Discovery"`);
          break;
        } else if (circleName.includes('delivery')) {
          circleType = 'Delivery';
          console.log(`Circle name contains "Delivery"`);
          break;
        } else if (circleName.includes('discovery')) {
          circleType = 'Discovery';
          console.log(`Circle name contains "Discovery"`);
          break;
        } else if (circleName.includes('platform')) {
          circleType = 'Platform';
          console.log(`Circle name contains "Platform"`);
          break;
        } else if (circleName.includes('enablement')) {
          circleType = 'Enablement';
          console.log(`Circle name contains "Enablement"`);
          break;
        }
      }
    }
    
    if (circleType) {
      console.log(`Extracted functional type from circle name for ${lastName} ${firstName}: ${circleType}`);
    } else {
      console.log(`Could not extract functional type from circle names`);
    }
  }
  
  // Fallback: If still no type, use "Не указано" instead of "General"
  if (!circleType && circleCount > 0) {
    circleType = "Не указано";
    console.log(`Using fallback type "Не указано" for ${lastName} ${firstName}`);
  }
  
  return { 
    circleType, 
    circleCount,
    leadCircles
  };
};

// Helper function to format names (imported from formatUtils)
import { formatName } from "../formatUtils";

// These functions are kept for backwards compatibility but are no longer used directly
export const findOperationalCircleInfo = findCircleLeadershipInfo;
export const findStrategicCircleCount = () => undefined;
