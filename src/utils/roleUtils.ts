
import { RoleData, Employee } from "@/types";
import { cleanRoleName } from "./formatUtils";

// Constant leader role names
const LEADER_ROLES = {
  OPERATIONAL_LEADER: "лидер операционного круга",
  STRATEGIC_LEADER: "лидер стратегического круга",
  GENERIC_LEADER: "лидер",
  NORMALIZED_LEADER: "Лидер"
};

/**
 * Normalizes role names, with special handling for leader roles
 */
export const normalizeLeaderRoles = (roleName: string): string => {
  if (!roleName) return "";
  
  const normalizedRoleName = roleName.toLowerCase();
  
  // Check if this is any type of leader role and normalize to a standard name
  if (
    normalizedRoleName === LEADER_ROLES.GENERIC_LEADER.toLowerCase() ||
    normalizedRoleName.includes(LEADER_ROLES.OPERATIONAL_LEADER.toLowerCase()) ||
    normalizedRoleName.includes(LEADER_ROLES.STRATEGIC_LEADER.toLowerCase())
  ) {
    return LEADER_ROLES.NORMALIZED_LEADER;
  }
  
  // For other roles, return the cleaned role name
  return roleName;
};

/**
 * Finds all salaries for employees assigned to a specific role
 */
export const findSalariesForRole = (
  roleName: string,
  rolesData: RoleData[],
  employees: Employee[]
): number[] => {
  if (!roleName || !rolesData.length || !employees.length) return [];
  
  const salaries: number[] = [];
  const normalizedRoleName = roleName.toLowerCase();
  const isLeaderRole = normalizedRoleName === LEADER_ROLES.NORMALIZED_LEADER.toLowerCase();
  
  // Process each role entry
  rolesData.forEach(entry => {
    if (!entry.participantName || !entry.roleName) return;
    
    // Check if this entry matches the role we're looking for
    const entryRoleName = entry.roleName.toLowerCase();
    let matchesRole = false;
    
    if (isLeaderRole) {
      // For leader roles, check any leader role type
      matchesRole = entryRoleName === LEADER_ROLES.GENERIC_LEADER.toLowerCase() ||
                    entryRoleName.includes(LEADER_ROLES.OPERATIONAL_LEADER.toLowerCase()) ||
                    entryRoleName.includes(LEADER_ROLES.STRATEGIC_LEADER.toLowerCase());
    } else {
      // For regular roles, compare normalized names
      matchesRole = cleanRoleName(entry.roleName).toLowerCase() === normalizedRoleName;
    }
    
    if (matchesRole) {
      // Find employee matching this role participant
      const participantSalary = findEmployeeSalaryByName(entry.participantName, employees);
      if (participantSalary) {
        salaries.push(participantSalary);
      }
    }
  });
  
  return salaries;
};

/**
 * Helper function to find employee salary by their name
 */
const findEmployeeSalaryByName = (
  participantName: string,
  employees: Employee[]
): number | undefined => {
  // Process participant name
  const participantNameParts = participantName
    .replace(/["']/g, '')
    .trim()
    .split(/\s+/)
    .map(part => part.toLowerCase());
  
  if (participantNameParts.length < 2) return undefined;
    
  const lastName = participantNameParts[0];
  const firstName = participantNameParts[1];
  
  // Find matching employee
  const matchingEmployee = employees.find(emp => {
    const empNameParts = emp.name
      .replace(/["']/g, '')
      .trim()
      .split(/\s+/)
      .map(part => part.toLowerCase());
    
    return empNameParts.some(part => part === lastName) && 
           empNameParts.some(part => part === firstName);
  });
  
  return matchingEmployee?.salary;
};
