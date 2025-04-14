
import { useState, useEffect, useMemo, useCallback } from "react";
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
  // Мемоизируем обработку сотрудников с ролями для избежания лишних вычислений
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

  // Мемоизированная функция поиска для повышения производительности
  const filterEmployees = useCallback((searchTerm: string, employees: any[]) => {
    if (!searchTerm) return employees;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(lowerSearchTerm) ||
      (employee.position && employee.position.toLowerCase().includes(lowerSearchTerm)) ||
      (employee.roles && employee.roles.some((role: string) => 
        role.toLowerCase().includes(lowerSearchTerm)
      ))
    );
  }, []);

  // Применяем поиск к обработанным сотрудникам с мемоизацией результата
  const filteredEmployees = useMemo(() => 
    filterEmployees(searchTerm, processedEmployees),
  [searchTerm, processedEmployees, filterEmployees]);

  return { filteredEmployees };
};
