
import { Employee, RoleData, LeadershipData } from "@/types";
import { findStandardRateForRole } from "./roleSalary";

/**
 * Calculate the standard salary for an employee based on their roles
 * 
 * @param normalizedRolesFTE Map of normalized FTE values per role
 * @param rolesData Role data from the CSV
 * @param employees Employee data
 * @param customStandardSalaries Map of custom standard salaries
 * @param leadershipData Optional leadership data
 * @param employeeCircleType Optional circle type for leadership roles
 * @param employeeCircleCount Optional circle count for leadership roles
 * @returns The calculated standard salary
 */
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
