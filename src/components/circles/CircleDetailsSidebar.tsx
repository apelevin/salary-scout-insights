import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Employee, RoleData, CircleData } from "@/types";
import { useMemo } from "react";
import { formatSalary } from "@/utils/employeeUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSalaryDifference } from "@/utils/salaryUtils";

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

  // Get members of the circle
  const circleMembers = useMemo(() => {
    if (!circle || !rolesData.length || !employees.length) return [];

    // Find all role entries for this circle
    const circleRoles = rolesData.filter(role => 
      role.circleName?.toLowerCase() === circle.name.toLowerCase() && 
      role.participantName && 
      role.fte
    );
    
    const members: Array<{
      employee: Employee;
      fte: number;
      standardBudget: number;
      actualBudget: number;
      proportionalBudget: number;
      difference: {
        value: number;
        percentage: number;
      };
      roleName: string;
    }> = [];
    
    // For each role, find the employee and calculate their contribution
    circleRoles.forEach(role => {
      const participantName = role.participantName.replace(/["']/g, '').trim().toLowerCase();
      const fte = role.fte || 0;
      
      // Find matching employee
      const employee = employees.find(emp => {
        const empName = emp.name.replace(/["']/g, '').trim().toLowerCase();
        return empName.includes(participantName) || participantName.includes(empName);
      });
      
      if (employee) {
        const standardSalary = employee.standardSalary || employee.salary;
        const standardBudget = standardSalary * fte;
        const actualBudget = employee.salary * fte;
        
        // Calculate salary difference percentage for proportional adjustment
        let percentageDiff = 0;
        if (standardSalary > 0) {
          percentageDiff = ((employee.salary - standardSalary) / standardSalary) * 100;
        }
        
        // Calculate proportionally adjusted budget
        // If actual salary is 10% higher than standard, then proportional budget is 10% higher than standard budget
        const proportionalBudget = standardBudget * (1 + percentageDiff / 100);
        
        members.push({
          employee,
          fte,
          standardBudget,
          actualBudget,
          proportionalBudget,
          difference: {
            value: employee.salary - standardSalary,
            percentage: percentageDiff
          },
          roleName: role.roleName || 'Не указана'
        });
      }
    });
    
    // Sort by contribution amount (descending)
    return members.sort((a, b) => b.standardBudget - a.standardBudget);
  }, [circle, rolesData, employees]);

  // Calculate circle budget based on standard salaries
  const circleBudget = useMemo(() => {
    if (!circle || !rolesData.length || !employees.length) return 0;

    let totalBudget = 0;

    // Find all role entries for this circle
    const circleRoles = rolesData.filter(role => 
      role.circleName?.toLowerCase() === circle.name.toLowerCase() && 
      role.participantName && 
      role.fte
    );
    
    // For each role, find the employee and add their contribution to the budget
    circleRoles.forEach(role => {
      const participantName = role.participantName.replace(/["']/g, '').trim().toLowerCase();
      const fte = role.fte || 0;
      
      // Find matching employee
      const employee = employees.find(emp => {
        const empName = emp.name.replace(/["']/g, '').trim().toLowerCase();
        return empName.includes(participantName) || participantName.includes(empName);
      });
      
      if (employee && employee.standardSalary) {
        // If employee has a standard salary defined, use it
        totalBudget += employee.standardSalary * fte;
      } else if (employee) {
        // Otherwise use their actual salary
        totalBudget += employee.salary * fte;
      }
    });
    
    return totalBudget;
  }, [circle, rolesData, employees]);

  // Calculate circle budget based on actual salaries
  const actualCircleBudget = useMemo(() => {
    if (!circle || !rolesData.length || !employees.length) return 0;

    let totalBudget = 0;

    // Find all role entries for this circle
    const circleRoles = rolesData.filter(role => 
      role.circleName?.toLowerCase() === circle.name.toLowerCase() && 
      role.participantName && 
      role.fte
    );
    
    // For each role, find the employee and add their actual salary contribution
    circleRoles.forEach(role => {
      const participantName = role.participantName.replace(/["']/g, '').trim().toLowerCase();
      const fte = role.fte || 0;
      
      // Find matching employee
      const employee = employees.find(emp => {
        const empName = emp.name.replace(/["']/g, '').trim().toLowerCase();
        return empName.includes(participantName) || participantName.includes(empName);
      });
      
      if (employee) {
        totalBudget += employee.salary * fte;
      }
    });
    
    return totalBudget;
  }, [circle, rolesData, employees]);

  // Calculate circle budget based on proportional adjustment
  const proportionalCircleBudget = useMemo(() => {
    if (!circleMembers.length) return 0;
    
    return circleMembers.reduce((total, member) => total + member.proportionalBudget, 0);
  }, [circleMembers]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="overflow-y-auto">
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
          
          <div className="pt-2 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Бюджет круга (стандартные оклады)</h3>
            <p className="text-base font-semibold">
              {formatSalary(circleBudget)}
            </p>
          </div>

          <div className="pt-2 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Бюджет круга (фактические оклады)</h3>
            <p className="text-base font-semibold">
              {formatSalary(actualCircleBudget)}
            </p>
          </div>
          
          <div className="pt-2 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Бюджет круга (пропорциональный)</h3>
            <p className="text-base font-semibold">
              {formatSalary(proportionalCircleBudget)}
            </p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Участники круга</h3>
            
            {circleMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Нет данных об участниках</p>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {circleMembers.map((member, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{member.employee.name.replace(/["']/g, '').trim()}</p>
                          <p className="text-sm text-muted-foreground">{member.roleName.replace(/["']/g, '').trim()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">FTE: {member.fte.toFixed(2)}</p>
                          {member.difference.percentage !== 0 && (
                            <p className={`text-xs ${member.difference.percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {member.difference.percentage > 0 ? '+' : ''}{member.difference.percentage.toFixed(0)}%
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Стандартный</p>
                          <p className="text-sm font-medium">{formatSalary(member.standardBudget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Пропорциональный</p>
                          <p className="text-sm font-medium">{formatSalary(member.proportionalBudget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Фактический</p>
                          <p className="text-sm font-medium">{formatSalary(member.actualBudget)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleDetailsSidebar;
