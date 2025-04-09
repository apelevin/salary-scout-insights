
import { RoleData } from "@/types";
import { cleanRoleName } from "./formatUtils";

export const findRolesWithFTEForEmployee = (
  lastName: string, 
  firstName: string, 
  rolesData: RoleData[]
): Map<string, number> => {
  if (!lastName || !firstName || !rolesData.length) return new Map();
  
  const rolesWithFTE = new Map<string, number>();
  
  const normalizedLastName = lastName.toLowerCase();
  const normalizedFirstName = firstName.toLowerCase();

  // Constants for the circle leader role names
  const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
  const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
  const GENERIC_LEADER_ROLE = "лидер";
  
  rolesData.forEach(entry => {
    if (!entry.participantName || !entry.roleName) return;
    
    const participantNameParts = entry.participantName
      .replace(/["']/g, '')
      .trim()
      .split(/\s+/)
      .map(part => part.toLowerCase());
    
    if (
      participantNameParts.some(part => part === normalizedLastName) && 
      participantNameParts.some(part => part === normalizedFirstName)
    ) {
      // Check if the role is a leader role and normalize it to "лидер"
      let roleName = entry.roleName.toLowerCase();
      const isLeaderRole = roleName === GENERIC_LEADER_ROLE.toLowerCase() || 
                          roleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
                          roleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase());
      
      if (isLeaderRole) {
        roleName = "лидер"; // Normalize all leader roles to "лидер"
      } else {
        roleName = cleanRoleName(entry.roleName);
      }
      
      if (rolesWithFTE.has(roleName)) {
        const currentFTE = rolesWithFTE.get(roleName) || 0;
        if (entry.fte !== undefined && !isNaN(entry.fte)) {
          rolesWithFTE.set(roleName, currentFTE + entry.fte);
        }
      } else {
        if (entry.fte !== undefined && !isNaN(entry.fte)) {
          rolesWithFTE.set(roleName, entry.fte);
        } else {
          rolesWithFTE.set(roleName, 0);
        }
      }
    }
  });
  
  return rolesWithFTE;
};

export const calculateTotalFTE = (rolesMap: Map<string, number>): number => {
  let total = 0;
  for (const fte of rolesMap.values()) {
    total += fte;
  }
  return total;
};

export const normalizeRolesFTE = (rolesMap: Map<string, number>, totalFTE: number): Map<string, number> => {
  if (totalFTE === 0) return rolesMap;
  if (totalFTE === 1) return rolesMap;
  
  const normalizedMap = new Map<string, number>();
  
  for (const [role, fte] of rolesMap.entries()) {
    const normalizedFTE = fte / totalFTE;
    normalizedMap.set(role, normalizedFTE);
  }
  
  return normalizedMap;
};
