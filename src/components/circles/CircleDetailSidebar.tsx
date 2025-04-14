
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
import { Users, PieChart, Award, TrendingDown, TrendingUp } from "lucide-react";

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

  // Get all roles within this circle
  const circleRoles = rolesData.filter(role => 
    role.circleName?.replace(/["']/g, '').trim() === circleName
  );

  // Find circle leader
  const circleLeader = circleRoles.find(role => 
    role.roleName.toLowerCase().includes('лидер')
  )?.participantName.replace(/["']/g, '').trim();

  // Get employees in this circle
  const circleEmployeeNames = new Set<string>();
  circleRoles.forEach(role => {
    circleEmployeeNames.add(role.participantName.replace(/["']/g, '').trim());
  });

  // Map employees with their roles and FTE
  const circleEmployeesData: {
    name: string;
    roles: { roleName: string; fte: number }[];
    currentSalary: number;
    standardSalary: number | undefined;
    isLeader: boolean;
  }[] = [];

  // Process employees in this circle
  circleEmployeeNames.forEach(name => {
    const employeeWithRoles = employeesWithRoles.find(
      e => e.name.replace(/["']/g, '').trim() === name
    );
    
    if (employeeWithRoles) {
      const employeeRoles: { roleName: string; fte: number }[] = [];
      let isLeader = false;
      
      // Get roles for this employee in this circle
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

  // Calculate total budget
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

  // Calculate budget difference
  const budgetDifference = totalStandardBudget - totalCurrentBudget;
  const isPositiveDifference = budgetDifference > 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[450px] sm:w-[550px] overflow-y-auto">
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
          {circleLeader && (
            <div className="flex items-center mb-4 p-3 bg-muted rounded-md">
              <Award className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <span className="text-sm text-muted-foreground">Лидер круга:</span>
                <h4 className="font-medium">{circleLeader}</h4>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Стандартный бюджет:</h3>
            <span className="font-medium">{formatSalary(totalStandardBudget)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Текущий бюджет:</h3>
            <span className="font-medium">{formatSalary(totalCurrentBudget)}</span>
          </div>
          
          {/* Budget difference */}
          <div className="flex justify-between mb-4 py-2 px-3 bg-muted rounded-md">
            <div className="flex items-center">
              <h3 className="text-sm font-medium">Разница:</h3>
              {isPositiveDifference ? 
                <TrendingUp className="h-4 w-4 ml-2 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 ml-2 text-red-500" />
              }
            </div>
            <span className={`font-medium ${isPositiveDifference ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveDifference ? '+' : ''}{formatSalary(budgetDifference)}
            </span>
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
