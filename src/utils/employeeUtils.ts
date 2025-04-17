
import { Employee } from "@/types";
import { formatName } from "./formatUtils";

/**
 * Find an employee by their formatted name
 */
export const findEmployeeByName = (employees: Employee[], formattedName: string): Employee | undefined => {
  if (!employees?.length || !formattedName) return undefined;
  
  // First try exact match
  let employee = employees.find(emp => {
    const empFormattedName = formatName(emp.name);
    return empFormattedName === formattedName;
  });
  
  // If no exact match, try matching just the last name
  if (!employee) {
    const lastName = formattedName.split(' ')[0]?.toLowerCase();
    if (lastName) {
      employee = employees.find(emp => {
        const empNameParts = emp.name.toLowerCase().split(' ');
        return empNameParts.includes(lastName);
      });
    }
  }
  
  return employee;
};

/**
 * Re-export formatName and formatSalary from formatUtils for backward compatibility
 */
export { formatName, formatSalary } from './formatUtils';

/**
 * Process employees with roles and calculate derived data
 * This is a stub function that should be implemented or imported from another file
 */
export const processEmployeesWithRoles = (
  employees: Employee[], 
  rolesData: any[], 
  customStandardSalaries: Map<string, number>,
  circlesData: any[],
  leadershipData: any[]
) => {
  // This is a placeholder implementation - you should replace it with the actual implementation
  // Since this function is used in useEmployeeFilter.ts but wasn't defined in employeeUtils.ts
  return employees.map(employee => ({
    ...employee,
    // Add any additional properties that might be needed
    standardSalary: customStandardSalaries.get(employee.name) || employee.salary
  }));
};
