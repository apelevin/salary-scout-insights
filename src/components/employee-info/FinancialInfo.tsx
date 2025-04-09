
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { EmployeeWithRoles } from "@/types";
import { formatSalary } from "@/utils/formatUtils";

interface FinancialInfoProps {
  employee: EmployeeWithRoles;
}

export const FinancialInfo = ({ employee }: FinancialInfoProps) => {
  return (
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
  );
};
