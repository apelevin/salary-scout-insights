
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CircleData, RoleData, Employee, EmployeeWithRoles } from "@/types";
import { Users } from "lucide-react";
import { processEmployeesWithRoles } from "@/utils/employeeUtils";
import { formatSalary } from "@/utils/formatUtils";

interface CirclesTableProps {
  circlesData: CircleData[];
  rolesData: RoleData[];
  isLoading: boolean;
  employees?: Employee[];
}

const CirclesTable: React.FC<CirclesTableProps> = ({ 
  circlesData, 
  rolesData, 
  isLoading,
  employees = [] 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-sm text-muted-foreground">Загрузка данных...</p>
      </div>
    );
  }

  if (!circlesData || circlesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">Нет данных о кругах</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Загрузите файл с информацией о кругах, чтобы увидеть данные.
        </p>
      </div>
    );
  }

  const employeesWithRoles: EmployeeWithRoles[] = employees.length > 0 
    ? processEmployeesWithRoles(employees, rolesData, new Map())
    : [];

  const employeesPerCircle = new Map<string, Set<string>>();
  const circleBudgets = new Map<string, number>();
  const currentSalaryBudgets = new Map<string, number>();

  const cleanCirclesData = circlesData.map(circle => ({
    ...circle,
    name: circle.name.replace(/["']/g, '').trim(),
    functionalType: circle.functionalType?.replace(/["']/g, '').trim() || ''
  }));

  rolesData.forEach(role => {
    const cleanCircleName = role.circleName?.replace(/["']/g, '').trim() || '';
    const cleanParticipantName = role.participantName.replace(/["']/g, '').trim();
    
    if (cleanCircleName) {
      if (!employeesPerCircle.has(cleanCircleName)) {
        employeesPerCircle.set(cleanCircleName, new Set());
      }
      
      employeesPerCircle.get(cleanCircleName)?.add(cleanParticipantName);
    }
  });

  if (employees.length > 0) {
    const employeeMap = new Map<string, EmployeeWithRoles>();
    employeesWithRoles.forEach(emp => {
      const fullName = emp.name.replace(/["']/g, '').trim();
      employeeMap.set(fullName, emp);
    });

    employeesPerCircle.forEach((employeeSet, circleName) => {
      let totalStandardBudget = 0;
      let totalCurrentBudget = 0;

      employeeSet.forEach(employeeName => {
        const employee = employeeMap.get(employeeName);
        if (employee) {
          const isLeader = rolesData.some(role => {
            const roleCircleName = role.circleName?.replace(/["']/g, '').trim() || '';
            return roleCircleName === circleName && 
                   role.participantName.replace(/["']/g, '').trim() === employeeName && 
                   role.roleName.toLowerCase().includes('лидер');
          });

          let employeeCircleFTE = 0;
          rolesData.forEach(role => {
            if (role.circleName?.replace(/["']/g, '').trim() === circleName && 
                role.participantName.replace(/["']/g, '').trim() === employeeName && 
                role.fte) {
              employeeCircleFTE += role.fte;
            }
          });

          if (!isLeader && employeeCircleFTE > 0) {
            if (employee.standardSalary) {
              totalStandardBudget += employee.standardSalary * employeeCircleFTE;
            }
            
            totalCurrentBudget += employee.salary * employeeCircleFTE;
          }
        }
      });

      circleBudgets.set(circleName, totalStandardBudget);
      currentSalaryBudgets.set(circleName, totalCurrentBudget);
    });
  }

  const uniqueCircles = Array.from(new Set(cleanCirclesData.map(circle => circle.name)))
    .map(name => cleanCirclesData.find(circle => circle.name === name)!)
    .filter(Boolean)
    .filter(circle => 
      circle.name !== "Офис СЕО" && 
      circle.name !== "Otherside"
    );
    
  // Helper function to get budget difference with color styling
  const getBudgetDifference = (standard: number, current: number) => {
    const difference = standard - current;
    
    if (difference > 0) {
      return { 
        value: difference, 
        className: 'text-green-600 font-medium' 
      };
    } else if (difference < 0) {
      return { 
        value: difference, 
        className: 'text-red-600 font-medium' 
      };
    } else {
      return { 
        value: 0, 
        className: 'text-gray-500' 
      };
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Название круга</TableHead>
            <TableHead className="text-right">Стандартный бюджет</TableHead>
            <TableHead className="text-right">Текущий бюджет</TableHead>
            <TableHead className="text-right">Разница</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueCircles.map((circle, index) => {
            const standardBudget = circleBudgets.get(circle.name) || 0;
            const currentBudget = currentSalaryBudgets.get(circle.name) || 0;
            const budgetDifference = getBudgetDifference(standardBudget, currentBudget);
            
            return (
              <TableRow key={`${circle.name}-${index}`}>
                <TableCell className="font-medium">{circle.name}</TableCell>
                <TableCell className="text-right">
                  {standardBudget > 0 ? formatSalary(standardBudget) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {currentBudget > 0 ? formatSalary(currentBudget) : "—"}
                </TableCell>
                <TableCell className={`text-right ${budgetDifference.className}`}>
                  {budgetDifference.value !== 0 
                    ? formatSalary(budgetDifference.value) 
                    : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CirclesTable;
