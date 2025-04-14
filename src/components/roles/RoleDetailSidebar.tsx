
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Employee } from "@/types";
import { Users, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatSalary, formatFTE } from "@/utils/formatUtils";

interface RoleEmployeeData {
  name: string;
  salary: number;
  fte: number;
  contribution: number;
}

interface RoleDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string | null;
  employees: Employee[];
  rolesData: any[];
  standardSalary: number;
  incognitoMode?: boolean;
}

const RoleDetailSidebar: React.FC<RoleDetailSidebarProps> = ({
  isOpen,
  onClose,
  roleName,
  employees,
  rolesData,
  standardSalary,
  incognitoMode = false
}) => {
  if (!roleName) return null;

  // Find all employees with this role
  const employeesWithRole: RoleEmployeeData[] = [];
  
  // Constants for the circle leader role names
  const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
  const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
  const GENERIC_LEADER_ROLE = "лидер";
  const NORMALIZED_LEADER_ROLE = "Лидер";
  
  const isLeaderRole = roleName.toLowerCase() === NORMALIZED_LEADER_ROLE.toLowerCase();
  
  employees.forEach(employee => {
    // Extract employee name parts
    const empNameParts = employee.name
      .replace(/["']/g, '')
      .trim()
      .split(/\s+/)
      .map(part => part.toLowerCase());
      
    if (empNameParts.length < 2) return;
    
    const empLastName = empNameParts[0];
    const empFirstName = empNameParts[1];
    
    // Find all roles for this employee
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      const participantNameParts = entry.participantName
        .replace(/["']/g, '')
        .trim()
        .split(/\s+/)
        .map(part => part.toLowerCase());
      
      if (participantNameParts.length < 2) return;
      
      const lastName = participantNameParts[0];
      const firstName = participantNameParts[1];
      
      // Check if this is the same employee
      if (lastName === empLastName && firstName === empFirstName) {
        let entryRoleName = entry.roleName;
        let matchesRole = false;
        
        if (isLeaderRole) {
          // For leader roles, check if it's any type of leader
          const roleLower = entryRoleName.toLowerCase();
          matchesRole = roleLower === GENERIC_LEADER_ROLE.toLowerCase() || 
                        roleLower.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
                        roleLower.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase());
        } else {
          // For normal roles, direct comparison
          matchesRole = entryRoleName.toLowerCase() === roleName.toLowerCase();
        }
        
        if (matchesRole && entry.fte) {
          // Calculate contribution to role cost
          const contribution = employee.salary * entry.fte;
          
          // Check if employee already exists in the list (might have multiple entries for same role)
          const existingEmployee = employeesWithRole.find(e => e.name === employee.name);
          
          if (existingEmployee) {
            existingEmployee.fte += entry.fte;
            existingEmployee.contribution += contribution;
          } else {
            employeesWithRole.push({
              name: employee.name,
              salary: employee.salary,
              fte: entry.fte,
              contribution: contribution
            });
          }
        }
      }
    });
  });
  
  // Sort employees by contribution (highest first)
  employeesWithRole.sort((a, b) => b.contribution - a.contribution);
  
  // Calculate total cost of the role
  const totalRoleCost = employeesWithRole.reduce((sum, emp) => sum + emp.contribution, 0);
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[450px] sm:w-[550px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
            {roleName}
          </SheetTitle>
          <SheetDescription>
            Детализация стоимости роли
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {/* Role budget summary */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Стандартный оклад:</h3>
              <span className="font-medium">{formatSalary(standardSalary)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Текущая стоимость роли:</h3>
              <span className="font-medium">{formatSalary(totalRoleCost)}</span>
            </div>
            
            {/* Budget difference */}
            {standardSalary > 0 && (
              <div className="flex justify-between mb-4 py-2 px-3 bg-muted rounded-md">
                <h3 className="text-sm font-medium">Среднее по сотрудникам:</h3>
                <span className="font-medium">
                  {formatSalary(employeesWithRole.length > 0 ? totalRoleCost / employeesWithRole.length : 0)}
                </span>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          {/* Employees list */}
          <div className="flex items-center my-4">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-base font-medium">Сотрудники с ролью ({employeesWithRole.length})</h3>
          </div>
          
          <div className="space-y-3">
            {employeesWithRole.length > 0 ? (
              employeesWithRole.map((employee, index) => {
                // Calculate percentage of total role cost
                const percentage = totalRoleCost > 0 ? (employee.contribution / totalRoleCost) * 100 : 0;
                
                return (
                  <div 
                    key={`${employee.name}-${index}`}
                    className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm font-medium">
                        {!incognitoMode ? formatSalary(employee.contribution) : '***'}
                      </div>
                    </div>
                    
                    <ScrollArea className="h-auto">
                      <div className="space-y-2">
                        <div className="text-sm flex justify-between items-center">
                          <span className="text-muted-foreground">FTE:</span>
                          <span className="text-xs bg-secondary/20 px-2 py-0.5 rounded-full">
                            {formatFTE(employee.fte)}
                          </span>
                        </div>
                        
                        {!incognitoMode && (
                          <div className="text-sm flex justify-between items-center">
                            <span className="text-muted-foreground">Оклад:</span>
                            <span>{formatSalary(employee.salary)}</span>
                          </div>
                        )}
                        
                        <div className="text-sm flex justify-between items-center">
                          <span className="text-muted-foreground">Доля в стоимости роли:</span>
                          <span className="font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </ScrollArea>
                    
                    {/* Progress bar showing percentage of total cost */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">
                Нет сотрудников с данной ролью
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RoleDetailSidebar;
