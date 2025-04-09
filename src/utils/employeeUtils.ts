
import { Employee, RoleData, EmployeeWithRoles } from "@/types";
import { formatName, cleanRoleName } from "./formatUtils";
import { calculateStandardSalary } from "./salaryUtils";
import { 
  findRolesWithFTEForEmployee, 
  calculateTotalFTE, 
  normalizeRolesFTE 
} from "./fteUtils";

// Re-export formatters and utilities that are used elsewhere
export { 
  formatSalary, 
  formatName, 
  formatFTE, 
  cleanRoleName 
} from "./formatUtils";

export { 
  calculateStandardSalary,
  getSalaryDifference
} from "./salaryUtils";

export { 
  calculateTotalFTE, 
  normalizeRolesFTE 
} from "./fteUtils";

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
