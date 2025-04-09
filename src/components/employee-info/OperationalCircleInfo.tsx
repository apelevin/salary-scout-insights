
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { EmployeeWithRoles } from "@/types";
import { cleanFunctionalType } from "@/utils/formatUtils";

interface OperationalCircleInfoProps {
  employee: EmployeeWithRoles;
}

export const OperationalCircleInfo = ({ employee }: OperationalCircleInfoProps) => {
  // Get the count of operational circles from the employee data
  const operationalCircleCount = employee.operationalCircleCount || 1;
  // Get the count of strategic circles from the employee data
  const strategicCircleCount = employee.strategicCircleCount;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleAlert className="h-5 w-5 text-blue-500" />
          Лидерство в кругах
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Функциональная принадлежность:</span>
            <span className="font-medium">{cleanFunctionalType(employee.operationalCircleType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Операционных кругов:</span>
            <span className="font-medium">{operationalCircleCount}</span>
          </div>
          {strategicCircleCount !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Стратегических кругов:</span>
              <span className="font-medium">{strategicCircleCount}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
