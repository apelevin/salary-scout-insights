
import { Employee, RoleData, EmployeeWithRoles, CircleData, LeadershipData } from "@/types";
import { formatName } from "../formatUtils";
import { calculateStandardSalary } from "../salary";
import { 
  findRolesWithFTEForEmployee, 
  calculateTotalFTE, 
  normalizeRolesFTE 
} from "../fteUtils";
import { findCircleLeadershipInfo } from "./leadershipUtils";

/**
 * Process employees data with roles to create enriched employee objects
 */
export const processEmployeesWithRoles = (
  employees: Employee[], 
  rolesData: RoleData[], 
  customStandardSalaries: Map<string, number>,
  circlesData: CircleData[] = [],
  leadershipData: LeadershipData[] = []
) => {
  return employees.map(emp => {
    const nameParts = formatName(emp.name).split(' ');
    const lastName = nameParts[0];
    const firstName = nameParts.length > 1 ? nameParts[1] : '';
    
    const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName, rolesData);
    const roles = Array.from(rolesFTEMap.keys());
    const totalFTE = calculateTotalFTE(rolesFTEMap);
    
    const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
    
    const standardSalary = calculateStandardSalary(
      normalizedRolesFTE, 
      rolesData, 
      employees, 
      customStandardSalaries
    );
    
    // Find leadership information for this employee
    const { circleCount, leadCircles } = findCircleLeadershipInfo(
      lastName,
      firstName,
      rolesData,
      circlesData
    );
    
    return {
      ...emp,
      roles,
      totalFTE,
      normalizedRolesFTE,
      standardSalary,
      operationalCircleCount: circleCount,
      leadCircles
    };
  });
};
