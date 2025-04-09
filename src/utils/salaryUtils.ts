
import { Employee, RoleData, LeadershipData } from "@/types";
import { cleanRoleName } from "./formatUtils";

export const calculateStandardRate = (min: number, max: number): number => {
  if (min === max) {
    return max;
  }
  return min + (max - min) * 0.25;
};

export const findStandardRateForRole = (
  roleName: string, 
  rolesData: RoleData[], 
  employees: Employee[],
  customStandardSalaries: Map<string, number>,
  leadershipData?: LeadershipData[],
  circleType?: string,
  circleCount?: number
): number => {
  // Check for custom standard salaries first
  if (customStandardSalaries.has(roleName)) {
    return customStandardSalaries.get(roleName) || 0;
  }
  
  // Special case for leader role - use leadership data if available
  const isLeaderRole = roleName.toLowerCase() === "лидер".toLowerCase();
  
  if (isLeaderRole && leadershipData && leadershipData.length > 0 && circleType && circleCount) {
    // Find a matching entry in leadershipData based on type and count
    const leadershipEntry = leadershipData.find(entry => 
      entry.leadershipType?.toLowerCase() === circleType.toLowerCase() && 
      entry.circleCount === String(circleCount)
    );
    
    if (leadershipEntry) {
      return leadershipEntry.standardSalary;
    }
  }
  
  // Fall back to regular salary calculation if no leadership data matched
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

export const calculateStandardSalary = (
  normalizedRolesFTE: Map<string, number>, 
  rolesData: RoleData[], 
  employees: Employee[],
  customStandardSalaries: Map<string, number>,
  leadershipData?: LeadershipData[],
  circleType?: string,
  circleCount?: number
): number => {
  let totalStandardSalary = 0;
  
  for (const [roleName, fte] of normalizedRolesFTE.entries()) {
    // For the leader role, use the leadership data if available
    const standardRateForRole = findStandardRateForRole(
      roleName, 
      rolesData, 
      employees, 
      customStandardSalaries,
      leadershipData,
      circleType,
      circleCount
    );
    totalStandardSalary += fte * standardRateForRole;
  }
  
  return totalStandardSalary;
};

export const getSalaryDifference = (standardSalary: number | undefined, actualSalary: number): { text: string, className: string } => {
  if (!standardSalary || standardSalary === 0) {
    return { text: '—', className: 'text-gray-400' };
  }
  
  const difference = standardSalary - actualSalary;
  
  if (difference > 0) {
    return { 
      text: `+${new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(difference)}`, 
      className: 'text-green-600 font-medium' 
    };
  } else if (difference < 0) {
    return { 
      text: new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(difference), 
      className: 'text-red-600 font-medium' 
    };
  } else {
    return { 
      text: '0 ₽', 
      className: 'text-gray-500' 
    };
  }
};
