
import React, { memo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Employee, EmployeeWithRoles } from "@/types";
import { formatName, formatSalary } from "@/utils/formatUtils";

interface EmployeeTableRowProps {
  employee: Employee | EmployeeWithRoles;
  onClick: (employee: Employee | EmployeeWithRoles) => void;
  incognitoMode?: boolean;
}

// Используем React.memo для предотвращения лишних перерендеров
const EmployeeTableRow: React.FC<EmployeeTableRowProps> = memo(({ 
  employee, 
  onClick,
  incognitoMode = false
}) => {
  // Проверка типа сотрудника
  const hasStandardSalary = 'standardSalary' in employee && employee.standardSalary && employee.standardSalary > 0;
  
  // Рассчитываем разницу между стандартной и текущей зарплатой
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
});

// Задаем displayName для улучшения отладки
EmployeeTableRow.displayName = 'EmployeeTableRow';

export default EmployeeTableRow;
