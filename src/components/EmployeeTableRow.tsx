
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Employee, EmployeeWithRoles } from "@/types";
import { formatName, formatSalary, getSalaryDifference } from "@/utils/employeeUtils";

interface EmployeeTableRowProps {
  employee: Employee | EmployeeWithRoles;
  onClick: (employee: Employee | EmployeeWithRoles) => void;
}

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({ employee, onClick }) => {
  // Check if it's an EmployeeWithRoles that has standardSalary
  const hasStandardSalary = 'standardSalary' in employee && employee.standardSalary && employee.standardSalary > 0;

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
        {hasStandardSalary ? (
          formatSalary(employee.standardSalary)
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      <TableCell>
        {hasStandardSalary ? (
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
