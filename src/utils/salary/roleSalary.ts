
import { Employee, RoleData, LeadershipData } from "@/types";
import { cleanRoleName } from "../formatUtils";
import { findLeadershipStandardSalary } from "./leadershipSalary";
import { calculateStandardRate } from "./rateCalculation";

/**
 * Find the standard rate for a specific role
 * 
 * @param roleName The name of the role
 * @param rolesData Data about all roles
 * @param employees Employee data
 * @param customStandardSalaries Map of custom standard salaries
 * @param leadershipData Optional leadership data
 * @param employeeCircleType Optional circle type for leadership roles
 * @param employeeCircleCount Optional circle count for leadership roles
 * @returns The calculated standard rate for the role
 */
export const findStandardRateForRole = (
  roleName: string, 
  rolesData: RoleData[], 
  employees: Employee[],
  customStandardSalaries: Map<string, number>,
  leadershipData?: LeadershipData[],
  employeeCircleType?: string,
  employeeCircleCount?: number
): number => {
  // Special case for leader role
  if (roleName.toLowerCase() === "лидер" && leadershipData && employeeCircleType && employeeCircleCount) {
    const leadershipSalary = findLeadershipStandardSalary(
      employeeCircleType,
      String(employeeCircleCount),
      leadershipData
    );
    
    if (leadershipSalary !== null) {
      return leadershipSalary;
    }
  }
  
  if (customStandardSalaries.has(roleName)) {
    return customStandardSalaries.get(roleName) || 0;
  }
  
  if (!roleName || !rolesData.length) return 0;
  
  const normalizedRoleName = roleName.toLowerCase();
  
  const salaries: number[] = [];
  
  rolesData.forEach(entry => {
    if (!entry.participantName || !entry.roleName) return;
    
    const cleanedRoleName = cleanRoleName(entry.roleName).toLowerCase();
    
    if (cleanedRoleName === normalizedRoleName) {
      const participantNameParts = entry.participantName
        .replace(/["']/g, '')
        .trim()
        .split(/\s+/)
        .map(part => part.toLowerCase());
      
      if (participantNameParts.length < 2) return;
        
      const lastName = participantNameParts[0];
      const firstName = participantNameParts[1];
      
      employees.forEach(emp => {
        const empNameParts = emp.name
          .replace(/["']/g, '')
          .trim()
          .split(/\s+/)
          .map(part => part.toLowerCase());
        
        if (
          empNameParts.some(part => part === lastName) && 
          empNameParts.some(part => part === firstName)
        ) {
          salaries.push(emp.salary);
        }
      });
    }
  });
  
  if (salaries.length === 0) return 0;
  
  const minSalary = Math.min(...salaries);
  const maxSalary = Math.max(...salaries);
  
  return calculateStandardRate(minSalary, maxSalary);
};
