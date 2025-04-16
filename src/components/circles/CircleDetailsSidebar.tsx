
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Employee, RoleData, CircleData } from "@/types";
import { useMemo } from "react";

interface CircleDetailsSidebarProps {
  open: boolean;
  onClose: () => void;
  circle: CircleData | null;
  rolesData: RoleData[];
  employees: Employee[];
}

const CircleDetailsSidebar = ({ 
  open, 
  onClose, 
  circle, 
  rolesData,
  employees
}: CircleDetailsSidebarProps) => {
  // Find the leader of this circle
  const circleLeader = useMemo(() => {
    if (!circle || !rolesData.length || !employees.length) return null;

    // Find role entries for this circle with "лидер операционного круга" role
    const leaderRoleEntries = rolesData.filter(role => 
      role.circleName?.toLowerCase() === circle.name.toLowerCase() && 
      role.roleName?.toLowerCase().includes("лидер операционного круга")
    );

    if (leaderRoleEntries.length === 0) return null;

    // Get the name of the leader from the role entries
    const leaderEntry = leaderRoleEntries[0];
    if (!leaderEntry.participantName) return null;

    // Find the employee with matching name
    const leaderName = leaderEntry.participantName.replace(/["']/g, '').trim().toLowerCase();
    
    const leader = employees.find(emp => {
      const empName = emp.name.replace(/["']/g, '').trim().toLowerCase();
      return empName.includes(leaderName) || leaderName.includes(empName);
    });

    return leader || null;
  }, [circle, rolesData, employees]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {circle ? circle.name.replace(/["']/g, '').trim() : 'Информация о круге'}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Лидер круга</h3>
            <p className="text-base">
              {circleLeader 
                ? circleLeader.name.replace(/["']/g, '').trim() 
                : 'Не назначен'}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleDetailsSidebar;
