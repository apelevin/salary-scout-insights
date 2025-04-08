
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { EmployeeWithRoles } from "@/types";
import { formatName, formatSalary, getSalaryDifference } from "@/utils/employeeUtils";

interface EmployeeTableRowProps {
  employee: EmployeeWithRoles;
  onClick: (employee: EmployeeWithRoles) => void;
}

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({ employee, onClick }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <button 
          className="text-blue-600 hover:text-blue-800 hover:underline text-left"
          onClick={() => onClick(employee)}
        >
          {formatName(employee.name)}
        </button>
      </TableCell>
      <TableCell>{formatSalary(employee.salary)}</TableCell>
      <TableCell>
        {employee.standardSalary && employee.standardSalary > 0 ? (
          formatSalary(employee.standardSalary)
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      <TableCell>
        {employee.standardSalary && employee.standardSalary > 0 ? (
          <span className={getSalaryDifference(employee.standardSalary, employee.salary).className}>
            {getSalaryDifference(employee.standardSalary, employee.salary).text}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
