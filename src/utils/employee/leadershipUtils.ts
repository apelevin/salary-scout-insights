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
  console.log(`Leadership roles:`, leaderRoles.map(r => ({ role: r.roleName, circle: r.circleName })));
  
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
      
      // Find the circle with matching name in circles data
      const circle = circlesData.find(circle => 
        circle.name && 
        circle.name.toLowerCase().trim() === circleName.toLowerCase().trim()
      );
      
      if (circle) {
        console.log(`Found circle "${circleName}" with functional type: "${circle.functionalType || 'Not specified'}"`);
        leadCircles.push(circle);
        if (circle.functionalType && !circleType) {
          // Use the functional type
          circleType = circle.functionalType;
          console.log(`Found functional type for ${lastName} ${firstName}: ${circleType} (from circle ${role.circleName})`);
        }
      } else {
        // Try to determine functional type from circle name if not found in data
        let derivedType = '';
        
        // Derive the circle type based on its name
        const lowerName = circleName.toLowerCase();
        if (lowerName.includes('marketing') || lowerName.includes('маркетинг') || lowerName.includes('acquisition')) {
          derivedType = 'Marketing';
        } else if (lowerName.includes('sales') || lowerName.includes('продаж')) {
          derivedType = 'Sales';
        } else if (lowerName.includes('discovery') || lowerName.includes('delivery') || 
                  lowerName.includes('hub') || lowerName.includes('bot.one')) {
          derivedType = 'Delivery & Discovery';
        }
        
        // Even if the circle is not found in circlesData, create a basic entry for it
        leadCircles.push({ name: circleName, functionalType: derivedType });
        
        // Set the circle type if not already set
        if (!circleType) {
          circleType = derivedType;
        }
        
        console.log(`Circle "${circleName}" not found in circles data, creating basic entry with derived type: ${derivedType}`);
      }
    }
  }
  
  return { 
    circleType, 
    circleCount,
    leadCircles
  };
};

// Helper function to format names (imported from formatUtils)
// Keep this internal reference for backward compatibility
import { formatName } from "../formatUtils";

// These functions are kept for backwards compatibility but are no longer used directly
export const findOperationalCircleInfo = findCircleLeadershipInfo;
export const findStrategicCircleCount = () => undefined;
