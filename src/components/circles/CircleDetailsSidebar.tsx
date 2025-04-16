
import React from "react";
import { X } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { CircleData, Employee, RoleData } from "@/types";
import { formatSalary } from "@/utils/formatUtils";

interface CircleDetailsSidebarProps {
  circle: CircleData | null;
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  rolesData: RoleData[];
}

const CircleDetailsSidebar = ({
  circle,
  isOpen,
  onClose,
  employees,
  rolesData
}: CircleDetailsSidebarProps) => {
  if (!circle) return null;

  // Находим лидера круга
  const circleLeader = findCircleLeader(circle.name, rolesData, employees);
  
  // Рассчитываем бюджет круга
  const { standardBudget, actualBudget } = calculateCircleBudget(
    circle.name, 
    rolesData, 
    employees
  );

  const cleanCircleName = circle.name.replace(/["']/g, '').trim();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-bold">{cleanCircleName}</SheetTitle>
          <SheetDescription>
            Функциональный тип: {cleanFunctionalType(circle.functionalType)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Лидер круга</h3>
            <p className="text-gray-700">
              {circleLeader ? circleLeader : "Не назначен"}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Бюджет круга</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Стандартный бюджет</p>
                <p className="text-lg font-medium">{formatSalary(standardBudget)}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Текущий бюджет</p>
                <p className="text-lg font-medium">{formatSalary(actualBudget)}</p>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {actualBudget > standardBudget 
                  ? `Превышение бюджета: ${formatSalary(actualBudget - standardBudget)}`
                  : actualBudget < standardBudget
                    ? `Экономия бюджета: ${formatSalary(standardBudget - actualBudget)}`
                    : "Бюджет соответствует стандартному"}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Функция для поиска лидера круга
function findCircleLeader(
  circleName: string, 
  rolesData: RoleData[], 
  employees: Employee[]
): string | null {
  // Ищем записи с ролью "лидер" в указанном круге
  const leaderRoleEntries = rolesData.filter(role => 
    role.circleName === circleName && 
    role.roleName.toLowerCase().includes("лидер")
  );
  
  if (!leaderRoleEntries.length) return null;
  
  // Находим сотрудника по имени
  const leaderEntry = leaderRoleEntries[0];
  const leaderName = leaderEntry.participantName.replace(/["']/g, '').trim();
  
  return leaderName;
}

// Функция для расчета бюджета круга
function calculateCircleBudget(
  circleName: string, 
  rolesData: RoleData[], 
  employees: Employee[]
): { standardBudget: number; actualBudget: number } {
  let standardBudget = 0;
  let actualBudget = 0;
  
  // Находим все записи для указанного круга
  const circleRoles = rolesData.filter(role => 
    role.circleName === circleName
  );
  
  // Обрабатываем каждую роль в круге
  const processedEmployees = new Set<string>();
  
  circleRoles.forEach(role => {
    const participantName = role.participantName.replace(/["']/g, '').trim().toLowerCase();
    const fte = role.fte || 1;
    
    // Находим сотрудника по имени
    const employee = employees.find(emp => 
      emp.name.replace(/["']/g, '').trim().toLowerCase().includes(participantName)
    );
    
    if (employee && !processedEmployees.has(employee.name)) {
      // Добавляем сотрудника в обработанных, чтобы избежать дублирования
      processedEmployees.add(employee.name);
      
      // Рассчитываем вклад в бюджет
      const standardRate = employee.standardSalary || employee.salary;
      standardBudget += standardRate * fte;
      actualBudget += employee.salary * fte;
    }
  });
  
  return { standardBudget, actualBudget };
}

// Импортируем функцию для очистки функционального типа
function cleanFunctionalType(type: string): string {
  // Удаляем кавычки и трим
  const normalizedType = type.replace(/["']/g, '').trim().toLowerCase();
  
  // Handle "ft" prefix common in functional type notation
  if (normalizedType.startsWith('ft')) {
    return normalizedType.charAt(2).toUpperCase() + normalizedType.slice(3);
  }
  
  // For other notations, just capitalize first letter
  return normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
}

export default CircleDetailsSidebar;
