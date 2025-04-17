
import { RoleData } from "@/types";
import { cleanRoleName, normalizeText } from "./formatUtils";

// Constant leader role names - moved outside function to avoid recreation
const LEADER_ROLES = {
  OPERATIONAL: "лидер операционного круга",
  STRATEGIC: "лидер стратегического круга",
  GENERIC: "лидер",
  NORMALIZED: "Лидер"
};

/**
 * Finds all roles with FTE values for a specific employee
 */
export const findRolesWithFTEForEmployee = (
  lastName: string, 
  firstName: string, 
  rolesData: RoleData[]
): Map<string, number> => {
  if (!lastName || !rolesData?.length) return new Map();
  
  const rolesWithFTE = new Map<string, number>();
  
  const normalizedLastName = lastName.toLowerCase();
  const normalizedFirstName = firstName ? firstName.toLowerCase() : '';
  
  rolesData.forEach(entry => {
    if (!entry.participantName || !entry.roleName) return;
    
    const participantNameParts = normalizeText(entry.participantName)
      .split(/\s+/)
      .map(part => part.toLowerCase());
    
    // Check if the last name matches
    const lastNameMatches = participantNameParts.some(part => part === normalizedLastName);
    
    // If first name is provided, check that too, otherwise just match on last name
    const firstNameMatches = !normalizedFirstName || 
                             participantNameParts.some(part => part === normalizedFirstName);
    
    if (lastNameMatches && firstNameMatches) {
      // Normalize role name
      const normalizedRoleName = entry.roleName.toLowerCase();
      let roleName;
      
      // Check if the role is a leader role and normalize it
      if (
        normalizedRoleName === LEADER_ROLES.GENERIC.toLowerCase() || 
        normalizedRoleName.includes(LEADER_ROLES.OPERATIONAL.toLowerCase()) || 
        normalizedRoleName.includes(LEADER_ROLES.STRATEGIC.toLowerCase())
      ) {
        roleName = LEADER_ROLES.NORMALIZED; // Normalize all leader roles
      } else {
        roleName = cleanRoleName(entry.roleName);
      }
      
      // Add or update FTE for this role
      const currentFTE = rolesWithFTE.get(roleName) || 0;
      const entryFTE = entry.fte !== undefined && !isNaN(entry.fte) ? entry.fte : 0;
      rolesWithFTE.set(roleName, currentFTE + entryFTE);
    }
  });
  
  return rolesWithFTE;
};

/**
 * Calculates total FTE for all roles
 */
export const calculateTotalFTE = (rolesMap: Map<string, number>): number => {
  if (!rolesMap || rolesMap.size === 0) return 0;
  
  return Array.from(rolesMap.values()).reduce((sum, fte) => sum + (fte || 0), 0);
};

/**
 * Normalizes role FTEs to be proportional to the total FTE
 */
export const normalizeRolesFTE = (rolesMap: Map<string, number>, totalFTE: number): Map<string, number> => {
  if (!rolesMap || rolesMap.size === 0 || !totalFTE || totalFTE <= 0) return rolesMap;
  if (totalFTE === 1) return rolesMap;
  
  const normalizedMap = new Map<string, number>();
  
  for (const [role, fte] of rolesMap.entries()) {
    const normalizedFTE = fte / totalFTE;
    normalizedMap.set(role, normalizedFTE);
  }
  
  return normalizedMap;
};
