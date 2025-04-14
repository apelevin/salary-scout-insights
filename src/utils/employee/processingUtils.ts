
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
  // Log circles data for debugging
  console.log(`Starting to process ${employees.length} employees with ${circlesData.length} circles:`, 
    circlesData.slice(0, 5).map(c => ({ name: c.name, type: c.functionalType }))
  );

  return employees.map(emp => {
    const nameParts = formatName(emp.name).split(' ');
    const lastName = nameParts[0];
    const firstName = nameParts.length > 1 ? nameParts[1] : '';
    
    const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName, rolesData);
    const roles = Array.from(rolesFTEMap.keys());
    const totalFTE = calculateTotalFTE(rolesFTEMap);
    
    const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
    
    // Find circle leadership info
    const { circleType, circleCount, leadCircles } = findCircleLeadershipInfo(lastName, firstName, rolesData, circlesData);
    
    // Log leadership data for debugging
    console.log(`Processing employee ${emp.name} with leadership:`, { 
      circleType, 
      circleCount,
      leadCircles: leadCircles.length > 0 ? leadCircles.map(c => c.name) : [],
      leadershipDataEntries: leadershipData?.length || 0 
    });
    
    const standardSalary = calculateStandardSalary(
      normalizedRolesFTE, 
      rolesData, 
      employees, 
      customStandardSalaries,
      leadershipData,
      circleType,
      circleCount
    );
    
    return {
      ...emp,
      roles,
      totalFTE,
      normalizedRolesFTE,
      standardSalary,
      operationalCircleType: circleType,
      operationalCircleCount: circleCount,
      leadCircles: leadCircles,
      strategicCircleCount: undefined // no longer needed as separate count
    };
  });
};
