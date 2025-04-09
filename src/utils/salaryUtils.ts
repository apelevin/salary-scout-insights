
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
  
  if (isLeaderRole && leadershipData && leadershipData.length > 0) {
    // Convert circleCount to string for comparison with leadershipData
    const circleCountStr = circleCount !== undefined ? String(circleCount) : undefined;
    
    // Log values for debugging
    console.log(`Finding leadership salary for: Type=${circleType}, Count=${circleCountStr}`);
    
    if (circleType && circleCountStr) {
      // Find a matching entry in leadershipData based on type and count
      // First try exact match
      const exactMatch = leadershipData.find(entry => 
        entry.leadershipType?.toLowerCase() === circleType.toLowerCase() && 
        entry.circleCount === circleCountStr
      );
      
      if (exactMatch) {
        console.log(`Found exact leadership salary match: ${exactMatch.standardSalary} for ${circleType} with ${circleCountStr} circles`);
        return exactMatch.standardSalary;
      }
      
      // If no exact match, try to find a match for just the type with any count
      // This handles combined types like "Delivery & Discovery"
      const leadershipEntriesForType = leadershipData.filter(entry => 
        entry.leadershipType?.toLowerCase() === circleType.toLowerCase()
      );
      
      if (leadershipEntriesForType.length > 0) {
        // Find entry with matching count
        const countMatch = leadershipEntriesForType.find(entry => 
          entry.circleCount === circleCountStr
        );
        
        if (countMatch) {
          console.log(`Found leadership type+count match: ${countMatch.standardSalary} for ${circleType} with ${circleCountStr} circles`);
          return countMatch.standardSalary;
        }
      }
      
      console.log(`No matching leadership entry found for ${circleType} with ${circleCountStr} circles`);
    } else {
      console.log(`Missing circle type or count: Type=${circleType}, Count=${circleCountStr}`);
    }
    
    // If we have leadership data but no exact match was found,
    // return 0 instead of falling back to regular role-based calculation
    return 0;
  }
  
  // For non-leader roles, or if we don't have leadership data,
  // fall back to regular salary calculation
  if (!isLeaderRole && roleName && rolesData.length) {
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
  }
  
  return 0;
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
    const standardRateForRole = findStandardRateForRole(
      roleName, 
      rolesData, 
      employees, 
      customStandardSalaries,
      leadershipData,
      circleType,
      circleCount
    );
    
    // For debugging
    console.log(`Role: ${roleName}, FTE: ${fte}, Standard rate: ${standardRateForRole}, Contribution: ${fte * standardRateForRole}`);
    
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
