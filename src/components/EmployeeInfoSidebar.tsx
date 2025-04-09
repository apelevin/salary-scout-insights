
import { 
  Sheet, 
  SheetContent,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EmployeeWithRoles } from "@/types";
import { EmployeeHeader } from "./employee-info/EmployeeHeader";
import { FinancialInfo } from "./employee-info/FinancialInfo";
import { SalaryCalculation } from "./employee-info/SalaryCalculation";
import { RolesAndWorkload } from "./employee-info/RolesAndWorkload";
import { OperationalCircleInfo } from "./employee-info/OperationalCircleInfo";

interface EmployeeInfoSidebarProps {
  employee: EmployeeWithRoles | null;
  open: boolean;
  onClose: () => void;
}

const EmployeeInfoSidebar = ({ employee, open, onClose }: EmployeeInfoSidebarProps) => {
  if (!employee) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <EmployeeHeader employee={employee} />

        <div className="space-y-6">
          <FinancialInfo employee={employee} />
          <SalaryCalculation employee={employee} />
          
          {(employee.operationalCircleType || employee.strategicCircleCount) && (
            <OperationalCircleInfo employee={employee} />
          )}
          
          <RolesAndWorkload employee={employee} />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeInfoSidebar;
