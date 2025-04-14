
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { EmployeeWithRoles } from "@/types";
import { formatFTE } from "@/utils/formatUtils";

interface RolesAndWorkloadProps {
  employee: EmployeeWithRoles;
}

export const RolesAndWorkload = ({ employee }: RolesAndWorkloadProps) => {
  return (
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
            {Array.from(employee.normalizedRolesFTE).map(([role, fte], index) => {
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
  );
};
