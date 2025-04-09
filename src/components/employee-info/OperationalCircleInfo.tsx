
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { EmployeeWithRoles } from "@/types";
import { cleanFunctionalType } from "@/utils/formatUtils";

interface OperationalCircleInfoProps {
  employee: EmployeeWithRoles;
}

export const OperationalCircleInfo = ({ employee }: OperationalCircleInfoProps) => {
  // Get the total count of circles led by the employee
  const circleCount = employee.operationalCircleCount || 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleAlert className="h-5 w-5 text-blue-500" />
          Лидерство
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {employee.operationalCircleType && (
            <div className="flex justify-between">
              <span className="text-gray-500">Функциональная принадлежность:</span>
              <span className="font-medium">{cleanFunctionalType(employee.operationalCircleType)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Количество кругов:</span>
            <span className="font-medium">{circleCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
