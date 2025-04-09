import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { User, DollarSign, Briefcase, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types";
import { cleanRoleName, formatSalary, formatFTE } from "@/utils/formatUtils";

interface EmployeeWithRoles extends Employee {
  roles: string[];
  totalFTE: number;
  normalizedRolesFTE: Map<string, number>;
  standardSalary?: number;
}

interface EmployeeInfoSidebarProps {
  employee: EmployeeWithRoles | null;
  open: boolean;
  onClose: () => void;
}

const EmployeeInfoSidebar = ({ employee, open, onClose }: EmployeeInfoSidebarProps) => {
  if (!employee) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-blue-500" />
            {cleanRoleName(employee.name)}
          </SheetTitle>
          <SheetDescription>
            Подробная информация о сотруднике
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Финансовая информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-sm text-gray-500">Текущая зарплата:</span>
                <span className="font-semibold">{formatSalary(employee.salary)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-sm text-gray-500">Стандартная зарплата:</span>
                <span className="font-semibold">
                  {employee.standardSalary && employee.standardSalary > 0 ? 
                    formatSalary(employee.standardSalary) : 
                    "Не определена"
                  }
                </span>
              </div>
              {employee.standardSalary && employee.standardSalary > 0 && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-500">Разница:</span>
                  <Badge className={employee.salary >= employee.standardSalary ? "bg-green-500" : "bg-red-500"}>
                    {employee.salary >= employee.standardSalary ? "+" : "-"}
                    {formatSalary(Math.abs(employee.salary - employee.standardSalary))}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {employee.standardSalary && employee.standardSalary > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-500" />
                  Расчет стандартной зарплаты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="mb-2">Стандартная зарплата рассчитывается на основе:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Нормализованных значений FTE для каждой роли</li>
                      <li>Стандартных окладов для каждой роли</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    {Array.from(employee.normalizedRolesFTE.entries()).map(([role, fte], index) => {
                      const roleContribution = employee.standardSalary 
                        ? employee.standardSalary * fte
                        : 0;
                      
                      return (
                        <div key={index} className="border rounded-md p-3">
                          <h4 className="font-semibold text-sm mb-2">{role}</h4>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                            <span className="text-gray-500">Нормализованный FTE:</span>
                            <span className="text-right">{formatFTE(fte)}</span>
                            
                            <span className="text-gray-500">Вклад в стандартную зарплату:</span>
                            <span className="text-right font-medium">{formatSalary(roleContribution)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Итоговая стандартная зарплата:</span>
                      <span className="font-semibold">{formatSalary(employee.standardSalary)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Роли и нагрузка
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employee.roles.length > 0 ? (
                <div className="space-y-4">
                  {Array.from(employee.normalizedRolesFTE.entries()).map(([role, fte], index) => {
                    const originalFTE = employee.totalFTE > 0 
                      ? fte * employee.totalFTE 
                      : 0;
                    
                    return (
                      <div key={index} className="border rounded-md p-3">
                        <h4 className="font-semibold mb-2">{role}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Первоначальный FTE:</span>
                            <span>{formatFTE(originalFTE)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Нормализованный FTE:</span>
                            <span>{formatFTE(fte)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="font-medium mb-1">Суммарная нагрузка:</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">FTE до нормализации:</span>
                      <span className="font-medium">{formatFTE(employee.totalFTE)}</span>
                    </div>
                    
                    {employee.totalFTE !== 1 && (
                      <div className="text-xs text-gray-500 mt-2">
                        {employee.totalFTE > 1 
                          ? "FTE пропорционально уменьшен до 1.00" 
                          : "FTE пропорционально увеличен до 1.00"}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  У сотрудника нет назначенных ролей
                </div>
              )}
            </CardContent>
          </Card>
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

export default EmployeeInfoSidebar;
