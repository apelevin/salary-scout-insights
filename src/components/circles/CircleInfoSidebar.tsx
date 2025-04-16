
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CircleData, RoleData } from "@/types";
import { formatFTE } from "@/utils/employeeUtils";
import { formatSalary } from "@/utils/formatUtils";

interface CircleEmployee {
  name: string;
  fte: number;
  role?: string;
  standardSalaries?: Map<string, number>; // Added standard salaries map
}

interface CircleInfoSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circle: CircleData | null;
  employees: CircleEmployee[];
}

const CircleInfoSidebar = ({
  open,
  onOpenChange,
  circle,
  employees
}: CircleInfoSidebarProps) => {
  if (!circle) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">
            {circle.name}
          </SheetTitle>
          <div className="text-sm text-muted-foreground">
            {circle.functionalType}
          </div>
        </SheetHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Сотрудники круга</h3>
            {employees.length === 0 ? (
              <p className="text-muted-foreground text-sm">Сотрудники не найдены</p>
            ) : (
              <div className="space-y-2">
                {employees.map((employee, index) => (
                  <div 
                    key={`${employee.name}-${index}`}
                    className="flex flex-col p-2 border rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        FTE: {formatFTE(employee.fte)}
                      </div>
                    </div>
                    {employee.role && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {employee.role.includes(',') ? (
                          <div>
                            <div>Роли:</div>
                            <ol className="list-decimal ml-5 mt-1">
                              {employee.role.split(',').map((role, roleIndex) => {
                                const roleName = role.trim();
                                const standardSalary = employee.standardSalaries?.get(roleName);
                                
                                return (
                                  <li key={roleIndex} className="flex justify-between items-center">
                                    <span>{roleName}</span>
                                    {standardSalary !== undefined && (
                                      <span className="font-medium text-gray-700">
                                        {formatSalary(standardSalary)}
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <div>Роль: {employee.role}</div>
                            {employee.standardSalaries?.get(employee.role) !== undefined && (
                              <div className="font-medium text-gray-700">
                                {formatSalary(employee.standardSalaries.get(employee.role)!)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleInfoSidebar;
