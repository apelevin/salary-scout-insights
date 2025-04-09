
import { Employee, RoleData } from "@/types";
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
  customStandardSalaries: Map<string, number>
): number => {
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
  customStandardSalaries: Map<string, number>
): number => {
  let totalStandardSalary = 0;
  
  for (const [roleName, fte] of normalizedRolesFTE.entries()) {
    const standardRateForRole = findStandardRateForRole(roleName, rolesData, employees, customStandardSalaries);
    totalStandardSalary += fte * standardRateForRole;
  }
  
  return totalStandardSalary;
};

export const getSalaryDifference = (standardSalary: number | undefined, actualSalary: number): { text: string, className: string } => {
  if (!standardSalary || standardSalary === 0) {
    return { text: '—', className: 'text-gray-400' };
  }
  
  // Calculate as Actual - Standard
  const difference = actualSalary - standardSalary;
  
  if (difference > 0) {
    return { 
      text: `+${new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(difference)}`, 
      className: 'text-red-600 font-medium' 
    };
  } else if (difference < 0) {
    return { 
      text: new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(difference), 
      className: 'text-green-600 font-medium' 
    };
  } else {
    return { 
      text: '0 ₽', 
      className: 'text-gray-500' 
    };
  }
};
