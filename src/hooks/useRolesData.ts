import { useState, useEffect } from "react";
import { RoleData, Employee } from "@/types";
import { cleanRoleName } from "@/utils/formatUtils";
import { calculateStandardRate } from "@/utils/salaryUtils";
import { normalizeLeaderRoles, findSalariesForRole } from "@/utils/roleUtils";

export interface RoleWithSalaries {
  roleName: string;
  minSalary: number;
  maxSalary: number;
  standardSalary: number;
  salaries: number[];
  isEditing: boolean;
  editValue: string;
}

export const useRolesData = (
  rolesData: RoleData[] = [], 
  employees: Employee[] = [],
  customStandardSalaries?: Map<string, number>
) => {
  const [roles, setRoles] = useState<RoleWithSalaries[]>([]);

  useEffect(() => {
    // Extract and normalize all role names from rolesData
    const normalizedRoleNames = extractUniqueRoleNames(rolesData);
    
    // Map normalized roles to role objects with salary data
    const rolesWithSalaries = createRolesWithSalaries(
      normalizedRoleNames,
      rolesData,
      employees,
      customStandardSalaries
    );

    setRoles(rolesWithSalaries);
  }, [rolesData, employees, customStandardSalaries]);

  return { roles };
};

/**
 * Extracts unique role names from roles data and normalizes them
 */
const extractUniqueRoleNames = (rolesData: RoleData[]): string[] => {
  // Extract and normalize role names
  const allRoles = rolesData
    .map((role) => normalizeLeaderRoles(cleanRoleName(role.roleName)))
    .filter(Boolean);
    
  // Create a unique set of roles, filter out CEO and sort alphabetically
  return [...new Set(allRoles)]
    .filter(roleName => roleName.toLowerCase() !== 'ceo')
    .sort((a, b) => a.localeCompare(b));
};

/**
 * Creates array of roles with their salary information
 */
const createRolesWithSalaries = (
  uniqueRoles: string[],
  rolesData: RoleData[],
  employees: Employee[],
  customStandardSalaries?: Map<string, number>
): RoleWithSalaries[] => {
  return uniqueRoles.map(role => {
    // Find all salaries associated with this role
    const salaries = findSalariesForRole(role, rolesData, employees);
    
    // Calculate min and max salaries
    const minSalary = salaries.length ? Math.min(...salaries) : 0;
    const maxSalary = salaries.length ? Math.max(...salaries) : 0;
    
    // Determine standard salary - use custom if available, otherwise calculate
    const standardSalary = determineStandardSalary(
      role, 
      salaries, 
      minSalary,
      maxSalary,
      customStandardSalaries
    );
    
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
};

/**
 * Determines the standard salary for a role based on custom values or calculations
 */
const determineStandardSalary = (
  role: string,
  salaries: number[],
  minSalary: number,
  maxSalary: number,
  customStandardSalaries?: Map<string, number>
): number => {
  // Use custom standard salary if provided
  if (customStandardSalaries?.has(role)) {
    return customStandardSalaries.get(role) || 0;
  }
  
  // Otherwise calculate based on min and max
  return salaries.length ? calculateStandardRate(minSalary, maxSalary) : 0;
};
