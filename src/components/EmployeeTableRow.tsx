
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Employee, EmployeeWithRoles } from "@/types";
import { formatName, formatSalary } from "@/utils/formatUtils";

interface EmployeeTableRowProps {
  employee: Employee | EmployeeWithRoles;
  onClick: (employee: Employee | EmployeeWithRoles) => void;
  incognitoMode?: boolean;
}

const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({ 
  employee, 
  onClick,
  incognitoMode = false
}) => {
  // Check if it's an EmployeeWithRoles that has standardSalary
  const hasStandardSalary = 'standardSalary' in employee && employee.standardSalary && employee.standardSalary > 0;
  
  // Calculate the difference as standardSalary - salary
  const getDifference = () => {
    if (!hasStandardSalary) return { text: '—', className: 'text-gray-400' };
    
    const difference = (employee as EmployeeWithRoles).standardSalary! - employee.salary;
    
    if (difference > 0) {
      return { 
        text: `+${formatSalary(difference)}`, 
        className: 'text-green-600 font-medium' 
      };
    } else if (difference < 0) {
      return { 
        text: formatSalary(difference), 
        className: 'text-red-600 font-medium' 
      };
    } else {
      return { 
        text: `0 ₽`, 
        className: 'text-gray-500' 
      };
    }
  };
  
  const { text, className } = getDifference();
  
  const displayName = incognitoMode ? '░░░░░ ░░░░░' : formatName(employee.name);

  return (
    <TableRow>
      <TableCell className="font-medium">
        <button 
          className="text-blue-600 hover:text-blue-800 hover:underline text-left"
          onClick={() => onClick(employee)}
        >
          {displayName}
        </button>
      </TableCell>
      <TableCell>{formatSalary(employee.salary)}</TableCell>
      <TableCell>
        {hasStandardSalary ? (
          formatSalary((employee as EmployeeWithRoles).standardSalary!)
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      <TableCell>
        <span className={className}>{text}</span>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;
