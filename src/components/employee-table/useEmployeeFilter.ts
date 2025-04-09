
import { useState, useEffect } from "react";
import { Employee, EmployeeWithRoles, RoleData, CircleData } from "@/types";
import { formatName, processEmployeesWithRoles } from "@/utils/employeeUtils";

// List of employees to exclude from the display
const EXCLUDED_EMPLOYEES = ["Пелевин Алексей", "Чиракадзе Дмитрий"];

export const useEmployeeFilter = (
  employees: Employee[],
  rolesData: RoleData[],
  circlesData: CircleData[],
  customStandardSalaries: Map<string, number>,
  searchTerm: string
) => {
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithRoles[]>([]);
  const [employeesWithRoles, setEmployeesWithRoles] = useState<EmployeeWithRoles[]>([]);

  useEffect(() => {
    // Filter out excluded employees
    const filteredEmployeesList = employees.filter(emp => 
      !EXCLUDED_EMPLOYEES.some(excluded => 
        formatName(emp.name).toLowerCase().includes(excluded.toLowerCase())
      )
    );
    
    const withRoles = processEmployeesWithRoles(filteredEmployeesList, rolesData, customStandardSalaries, circlesData);
    
    setEmployeesWithRoles(withRoles);
    
    if (searchTerm.trim() === "") {
      setFilteredEmployees(withRoles);
    } else {
      const term = searchTerm.toLowerCase().trim();
      setFilteredEmployees(
        withRoles.filter((employee) =>
          formatName(employee.name).toLowerCase().includes(term)
        )
      );
    }
  }, [employees, searchTerm, rolesData, customStandardSalaries, circlesData]);

  return { filteredEmployees, employeesWithRoles };
};
