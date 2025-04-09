
import { useState } from "react";
import { RoleData, CircleData, Employee } from "@/types";
import { processEmployeesWithRoles } from "@/utils/employeeUtils";

interface UseRoleManagementProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

export const useRoleManagement = ({ employees, setEmployees }: UseRoleManagementProps) => {
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [circlesData, setCirclesData] = useState<CircleData[]>([]);
  const [customStandardSalaries, setCustomStandardSalaries] = useState<Map<string, number>>(new Map());

  const handleStandardSalaryChange = (roleName: string, newStandardSalary: number) => {
    setCustomStandardSalaries(prev => {
      const updated = new Map(prev);
      updated.set(roleName, newStandardSalary);
      return updated;
    });
    
    // Recalculate employee standard salaries when role standard salary changes
    if (employees.length > 0 && rolesData.length > 0) {
      const updatedEmployees = processEmployeesWithRoles(
        employees, 
        rolesData, 
        new Map(customStandardSalaries).set(roleName, newStandardSalary),
        circlesData,
        [] // We'll handle this in the leadership hook
      );
      setEmployees(updatedEmployees);
    }
  };

  return {
    rolesData,
    setRolesData,
    circlesData,
    setCirclesData,
    customStandardSalaries,
    handleStandardSalaryChange
  };
};
