
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CircleData, RoleData } from "@/types";
import { formatFTE } from "@/utils/employeeUtils";
import { supabase } from "@/integrations/supabase/client";
import { BadgeCheck } from "lucide-react";

interface CircleEmployee {
  name: string;
  fte: number;
}

interface EmployeeWithRoles extends CircleEmployee {
  id: string;
  roles: {
    roleName: string;
    fte: number;
  }[];
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
  const [employeesWithRoles, setEmployeesWithRoles] = useState<EmployeeWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployeeRoles = async () => {
      if (!circle || employees.length === 0) return;
      
      setIsLoading(true);
      
      try {
        // First, find the circle in the database by name
        const { data: circleData, error: circleError } = await supabase
          .from('circles')
          .select('id')
          .eq('name', circle.name)
          .single();

        if (circleError || !circleData) {
          console.error("Error fetching circle ID:", circleError);
          setIsLoading(false);
          return;
        }

        const circleId = circleData.id;
        
        // Get all employees in this circle
        const { data: circleEmployees, error: circleError2 } = await supabase
          .from('employee_circles')
          .select('employee_id')
          .eq('circle_id', circleId);

        if (circleError2) {
          console.error("Error fetching circle employees:", circleError2);
          setIsLoading(false);
          return;
        }

        if (!circleEmployees || circleEmployees.length === 0) {
          setEmployeesWithRoles([]);
          setIsLoading(false);
          return;
        }

        // Get employee details
        const employeeIds = circleEmployees.map(ce => ce.employee_id);
        
        // Get all roles for these employees in this specific circle
        const { data: rolesData, error: rolesError } = await supabase
          .from('employee_roles')
          .select(`
            id,
            employee_id, 
            role_name,
            fte,
            employees!employee_roles_employee_id_fkey(id, name)
          `);

        if (rolesError) {
          console.error("Error fetching employee roles:", rolesError);
          setIsLoading(false);
          return;
        }

        // Get all role names from the roles table
        const { data: allRoleNames, error: roleNamesError } = await supabase
          .from('roles')
          .select('name');
          
        if (roleNamesError) {
          console.error("Error fetching role names:", roleNamesError);
        }

        // Create a map of employee IDs to their names
        const employeeMap = new Map<string, string>();
        
        // Group roles by employee
        const employeeRolesMap = new Map<string, EmployeeWithRoles>();
        
        employees.forEach(emp => {
          // Find matching employee in the rolesData
          const matchingRoles = rolesData?.filter(role => 
            role.employees?.name === emp.name
          );
          
          if (matchingRoles && matchingRoles.length > 0) {
            const employeeId = matchingRoles[0].employee_id;
            employeeMap.set(employeeId, emp.name);
            
            if (!employeeRolesMap.has(employeeId)) {
              employeeRolesMap.set(employeeId, {
                id: employeeId,
                name: emp.name,
                fte: emp.fte,
                roles: []
              });
            }
          }
        });
        
        // Add roles to each employee
        rolesData?.forEach(role => {
          const employeeId = role.employee_id;
          
          // Only add roles for employees in this circle
          if (employeeMap.has(employeeId) && employeeRolesMap.has(employeeId)) {
            const employee = employeeRolesMap.get(employeeId);
            employee?.roles.push({
              roleName: role.role_name,
              fte: Number(role.fte) || 0
            });
          }
        });
        
        setEmployeesWithRoles(Array.from(employeeRolesMap.values()));
      } catch (error) {
        console.error("Error fetching employee roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && circle) {
      fetchEmployeeRoles();
    }
  }, [open, circle, employees]);

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
            {isLoading ? (
              <div className="py-4 text-sm text-muted-foreground">Загрузка данных...</div>
            ) : employees.length === 0 ? (
              <p className="text-muted-foreground text-sm">Сотрудники не найдены</p>
            ) : (
              <div className="space-y-4">
                {employeesWithRoles.length > 0 ? 
                  employeesWithRoles.map((employee, index) => (
                    <div 
                      key={`${employee.id}-${index}`}
                      className="p-3 border rounded-md space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">
                          FTE: {formatFTE(employee.fte)}
                        </div>
                      </div>
                      
                      <div className="pt-1">
                        <p className="text-xs text-muted-foreground mb-1.5">Роли в круге:</p>
                        {employee.roles.length > 0 ? (
                          <div className="space-y-1.5">
                            {employee.roles.map((role, roleIndex) => (
                              <div 
                                key={`${role.roleName}-${roleIndex}`}
                                className="flex items-center gap-1.5 text-sm pl-1"
                              >
                                <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <div className="flex-grow">{role.roleName}</div>
                                <div className="text-xs text-muted-foreground">
                                  FTE: {formatFTE(role.fte)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic pl-1">Нет ролей в этом круге</p>
                        )}
                      </div>
                    </div>
                  )) : employees.map((employee, index) => (
                    <div 
                      key={`${employee.name}-${index}`}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        FTE: {formatFTE(employee.fte)}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleInfoSidebar;
