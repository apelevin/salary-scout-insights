
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CircleData, Employee } from "@/types";
import { Circle, Users } from "lucide-react";
import { formatName } from "@/utils/formatUtils";

interface CircleInfoSidebarProps {
  circleName: string | null;
  open: boolean;
  onClose: () => void;
  circlesData: CircleData[];
  employees: Employee[];
}

const CircleInfoSidebar = ({ 
  circleName, 
  open, 
  onClose, 
  circlesData,
  employees
}: CircleInfoSidebarProps) => {
  if (!circleName) {
    return null;
  }

  // Находим данные о круге
  const circleData = circlesData.find(circle => 
    circle.name.replace(/["']/g, '').trim() === circleName
  );

  // Находим сотрудников, которые числятся в этом круге
  const circleEmployees = employees.filter(employee => {
    if (!employee.roles) return false;
    
    // Проверяем, есть ли у сотрудника роли в этом круге
    return employee.roles.some(role => {
      return role.circle && role.circle.replace(/["']/g, '').trim() === circleName;
    });
  });

  const functionalType = circleData ? 
    circleData.functionalType.replace(/["']/g, '').trim() : 
    "Неизвестный тип";

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Circle className="w-5 h-5 text-blue-500" />
            {circleName}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Функциональный тип</h3>
            <p className="mt-1">{functionalType}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Сотрудники в круге {circleEmployees.length ? `(${circleEmployees.length})` : ''}
            </h3>
            {circleEmployees.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {circleEmployees.map((employee) => (
                  <li key={employee.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                    <span>{formatName(employee.name)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-gray-500">В этом круге нет сотрудников</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleInfoSidebar;
