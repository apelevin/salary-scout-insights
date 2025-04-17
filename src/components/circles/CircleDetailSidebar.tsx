
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
  // Improved employee filtering logic
  const employeesInCircle = employees.filter(employee => {
    const employeeName = employee.name || '';
    
    // Find if this employee is mentioned in any role with this circle
    return rolesData.some(role => {
      // Check if the role has a participant name and circle name that match
      const participantMatchesEmployee = role.participantName && 
        employeeName.includes(role.participantName.split(' ')[0]) ||
        role.participantName === employee.name;
        
      const roleCircleMatchesCurrentCircle = role.circleName && 
        role.circleName.toLowerCase() === circleName.toLowerCase();
      
      // Also check if role has a 'circle' field that matches
      const roleCircleFieldMatchesCurrentCircle = role.circle && 
        role.circle.toLowerCase() === circleName.toLowerCase();
        
      return participantMatchesEmployee && 
        (roleCircleMatchesCurrentCircle || roleCircleFieldMatchesCurrentCircle);
    });
  });
  
  // Log for debugging
  console.log(`Found ${employeesInCircle.length} employees for circle: ${circleName}`);
  if (employeesInCircle.length > 0) {
    console.log("Example employee:", employeesInCircle[0].name);
  }

  console.log(`Total employees: ${employees.length}, Total roles: ${rolesData.length}`);

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
              Сотрудники в этом круге ({employeesInCircle.length})
            </h3>
            
            {employeesInCircle.length > 0 ? (
              <div className="mt-2 space-y-1">
                {employeesInCircle.map((employee, index) => (
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
