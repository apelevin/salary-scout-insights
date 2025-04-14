
import { useState, useMemo, useCallback } from "react";
import { Employee, EmployeeWithRoles } from "@/types";
import { formatName } from "@/utils/formatUtils";

export type SortDirection = "none" | "asc" | "desc";
export type SortField = "name" | "difference";

export const useSortableEmployees = (employees: (Employee | EmployeeWithRoles)[]) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [sortField, setSortField] = useState<SortField>("difference");

  // Функция сортировки с кэшированием результатов
  const sortedEmployees = useMemo(() => {
    if (sortDirection === "none") return employees;

    return [...employees].sort((a, b) => {
      if (sortField === "difference") {
        const diffA = ('standardSalary' in a && a.standardSalary) ? a.salary - a.standardSalary : 0;
        const diffB = ('standardSalary' in b && b.standardSalary) ? b.salary - b.standardSalary : 0;
        
        return sortDirection === "asc" ? diffA - diffB : diffB - diffA;
      } else if (sortField === "name") {
        const nameA = formatName(a.name).toLowerCase();
        const nameB = formatName(b.name).toLowerCase();
        
        return sortDirection === "asc" 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      }
      
      return 0;
    });
  }, [sortDirection, sortField, employees]);

  // Оптимизированная функция переключения сортировки
  const toggleSort = useCallback((field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("asc");
    } else {
      setSortDirection(prev => {
        if (prev === "none") return "asc";
        if (prev === "asc") return "desc";
        return "none";
      });
    }
  }, [sortField]);

  return {
    sortedEmployees,
    sortDirection,
    sortField,
    toggleSort
  };
};
