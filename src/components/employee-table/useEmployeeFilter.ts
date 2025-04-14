
import { useState, useEffect, useMemo } from "react";
import { Employee, RoleData, CircleData, LeadershipData } from "@/types";
import { processEmployeesWithRoles } from "@/utils/employeeUtils";

export interface UseEmployeeFilterParams {
  employees: Employee[];
  rolesData: RoleData[];
  circlesData: CircleData[];
  leadershipData: LeadershipData[];
  customStandardSalaries: Map<string, number>;
  searchTerm: string;
}

export const useEmployeeFilter = (
  employees: Employee[],
  rolesData: RoleData[] = [],
  circlesData: CircleData[] = [],
  customStandardSalaries: Map<string, number> = new Map(),
  searchTerm: string = "",
  leadershipData: LeadershipData[] = []
) => {
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  // Process employees with roles and calculate derived data
  const processedEmployees = useMemo(() => {
    if (!employees.length) return [];
    
    return processEmployeesWithRoles(
      employees, 
      rolesData, 
      customStandardSalaries, 
      circlesData,
      leadershipData
    );
  }, [employees, rolesData, customStandardSalaries, circlesData, leadershipData]);

  // Apply search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmployees(processedEmployees);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = processedEmployees.filter(employee =>
      employee.name.toLowerCase().includes(lowerSearchTerm) ||
      (employee.position && employee.position.toLowerCase().includes(lowerSearchTerm)) ||
      (employee.roles && employee.roles.some(role => 
        role.toLowerCase().includes(lowerSearchTerm)
      ))
    );
    
    setFilteredEmployees(filtered);
  }, [processedEmployees, searchTerm]);

  return { filteredEmployees };
};
