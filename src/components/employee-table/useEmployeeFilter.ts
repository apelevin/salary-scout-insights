import { Employee, EmployeeWithRoles } from "@/types";
import { useMemo, useState } from "react";

export function useEmployeeFilter(employees: Employee[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    employees.forEach((employee) => {
      if (employee.department) {
        deptSet.add(employee.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [employees]);

  // Extract unique roles for filter dropdown
  const roles = useMemo(() => {
    const roleSet = new Set<string>();
    employees.forEach((employee) => {
      if ('roles' in employee && Array.isArray(employee.roles)) {
        (employee as EmployeeWithRoles).roles.forEach((role) => {
          roleSet.add(role);
        });
      }
    });
    return Array.from(roleSet).sort();
  }, [employees]);

  // Filter employees based on search term and department
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = !searchTerm || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDepartment = !departmentFilter || 
        employee.department === departmentFilter;
      
      const matchesRole = !roleFilter || 
        ('roles' in employee && Array.isArray((employee as EmployeeWithRoles).roles) && 
          (employee as EmployeeWithRoles).roles.includes(roleFilter));
      
      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [employees, searchTerm, departmentFilter, roleFilter]);

  return {
    searchTerm,
    setSearchTerm,
    departments,
    departmentFilter,
    setDepartmentFilter,
    roles,
    roleFilter,
    setRoleFilter,
    filteredEmployees,
  };
}
