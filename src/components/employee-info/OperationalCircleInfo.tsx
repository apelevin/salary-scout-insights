
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { EmployeeWithRoles } from "@/types";
import { cleanFunctionalType } from "@/utils/formatUtils";

interface OperationalCircleInfoProps {
  employee: EmployeeWithRoles;
}

export const OperationalCircleInfo = ({ employee }: OperationalCircleInfoProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleAlert className="h-5 w-5 text-blue-500" />
          Лидер операционного круга
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Функциональная принадлежность:</span>
            <span className="font-medium">{cleanFunctionalType(employee.operationalCircleType)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
