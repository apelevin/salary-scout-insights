
import { useState, useEffect } from "react";
import { RoleData, Employee } from "@/types";
import { cleanRoleName } from "@/utils/formatUtils";
import { calculateStandardRate } from "@/utils/salaryUtils";

interface RoleWithSalaries {
  roleName: string;
  minSalary: number;
  maxSalary: number;
  standardSalary: number;
  salaries: number[];
  isEditing: boolean;
  editValue: string;
}

export const useRolesData = (rolesData: RoleData[] = [], employees: Employee[] = []) => {
  const [roles, setRoles] = useState<RoleWithSalaries[]>([]);
  
  const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
  const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
  const GENERIC_LEADER_ROLE = "лидер";
  const NORMALIZED_LEADER_ROLE = "Лидер";

  const findSalariesForRole = (roleName: string): number[] => {
    if (!roleName || !rolesData.length || !employees.length) return [];
    
    const salaries: number[] = [];
    const normalizedRoleName = roleName.toLowerCase();
    
    const isLeaderRole = normalizedRoleName === NORMALIZED_LEADER_ROLE.toLowerCase();
    
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      let matchesRole = false;
      const entryRoleName = entry.roleName.toLowerCase();
      
      if (isLeaderRole) {
        matchesRole = entryRoleName === GENERIC_LEADER_ROLE.toLowerCase() || 
                      entryRoleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
                      entryRoleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase());
      } else {
        const cleanedRoleName = cleanRoleName(entry.roleName).toLowerCase();
        matchesRole = cleanedRoleName === normalizedRoleName;
      }
      
      if (matchesRole) {
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
    
    return salaries;
  };

  useEffect(() => {
    const allRoles = rolesData.map((role) => {
      const roleName = role.roleName.toLowerCase();
      if (
        roleName === GENERIC_LEADER_ROLE.toLowerCase() || 
        roleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
        roleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase())
      ) {
        return NORMALIZED_LEADER_ROLE;
      } else {
        return cleanRoleName(role.roleName);
      }
    }).filter(Boolean);
    
    const uniqueRoles = [...new Set(allRoles)]
      .filter(roleName => roleName.toLowerCase() !== 'ceo')
      .sort((a, b) => a.localeCompare(b));
    
    const rolesWithSalaries = uniqueRoles.map(role => {
      const salaries = findSalariesForRole(role);
      
      // Make sure we're calculating min and max correctly
      const minSalary = salaries.length ? Math.min(...salaries) : 0;
      const maxSalary = salaries.length ? Math.max(...salaries) : 0;
      const standardSalary = salaries.length ? calculateStandardRate(minSalary, maxSalary) : 0;
      
      console.log(`Role: ${role}, Min: ${minSalary}, Standard: ${standardSalary}, Max: ${maxSalary}, Salaries: ${salaries.length}`);
      
      return {
        roleName: role,
        minSalary,
        maxSalary,
        standardSalary,
        salaries,
        isEditing: false,
        editValue: standardSalary.toString()
      };
    });

    setRoles(rolesWithSalaries);
  }, [rolesData, employees]);

  return { roles };
};
