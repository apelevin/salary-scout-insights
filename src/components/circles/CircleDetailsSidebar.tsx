
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CircleData, Employee, RoleData } from "@/types";
import { Users, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CircleDetailsSidebarProps {
  circleName: string;
  open: boolean;
  onClose: () => void;
  employees: Employee[];
  rolesData: RoleData[];
}

const CircleDetailsSidebar = ({ 
  circleName, 
  open, 
  onClose,
  employees,
  rolesData
}: CircleDetailsSidebarProps) => {
  // Находим сотрудников, которые связаны с этим кругом
  const circleEmployees = employees.filter(employee => {
    // Проверяем наличие операционных кругов у сотрудника
    if ('operationalCircleRoles' in employee && employee.operationalCircleRoles) {
      // Если есть, проверяем наличие текущего круга в списке операционных кругов
      return Object.keys(employee.operationalCircleRoles).some(
        circle => circle.toLowerCase() === circleName.toLowerCase()
      );
    }
    return false;
  });

  // Найти стандартную ставку для роли
  const findStandardRateForRole = (roleName: string) => {
    const role = rolesData.find(r => 
      r.name && r.name.toLowerCase() === roleName.toLowerCase());
    return role && role.standardSalary ? role.standardSalary : 0;
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            {circleName}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Участники круга ({circleEmployees.length})</h3>
          </div>

          {circleEmployees.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Нет сотрудников, связанных с этим кругом
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {circleEmployees.map((employee) => {
                const operationalRoles = 'operationalCircleRoles' in employee && employee.operationalCircleRoles 
                  ? employee.operationalCircleRoles[circleName] || []
                  : [];
                
                // Рассчитываем общий FTE для этого сотрудника в данном круге
                const totalCircleFTE = operationalRoles.reduce((sum, role) => sum + role.fte, 0);
                
                // Рассчитываем стандартный бюджет на основе стандартных ставок ролей
                let standardBudget = 0;
                operationalRoles.forEach(role => {
                  const standardRate = findStandardRateForRole(role.name);
                  standardBudget += standardRate * role.fte;
                });
                
                // Рассчитываем фактический бюджет на основе текущей зарплаты
                const actualBudget = employee.salary * totalCircleFTE;
                
                // Рассчитываем разницу и процент отклонения
                const difference = standardBudget - actualBudget;
                const percentageDifference = standardBudget > 0 
                  ? (difference / standardBudget) * 100 
                  : 0;
                
                const isPositive = difference > 0;

                return (
                  <Card key={employee.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 p-4">
                      <CardTitle className="text-base font-medium flex justify-between items-center">
                        <span>{employee.lastName} {employee.firstName}</span>
                        <Badge className="ml-2">FTE: {totalCircleFTE.toFixed(2)}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      {operationalRoles.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Роли:</div>
                          <div className="flex flex-wrap gap-1">
                            {operationalRoles.map((role, idx) => (
                              <Badge key={idx} variant="outline" className="flex gap-1">
                                <span>{role.name}</span>
                                <span className="text-gray-500">({role.fte.toFixed(2)})</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Separator className="my-3" />
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Стандартный:</div>
                        <div className="font-medium text-right">{standardBudget.toLocaleString()} ₽</div>
                        
                        <div className="text-gray-500">Текущий:</div>
                        <div className="font-medium text-right">{actualBudget.toLocaleString()} ₽</div>
                        
                        <div className="text-gray-500">Разница:</div>
                        <div className="font-medium text-right flex justify-end items-center gap-1">
                          <span className={isPositive ? "text-green-600" : "text-red-600"}>
                            {isPositive ? "+" : ""}{difference.toLocaleString()} ₽
                          </span>
                          <Badge variant="outline" className={isPositive ? "text-green-600 border-green-300" : "text-red-600 border-red-300"}>
                            {isPositive ? "+" : ""}{Math.abs(percentageDifference).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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

export default CircleDetailsSidebar;
