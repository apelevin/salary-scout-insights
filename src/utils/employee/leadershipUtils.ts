
import { CircleData, RoleData } from "@/types";
import { formatName } from "../formatUtils";
import { normalizeFunctionalType } from "../csv/helpers";

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
  
  // Count the total number of circles led
  const circleCount = leaderRoles.length;

  // Track circles that the employee leads
  const leadCircles: CircleData[] = [];
  
  // Get the functional type from circles data
  let circleType: string | undefined = undefined;
  
  // Find matching circles in circles data
  for (const role of leaderRoles) {
    if (role.circleName) {
      const circleName = role.circleName.trim().replace(/["']/g, '');
      console.log(`Looking for circle "${circleName}" in circles data (${circlesData.length} entries)`);
      
      // Find exact circle with matching name in circles data
      const circle = circlesData.find(circle => 
        circle.name && 
        circle.name.toLowerCase().trim() === circleName.toLowerCase().trim()
      );
      
      if (circle) {
        console.log(`Found circle "${circleName}" with functional type: "${circle.functionalType || 'Not specified'}"`);
        // Use the EXACT functional type from the circles tab
        leadCircles.push({...circle}); // Clone the circle object to avoid reference issues
        if (circle.functionalType && !circleType) {
          // Use the functional type
          circleType = circle.functionalType;
        }
      } else {
        // Create a basic entry for this circle with unknown functional type
        // This ensures the circle name is shown even if it's not in the circles data
        leadCircles.push({ name: circleName, functionalType: "" });
      }
    }
  }
  
  return { 
    circleType, 
    circleCount,
    leadCircles
  };
};

// These functions are kept for backwards compatibility but are no longer used directly
export const findOperationalCircleInfo = findCircleLeadershipInfo;
export const findStrategicCircleCount = () => undefined;
