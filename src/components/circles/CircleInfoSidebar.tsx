
import { 
  Sheet, 
  SheetContent,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RoleData } from "@/types";
import { formatName } from "@/utils/employeeUtils";
import { Users } from "lucide-react";

interface CircleInfoSidebarProps {
  circleName: string;
  open: boolean;
  onClose: () => void;
  rolesData: RoleData[];
}

interface CircleEmployee {
  name: string;
  fte: number;
}

const CircleInfoSidebar = ({ 
  circleName, 
  open, 
  onClose,
  rolesData = []
}: CircleInfoSidebarProps) => {
  // Фильтруем сотрудников по кругу и группируем по имени
  const employees: CircleEmployee[] = [];
  const processedNames = new Set();
  
  rolesData.forEach(role => {
    if (role.circleName?.replace(/["']/g, '').trim() === circleName) {
      const name = formatName(role.participantName);
      
      if (!processedNames.has(name)) {
        processedNames.add(name);
        
        // Рассчитываем общий FTE для сотрудника в этом круге
        const totalFte = rolesData
          .filter(r => 
            formatName(r.participantName) === name && 
            r.circleName?.replace(/["']/g, '').trim() === circleName
          )
          .reduce((sum, r) => sum + (r.fte || 0), 0);
          
        employees.push({
          name,
          fte: totalFte
        });
      }
    }
  });

  // Сортируем сотрудников по имени
  employees.sort((a, b) => a.name.localeCompare(b.name, "ru"));

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold">Круг: {circleName}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Всего сотрудников: {employees.length}
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium pb-1 border-b">Сотрудники круга</h3>
          
          {employees.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              В этом круге нет сотрудников
            </p>
          ) : (
            <ul className="space-y-2 mt-2">
              {employees.map((employee, i) => (
                <li key={i} className="flex justify-between items-center py-2 px-1 border-b border-dashed border-gray-100">
                  <span className="text-sm">{employee.name}</span>
                  <span className="text-sm font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    FTE: {employee.fte.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
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

export default CircleInfoSidebar;
