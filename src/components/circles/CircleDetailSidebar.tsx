
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Employee, EmployeeWithRoles, RoleData } from "@/types";
import { formatSalary } from "@/utils/formatUtils";
import { Separator } from "@/components/ui/separator";
import { Users, PieChart } from "lucide-react";

interface CircleDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  circleName: string | null;
  employees: Employee[];
  employeesWithRoles: EmployeeWithRoles[];
  rolesData: RoleData[];
}

const CircleDetailSidebar: React.FC<CircleDetailSidebarProps> = ({
  isOpen,
  onClose,
  circleName,
  employees,
  employeesWithRoles,
  rolesData
}) => {
  if (!circleName) return null;

  const circleRoles = rolesData.filter(role => 
    role.circleName?.replace(/["']/g, '').trim() === circleName
  );

  const circleEmployeeNames = new Set<string>();
  circleRoles.forEach(role => {
    circleEmployeeNames.add(role.participantName.replace(/["']/g, '').trim());
  });

  const circleEmployeesData: {
    name: string;
    roles: { roleName: string; fte: number }[];
    currentSalary: number;
    standardSalary: number | undefined;
    isLeader: boolean;
  }[] = [];

  circleEmployeeNames.forEach(name => {
    const employeeWithRoles = employeesWithRoles.find(
      e => e.name.replace(/["']/g, '').trim() === name
    );
    
    if (employeeWithRoles) {
      const employeeRoles: { roleName: string; fte: number }[] = [];
      let isLeader = false;
      
      circleRoles.forEach(role => {
        if (role.participantName.replace(/["']/g, '').trim() === name) {
          employeeRoles.push({
            roleName: role.roleName,
            fte: role.fte || 0
          });
          
          if (role.roleName.toLowerCase().includes('лидер')) {
            isLeader = true;
          }
        }
      });
      
      circleEmployeesData.push({
        name,
        roles: employeeRoles,
        currentSalary: employeeWithRoles.salary,
        standardSalary: employeeWithRoles.standardSalary,
        isLeader
      });
    }
  });

  const totalCurrentBudget = circleEmployeesData
    .filter(employee => !employee.isLeader)
    .reduce((sum, employee) => {
      const totalFTE = employee.roles.reduce((sum, role) => sum + role.fte, 0);
      return sum + (employee.currentSalary * totalFTE);
    }, 0);

  const totalStandardBudget = circleEmployeesData
    .filter(employee => !employee.isLeader && employee.standardSalary !== undefined)
    .reduce((sum, employee) => {
      const totalFTE = employee.roles.reduce((sum, role) => sum + role.fte, 0);
      return sum + ((employee.standardSalary || 0) * totalFTE);
    }, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[900px] sm:w-[900px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            {circleName}
          </SheetTitle>
          <SheetDescription>
            Расшифровка бюджета круга
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Стандартный бюджет:</h3>
            <span className="font-medium">{formatSalary(totalStandardBudget)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <h3 className="text-sm font-medium">Текущий бюджет:</h3>
            <span className="font-medium">{formatSalary(totalCurrentBudget)}</span>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center my-4">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-base font-medium">Сотрудники круга ({circleEmployeesData.length})</h3>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Сотрудник</TableHead>
                <TableHead>Роли (FTE)</TableHead>
                <TableHead className="text-right">Текущий</TableHead>
                <TableHead className="text-right">Стандартный</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {circleEmployeesData.map((employee, index) => {
                const totalFTE = employee.roles.reduce((sum, role) => sum + role.fte, 0);
                const currentBudget = employee.currentSalary * totalFTE;
                const standardBudget = (employee.standardSalary || 0) * totalFTE;
                const difference = standardBudget - currentBudget;
                const differenceClass = difference > 0 
                  ? 'text-green-600' 
                  : difference < 0 
                    ? 'text-red-600' 
                    : 'text-gray-500';
                
                return (
                  <TableRow key={`${employee.name}-${index}`}>
                    <TableCell className="font-medium">
                      {employee.name}
                      {employee.isLeader && (
                        <span className="ml-1 text-xs text-blue-600">(Лидер)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.roles.map((role, idx) => (
                        <div key={idx} className="text-sm">
                          {role.roleName} ({role.fte})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatSalary(currentBudget)}
                    </TableCell>
                    <TableCell className="text-right">
                      {!employee.isLeader ? (
                        <div>
                          {formatSalary(standardBudget)}
                          {difference !== 0 && (
                            <div className={`text-xs ${differenceClass}`}>
                              {difference > 0 ? "+" : ""}{formatSalary(difference)}
                            </div>
                          )}
                        </div>
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleDetailSidebar;
