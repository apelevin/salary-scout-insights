
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CircleData } from "@/types";
import { CircleIcon, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CircleDetailSidebarProps {
  open: boolean;
  onClose: () => void;
  circleName: string;
  functionalType: string;
  circleData?: CircleData;
  employees?: any[];
  rolesData?: any[];
}

const CircleDetailSidebar = ({
  open,
  onClose,
  circleName,
  functionalType,
  circleData,
  employees = [],
  rolesData = []
}: CircleDetailSidebarProps) => {
  
  // More robust employee filtering logic
  const employeesInCircle = employees.filter(employee => {
    if (!employee || !employee.name) return false;
    
    const normalizedEmployeeName = employee.name.toLowerCase().trim();
    const normalizedCircleName = circleName.toLowerCase().trim();
    
    return rolesData.some(role => {
      if (!role) return false;
      
      // Match employee by name
      const roleParticipant = role.participantName || '';
      const participantMatches = 
        normalizedEmployeeName.includes(roleParticipant.toLowerCase().trim()) || 
        roleParticipant.toLowerCase().includes(normalizedEmployeeName);
        
      // Check if circle name matches in any of the circle fields
      const circleMatches = 
        (role.circleName && role.circleName.toLowerCase().trim() === normalizedCircleName) ||
        (role.circle && role.circle.toLowerCase().trim() === normalizedCircleName);
        
      return participantMatches && circleMatches;
    });
  });
  
  // Additional direct lookup by role - fallback method
  const employeesByDirectMatch = employees.filter(employee => {
    if (!employee || !employee.name) return false;
    
    // Direct name lookup in roles with matching circle
    return rolesData.some(role => {
      return (
        // Check if this role belongs to this circle
        ((role.circleName && role.circleName.toLowerCase().trim() === circleName.toLowerCase().trim()) ||
         (role.circle && role.circle.toLowerCase().trim() === circleName.toLowerCase().trim())) &&
        
        // Check if employee name appears in the role participant name
        (role.participantName && 
          (role.participantName.toLowerCase().includes(employee.name.toLowerCase()) ||
           employee.name.toLowerCase().includes(role.participantName.toLowerCase().split(' ')[0])))
      );
    });
  });
  
  // Combine and deduplicate results
  const combinedEmployees = [...employeesInCircle, ...employeesByDirectMatch];
  const uniqueEmployees = Array.from(new Map(combinedEmployees.map(emp => [emp.id || emp.name, emp])).values());
  
  // Extensive logging for debugging
  console.log(`Circle: "${circleName}" - Found ${uniqueEmployees.length} unique employees`);
  console.log(`- Primary method found: ${employeesInCircle.length}`);
  console.log(`- Secondary method found: ${employeesByDirectMatch.length}`);
  
  if (uniqueEmployees.length > 0) {
    console.log("First few employees:", uniqueEmployees.slice(0, 3).map(e => e.name));
  } else {
    // Debug info for troubleshooting
    console.log(`- Total employees available: ${employees.length}`);
    console.log(`- Total roles available: ${rolesData.length}`);
    console.log(`- Roles mentioning this circle:`, rolesData.filter(r => 
      (r.circleName && r.circleName.toLowerCase().includes(circleName.toLowerCase())) || 
      (r.circle && r.circle.toLowerCase().includes(circleName.toLowerCase()))
    ).length);
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <CircleIcon className="h-5 w-5 text-blue-500" />
            <SheetTitle>{circleName}</SheetTitle>
          </div>
          <SheetDescription>
            Функциональный тип: {functionalType}
          </SheetDescription>
        </SheetHeader>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> 
              Сотрудники в этом круге ({uniqueEmployees.length})
            </h3>
            
            {uniqueEmployees.length > 0 ? (
              <div className="mt-2 space-y-1">
                {uniqueEmployees.map((employee, index) => (
                  <div key={employee.id || index} className="p-2 rounded-md hover:bg-muted">
                    {employee.name || employee.fullName || "Сотрудник " + (index + 1)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                В этом круге нет сотрудников
              </p>
            )}
          </div>
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

export default CircleDetailSidebar;
