
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CircleData, RoleData, Employee, EmployeeWithRoles } from "@/types";
import { Users, DollarSign } from "lucide-react";
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

  // Process employees with roles if we have employees data
  const employeesWithRoles: EmployeeWithRoles[] = employees.length > 0 
    ? processEmployeesWithRoles(employees, rolesData, new Map())
    : [];

  // Count employees per circle and clean circle names
  const employeesPerCircle = new Map<string, Set<string>>();
  const circleBudgets = new Map<string, number>();

  // Clean circle data first
  const cleanCirclesData = circlesData.map(circle => ({
    ...circle,
    name: circle.name.replace(/["']/g, '').trim(),
    functionalType: circle.functionalType?.replace(/["']/g, '').trim() || ''
  }));

  // First pass: Collect all employees per circle
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

  // Calculate budget for each circle
  if (employees.length > 0) {
    // Create a map of employee name to their data for quick lookup
    const employeeMap = new Map<string, EmployeeWithRoles>();
    employeesWithRoles.forEach(emp => {
      const fullName = emp.name.replace(/["']/g, '').trim();
      employeeMap.set(fullName, emp);
    });

    // For each circle, calculate the budget
    employeesPerCircle.forEach((employeeSet, circleName) => {
      let totalBudget = 0;

      employeeSet.forEach(employeeName => {
        const employee = employeeMap.get(employeeName);
        if (employee?.standardSalary) {
          // Check if this employee is a leader for this circle
          const isLeader = rolesData.some(role => {
            const roleCircleName = role.circleName?.replace(/["']/g, '').trim() || '';
            return roleCircleName === circleName && 
                   role.participantName.replace(/["']/g, '').trim() === employeeName && 
                   role.roleName.toLowerCase().includes('лидер');
          });

          // Calculate FTE for this employee in this specific circle
          let employeeCircleFTE = 0;
          rolesData.forEach(role => {
            if (role.circleName?.replace(/["']/g, '').trim() === circleName && 
                role.participantName.replace(/["']/g, '').trim() === employeeName && 
                role.fte) {
              employeeCircleFTE += role.fte;
            }
          });

          // Include in budget if not a leader, or if no specific FTE, use a portion based on number of circles
          if (!isLeader && employeeCircleFTE > 0) {
            totalBudget += employee.standardSalary * employeeCircleFTE;
          }
        }
      });

      circleBudgets.set(circleName, totalBudget);
    });
  }

  // Remove duplicate circles
  const uniqueCircles = Array.from(new Set(cleanCirclesData.map(circle => circle.name)))
    .map(name => cleanCirclesData.find(circle => circle.name === name)!)
    .filter(Boolean);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Название круга</TableHead>
            <TableHead>Функциональный тип</TableHead>
            <TableHead className="text-right">Количество сотрудников</TableHead>
            <TableHead className="text-right">Бюджет</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueCircles.map((circle, index) => {
            // Get the count of unique employees in this circle
            const employees = employeesPerCircle.get(circle.name) || new Set();
            const employeeCount = employees.size;
            
            // Get budget for this circle
            const budget = circleBudgets.get(circle.name) || 0;
            
            return (
              <TableRow key={`${circle.name}-${index}`}>
                <TableCell className="font-medium">{circle.name}</TableCell>
                <TableCell>{circle.functionalType || "—"}</TableCell>
                <TableCell className="text-right">{employeeCount}</TableCell>
                <TableCell className="text-right">
                  {budget > 0 ? (
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>{formatSalary(budget)}</span>
                    </div>
                  ) : "—"}
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
