
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
  // Find employees in this circle by matching circle name
  const employeesInCircle = employees.filter(employee => {
    // Проверяем наличие связанных ролей у сотрудника
    if (!employee.roles) return false;
    
    // Проверяем каждую роль сотрудника
    return employee.roles.some(employeeRole => 
      // Ищем соответствующую роль в данных о ролях
      rolesData.some(roleData => {
        // Проверяем совпадение ID роли и круга
        return roleData.id === employeeRole.roleId && 
               roleData.circle && 
               roleData.circle.toLowerCase() === circleName.toLowerCase();
      })
    );
  });

  // Если сотрудники не найдены через роли, пробуем альтернативный метод
  // через поле circleName в данных о ролях
  const alternativeEmployeesInCircle = employees.filter(employee => {
    return rolesData.some(role => 
      role.participantName === employee.name && 
      role.circleName && 
      role.circleName.toLowerCase() === circleName.toLowerCase()
    );
  });

  // Объединяем результаты двух методов поиска и удаляем дубликаты
  const allEmployeesInCircle = [...employeesInCircle, ...alternativeEmployeesInCircle]
    .filter((employee, index, self) => 
      index === self.findIndex((e) => e.id === employee.id)
    );

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
              Сотрудники в этом круге ({allEmployeesInCircle.length})
            </h3>
            
            {allEmployeesInCircle.length > 0 ? (
              <div className="mt-2 space-y-1">
                {allEmployeesInCircle.map((employee, index) => (
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
