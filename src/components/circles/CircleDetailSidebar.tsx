
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Employee, EmployeeWithRoles, RoleData } from "@/types";
import { PieChart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CircleLeaderInfo from "./CircleLeaderInfo";
import CircleBudgetSummary from "./CircleBudgetSummary";
import CircleEmployeesList from "./CircleEmployeesList";

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
  const circleEmployeesData = [];

  // Process employees in this circle
  circleEmployeeNames.forEach(name => {
    const employeeWithRoles = employeesWithRoles.find(
      e => e.name.replace(/["']/g, '').trim() === name
    );
    
    if (employeeWithRoles) {
      const employeeRoles = [];
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
          <CircleLeaderInfo circleLeader={circleLeader} />
          
          <CircleBudgetSummary 
            totalStandardBudget={totalStandardBudget}
            totalCurrentBudget={totalCurrentBudget}
            budgetDifference={budgetDifference}
            isPositiveDifference={isPositiveDifference}
          />
          
          <Separator className="my-4" />
          
          <CircleEmployeesList employees={circleEmployeesData} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleDetailSidebar;
