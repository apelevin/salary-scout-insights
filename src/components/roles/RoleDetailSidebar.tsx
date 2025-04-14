
import React, { memo } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Employee } from "@/types";
import { DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRoleEmployees } from "./sidebar/useRoleEmployees";
import RoleBudgetSummary from "./sidebar/RoleBudgetSummary";
import RoleEmployeeList from "./sidebar/RoleEmployeeList";
import { formatSalary } from "@/utils/formatUtils";

interface RoleDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string | null;
  employees: Employee[];
  rolesData: any[];
  standardSalary: number;
  incognitoMode?: boolean;
  minSalary?: number;
  maxSalary?: number;
}

const RoleDetailSidebar = ({
  isOpen,
  onClose,
  roleName,
  employees,
  rolesData,
  standardSalary,
  incognitoMode = false,
  minSalary = 0,
  maxSalary = 0
}: RoleDetailSidebarProps) => {
  // Return null only after all props have been destructured
  if (!roleName) return null;

  // Move hook call here to avoid React errors
  const { employeesWithRole, totalRoleCost } = useRoleEmployees(roleName, employees, rolesData);
  
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
          {/* Role salary info: Min, Standard, Max */}
          <div className="grid grid-cols-3 gap-4 mb-4 bg-muted/50 p-3 rounded-md">
            <div>
              <h4 className="text-xs text-muted-foreground">Минимальный оклад:</h4>
              <p className="font-medium">{formatSalary(minSalary)}</p>
            </div>
            <div>
              <h4 className="text-xs text-muted-foreground">Стандартный оклад:</h4>
              <p className="font-medium">{formatSalary(standardSalary)}</p>
            </div>
            <div>
              <h4 className="text-xs text-muted-foreground">Максимальный оклад:</h4>
              <p className="font-medium">{formatSalary(maxSalary)}</p>
            </div>
          </div>
          
          {/* Role budget summary */}
          <RoleBudgetSummary
            standardSalary={standardSalary}
            totalRoleCost={totalRoleCost}
            employeeCount={employeesWithRole.length}
            incognitoMode={incognitoMode}
          />
          
          <Separator className="my-4" />
          
          {/* Employees list */}
          <RoleEmployeeList
            employeesWithRole={employeesWithRole}
            totalRoleCost={totalRoleCost}
            incognitoMode={incognitoMode}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Мемоизируем компонент для оптимизации производительности
export default memo(RoleDetailSidebar);
