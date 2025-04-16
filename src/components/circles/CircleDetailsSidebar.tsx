
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RoleData, Employee } from "@/types";
import { formatFTE, formatName } from "@/utils/formatUtils";
import { findStandardRateForRole } from "@/utils/salaryUtils";

interface CircleDetailsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circleName: string;
  rolesData: RoleData[];
  employees: Employee[];
  customStandardSalaries: Map<string, number>;
}

interface EmployeeInCircle {
  name: string;
  fte: number;
  roleName: string;
}

const CircleDetailsSidebar = ({
  open,
  onOpenChange,
  circleName,
  rolesData,
  employees,
  customStandardSalaries
}: CircleDetailsSidebarProps) => {
  const [circleRoles, setCircleRoles] = useState<RoleData[]>([]);
  const [circleEmployees, setCircleEmployees] = useState<EmployeeInCircle[]>([]);

  // Find all roles within the selected circle
  useEffect(() => {
    if (!circleName || !rolesData.length) return;

    const roles = rolesData.filter(role => 
      role.circleName && role.circleName.replace(/["']/g, '').trim().toLowerCase() === 
      circleName.replace(/["']/g, '').trim().toLowerCase()
    );
    
    setCircleRoles(roles);

    // Map role data to employees
    const employeesInCircle: EmployeeInCircle[] = [];
    
    roles.forEach(role => {
      if (!role.participantName) return;
      
      const cleanParticipantName = role.participantName.replace(/["']/g, '').trim();
      
      // Find the employee that matches the participant name
      const employee = employees.find(emp => {
        const cleanEmpName = emp.name.replace(/["']/g, '').trim();
        const nameMatch = cleanEmpName.toLowerCase().includes(cleanParticipantName.toLowerCase()) || 
                         cleanParticipantName.toLowerCase().includes(cleanEmpName.toLowerCase());
        return nameMatch;
      });
      
      if (employee) {
        employeesInCircle.push({
          name: employee.name,
          fte: role.fte || 0,
          roleName: role.roleName
        });
      } else {
        // If we couldn't find an exact match, just use the participant name from the role
        employeesInCircle.push({
          name: role.participantName,
          fte: role.fte || 0,
          roleName: role.roleName
        });
      }
    });
    
    // Remove duplicates by combining FTEs for same employees
    const uniqueEmployees = employeesInCircle.reduce((acc: EmployeeInCircle[], current) => {
      const existingEmployee = acc.find(emp => emp.name === current.name);
      
      if (existingEmployee) {
        existingEmployee.fte += current.fte;
      } else {
        acc.push(current);
      }
      
      return acc;
    }, []);
    
    // Sort by FTE in descending order
    uniqueEmployees.sort((a, b) => b.fte - a.fte);
    
    setCircleEmployees(uniqueEmployees);
  }, [circleName, rolesData, employees]);

  // Generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .replace(/["']/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{circleName}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Участники круга ({circleEmployees.length})</h3>
          <ScrollArea className="h-[500px] pr-4">
            {circleEmployees.map((employee, index) => (
              <Card key={`${employee.name}-${index}`} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{formatName(employee.name)}</h4>
                        <span className="text-sm font-medium">
                          FTE: {formatFTE(employee.fte)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{employee.roleName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {circleEmployees.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Нет данных об участниках этого круга
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleDetailsSidebar;
