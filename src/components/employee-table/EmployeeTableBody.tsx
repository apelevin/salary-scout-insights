
import React, { memo } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Employee, EmployeeWithRoles } from "@/types";
import EmployeeTableRow from "../EmployeeTableRow";

interface EmployeeTableBodyProps {
  employees: (Employee | EmployeeWithRoles)[];
  onEmployeeClick: (employee: Employee | EmployeeWithRoles) => void;
  incognitoMode?: boolean;
}

// Использование memo для предотвращения лишних перерендеров
const EmployeeTableBody: React.FC<EmployeeTableBodyProps> = memo(({ 
  employees, 
  onEmployeeClick,
  incognitoMode = false 
}) => {
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
          key={employee.id || `employee-${index}`} 
          employee={employee} 
          onClick={onEmployeeClick} 
          incognitoMode={incognitoMode}
        />
      ))}
    </TableBody>
  );
});

// Задаем displayName для улучшения отладки
EmployeeTableBody.displayName = 'EmployeeTableBody';

export default EmployeeTableBody;
