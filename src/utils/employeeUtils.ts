
import { Employee, RoleData } from "@/types";

export const formatSalary = (salary: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(salary);
};

export const formatName = (name: string): string => {
  const cleanName = name.replace(/["']/g, '').trim();
  
  if (cleanName === "") {
    return "Без имени";
  }
  
  const nameParts = cleanName.split(/\s+/);
  
  if (nameParts.length >= 2) {
    return `${nameParts[0]} ${nameParts[1]}`;
  }
  
  return cleanName;
};

export const formatFTE = (fte: number): string => {
  return fte.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const cleanRoleName = (roleName: string): string => {
  return roleName.replace(/["']/g, '').trim();
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

export const calculateStandardRate = (min: number, max: number): number => {
  if (min === max) {
    return max;
  }
  return min + (max - min) * 0.5;
};

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

export const getSalaryDifference = (standardSalary: number | undefined, actualSalary: number): { text: string, className: string } => {
  if (!standardSalary || standardSalary === 0) {
    return { text: '—', className: 'text-gray-400' };
  }
  
  const difference = standardSalary - actualSalary;
  
  if (difference > 0) {
    return { 
      text: `+${formatSalary(difference)}`, 
      className: 'text-green-600 font-medium' 
    };
  } else if (difference < 0) {
    return { 
      text: formatSalary(difference), 
      className: 'text-red-600 font-medium' 
    };
  } else {
    return { 
      text: '0 ₽', 
      className: 'text-gray-500' 
    };
  }
};

export const processEmployeesWithRoles = (employees: Employee[], rolesData: RoleData[], customStandardSalaries: Map<string, number>) => {
  return employees.map(emp => {
    const nameParts = formatName(emp.name).split(' ');
    const lastName = nameParts[0];
    const firstName = nameParts.length > 1 ? nameParts[1] : '';
    
    const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName, rolesData);
    const roles = Array.from(rolesFTEMap.keys());
    const totalFTE = calculateTotalFTE(rolesFTEMap);
    
    const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
    
    const standardSalary = calculateStandardSalary(normalizedRolesFTE, rolesData, employees, customStandardSalaries);
    
    return {
      ...emp,
      roles,
      totalFTE,
      normalizedRolesFTE,
      standardSalary
    };
  });
};
