
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
import { LeaderCirclesList } from "./employee-info/LeaderCirclesList";

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

  // Check if employee has any leadership roles
  const isLeader = hasRoles && 'roles' in employee && 
    employee.roles.some(role => 
      role.toLowerCase().includes('лидер')
    );

  // Get lead circles if the employee is an enhanced EmployeeWithRoles type
  const leadCircles = hasRoles && 'leadCircles' in employee ? employee.leadCircles : [];

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
          
          {hasRoles && (
            <RolesAndWorkload employee={employee as EmployeeWithRoles} />
          )}

          {/* Display lead circles section if employee is a leader and has lead circles */}
          {isLeader && leadCircles && leadCircles.length > 0 && (
            <LeaderCirclesList 
              leadCircles={leadCircles} 
              incognitoMode={incognitoMode}
            />
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
