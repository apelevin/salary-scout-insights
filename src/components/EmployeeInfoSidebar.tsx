
import { 
  Sheet, 
  SheetContent,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Employee, EmployeeWithRoles, LeadershipData, CircleData } from "@/types";
import { EmployeeHeader } from "./employee-info/EmployeeHeader";
import { FinancialInfo } from "./employee-info/FinancialInfo";
import { SalaryCalculation } from "./employee-info/SalaryCalculation";
import { RolesAndWorkload } from "./employee-info/RolesAndWorkload";
import { OperationalCircleInfo } from "./employee-info/OperationalCircleInfo";

interface EmployeeInfoSidebarProps {
  employee: Employee | EmployeeWithRoles | null;
  open: boolean;
  onClose: () => void;
  leadershipData: LeadershipData[];
  circlesData?: CircleData[];
  incognitoMode?: boolean;
}

const EmployeeInfoSidebar = ({ 
  employee, 
  open, 
  onClose, 
  leadershipData,
  circlesData = [],
  incognitoMode = false
}: EmployeeInfoSidebarProps) => {
  if (!employee) {
    return null;
  }

  // Check if the employee has the properties of EmployeeWithRoles
  const hasRoles = 'roles' in employee && 'totalFTE' in employee && 'normalizedRolesFTE' in employee;

  // Log leadership data to help with debugging
  console.log("EmployeeInfoSidebar received leadership data:", {
    count: leadershipData?.length || 0,
    sample: leadershipData?.slice(0, 2) || []
  });
  
  // Log circles data for debugging
  console.log("EmployeeInfoSidebar received circles data:", {
    count: circlesData?.length || 0,
    sample: circlesData?.slice(0, 2).map(c => ({ name: c.name, type: c.functionalType })) || []
  });

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <EmployeeHeader employee={employee} incognitoMode={incognitoMode} />

        <div className="space-y-6">
          <FinancialInfo employee={employee} />
          
          {hasRoles && (
            <SalaryCalculation employee={employee as EmployeeWithRoles} />
          )}
          
          {hasRoles && 'operationalCircleCount' in employee && employee.operationalCircleCount && employee.operationalCircleCount > 0 && (
            <OperationalCircleInfo 
              employee={employee as EmployeeWithRoles} 
              leadershipData={leadershipData}
              circlesData={circlesData}
            />
          )}
          
          {hasRoles && (
            <RolesAndWorkload employee={employee as EmployeeWithRoles} />
          )}
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
