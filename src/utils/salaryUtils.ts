import { Employee, RoleData, LeadershipData } from "@/types";
import { cleanRoleName, cleanFunctionalType } from "./formatUtils";

export const calculateStandardRate = (min: number, max: number): number => {
  if (min === max) {
    return max;
  }
  return min + (max - min) * 0.3;
};

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

export const calculateStandardSalary = (
  normalizedRolesFTE: Map<string, number>, 
  rolesData: RoleData[], 
  employees: Employee[],
  customStandardSalaries: Map<string, number>,
  leadershipData?: LeadershipData[],
  employeeCircleType?: string,
  employeeCircleCount?: number
): number => {
  let totalStandardSalary = 0;
  
  for (const [roleName, fte] of normalizedRolesFTE.entries()) {
    const standardRateForRole = findStandardRateForRole(
      roleName, 
      rolesData, 
      employees, 
      customStandardSalaries,
      leadershipData,
      employeeCircleType,
      employeeCircleCount
    );
    totalStandardSalary += fte * standardRateForRole;
  }
  
  return totalStandardSalary;
};

export const getSalaryDifference = (standardSalary: number | undefined, actualSalary: number): { text: string, className: string } => {
  if (!standardSalary || standardSalary === 0) {
    return { text: '—', className: 'text-gray-400' };
  }
  
  // Changed direction of calculation: standardSalary - actualSalary
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

/**
 * Find the standard salary for a leadership role based on functional type and circle count
 * 
 * @param functionalType The functional type of the leadership (e.g., "Delivery", "Discovery")
 * @param circleCount The number of circles as a string
 * @param leadershipData Array of leadership data from the table
 * @returns The standard salary or null if not found
 */
export const findLeadershipStandardSalary = (
  functionalType: string,
  circleCount: string,
  leadershipData: LeadershipData[]
): number | null => {
  if (!functionalType || !circleCount || !leadershipData.length) {
    return null;
  }
  
  // Clean and normalize the functional type
  const cleanedType = cleanFunctionalType(functionalType).toLowerCase();
  
  // Look for exact match first
  for (const entry of leadershipData) {
    if (
      entry.leadershipType && 
      cleanFunctionalType(entry.leadershipType).toLowerCase() === cleanedType &&
      entry.circleCount === circleCount
    ) {
      return entry.standardSalary;
    }
  }
  
  // If no exact match, look for a partial match (type might include multiple functions)
  for (const entry of leadershipData) {
    if (
      entry.leadershipType && 
      cleanFunctionalType(entry.leadershipType).toLowerCase().includes(cleanedType) &&
      entry.circleCount === circleCount
    ) {
      return entry.standardSalary;
    }
  }
  
  return null;
};
