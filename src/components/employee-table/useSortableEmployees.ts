
import { useState, useEffect } from "react";
import { Employee, EmployeeWithRoles } from "@/types";
import { formatName } from "@/utils/employeeUtils";
import { calculateSalaryDifference } from "@/utils/salaryDifferenceUtils";

export type SortDirection = "none" | "asc" | "desc";
export type SortField = "name" | "difference";

export const useSortableEmployees = (employees: (Employee | EmployeeWithRoles)[]) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [sortField, setSortField] = useState<SortField>("difference");
  const [sortedEmployees, setSortedEmployees] = useState<(Employee | EmployeeWithRoles)[]>(employees);

  useEffect(() => {
    if (sortDirection === "none") {
      setSortedEmployees(employees);
      return;
    }
    
    const sorted = [...employees].sort((a, b) => {
      if (sortField === "difference") {
        return compareSalaryDifference(a, b, sortDirection);
      } else if (sortField === "name") {
        return compareNames(a, b, sortDirection);
      }
      return 0;
    });
    
    setSortedEmployees(sorted);
  }, [sortDirection, sortField, employees]);

  const toggleSort = (field: SortField) => {
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
  };
  
  return {
    sortedEmployees,
    sortDirection,
    sortField,
    toggleSort
  };
};

// Helper function to compare salary differences
const compareSalaryDifference = (
  a: Employee | EmployeeWithRoles, 
  b: Employee | EmployeeWithRoles, 
  direction: SortDirection
) => {
  const diffA = ('standardSalary' in a && a.standardSalary) 
    ? calculateSalaryDifference(a.salary, a.standardSalary) 
    : 0;
  
  const diffB = ('standardSalary' in b && b.standardSalary) 
    ? calculateSalaryDifference(b.salary, b.standardSalary) 
    : 0;
  
  return direction === "asc" ? diffA - diffB : diffB - diffA;
};

// Helper function to compare employee names
const compareNames = (
  a: Employee | EmployeeWithRoles, 
  b: Employee | EmployeeWithRoles, 
  direction: SortDirection
) => {
  const nameA = formatName(a.name).toLowerCase();
  const nameB = formatName(b.name).toLowerCase();
  
  return direction === "asc" 
    ? nameA.localeCompare(nameB) 
    : nameB.localeCompare(nameA);
};
