
import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Employee, EmployeeWithRoles } from "@/types";
import EmployeeTableRow from "../EmployeeTableRow";

interface EmployeeTableBodyProps {
  employees: (Employee | EmployeeWithRoles)[];
  onEmployeeClick: (employee: Employee | EmployeeWithRoles) => void;
}

const EmployeeTableBody: React.FC<EmployeeTableBodyProps> = ({ employees, onEmployeeClick }) => {
  if (employees.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="text-center h-32">
            Сотрудники не найдены
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {employees.map((employee, index) => (
        <EmployeeTableRow 
          key={employee.id || index} 
          employee={employee} 
          onClick={onEmployeeClick} 
        />
      ))}
    </TableBody>
  );
};

export default EmployeeTableBody;
