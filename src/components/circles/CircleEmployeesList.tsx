
import React from "react";
import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatSalary } from "@/utils/formatUtils";

interface EmployeeRole {
  roleName: string;
  fte: number;
}

interface CircleEmployeeData {
  name: string;
  roles: EmployeeRole[];
  currentSalary: number;
  standardSalary: number | undefined;
  isLeader: boolean;
}

interface CircleEmployeesListProps {
  employees: CircleEmployeeData[];
}

const CircleEmployeesList: React.FC<CircleEmployeesListProps> = ({ employees }) => {
  return (
    <>
      <div className="flex items-center my-4">
        <Users className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-base font-medium">Сотрудники круга ({employees.length})</h3>
      </div>
      
      {/* Employees list */}
      <div className="space-y-3">
        {employees.map((employee, index) => {
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
            <div 
              key={`${employee.name}-${index}`}
              className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">
                  {employee.name}
                  {employee.isLeader && (
                    <span className="ml-1 text-xs text-blue-600">(Лидер)</span>
                  )}
                </div>
                {!employee.isLeader && (
                  <div className="text-sm text-right">
                    <div className="font-medium">{formatSalary(currentBudget)}</div>
                    {difference !== 0 && (
                      <div className={`text-xs ${differenceClass}`}>
                        {difference > 0 ? "+" : ""}{formatSalary(difference)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <ScrollArea className="h-auto max-h-24">
                <div className="space-y-1">
                  {employee.roles.map((role, idx) => (
                    <div key={idx} className="text-sm flex justify-between items-center">
                      <span className="text-muted-foreground">{role.roleName}</span>
                      <span className="text-xs bg-secondary/20 px-2 py-0.5 rounded-full">
                        FTE: {role.fte}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CircleEmployeesList;
