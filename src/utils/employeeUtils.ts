
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
