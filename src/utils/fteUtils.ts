
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
      const roleName = cleanRoleName(entry.roleName);
      
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
