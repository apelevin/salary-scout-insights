
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types";
import { CircleIcon, UserRound } from "lucide-react";
import { useEmployeeData } from "@/context/EmployeeDataContext";
import { formatName } from "@/utils/formatUtils";

interface CircleMembersDrawerProps {
  circleName: string;
  open: boolean;
  onClose: () => void;
}

const CircleMembersDrawer = ({
  circleName,
  open,
  onClose
}: CircleMembersDrawerProps) => {
  const { employees, getEmployeeCircles } = useEmployeeData();
  
  // Filter employees by circle name
  const circleMembers = employees.filter(employee => {
    const employeeCircles = getEmployeeCircles(employee);
    return employeeCircles.some(circle => 
      circle.toLowerCase() === circleName.toLowerCase()
    );
  });

  return (
    <Drawer open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <CircleIcon className="h-5 w-5 text-indigo-500" />
            <span>{circleName}</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 py-2">
          <div className="text-sm text-muted-foreground mb-2">
            Сотрудники в круге: {circleMembers.length}
          </div>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {circleMembers.length > 0 ? (
              circleMembers.map((employee) => (
                <div 
                  key={employee.id || employee.name} 
                  className="p-3 border rounded-md flex items-center gap-3"
                >
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <UserRound className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-medium">{formatName(employee.name)}</div>
                    {'roles' in employee && (
                      <div className="text-xs text-muted-foreground">
                        {employee.roles.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Нет сотрудников в этом круге
              </div>
            )}
          </div>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CircleMembersDrawer;
