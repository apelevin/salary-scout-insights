
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { Employee, EmployeeWithRoles } from "@/types";
import { formatSalary } from "@/utils/formatUtils";
import { calculateSalaryDifference, calculateSalaryPercentage } from "@/utils/salaryDifferenceUtils";

interface FinancialInfoProps {
  employee: Employee | EmployeeWithRoles;
}

export const FinancialInfo = ({ employee }: FinancialInfoProps) => {
  // Check if employee has standardSalary (specific to EmployeeWithRoles)
  const hasStandardSalary = 'standardSalary' in employee && employee.standardSalary && employee.standardSalary > 0;
  
  // Calculate difference and percentage using utility functions
  const difference = hasStandardSalary ? 
    calculateSalaryDifference(employee.salary, (employee as EmployeeWithRoles).standardSalary!) : 
    0;
  
  const percentageDiff = hasStandardSalary ? 
    calculateSalaryPercentage(employee.salary, (employee as EmployeeWithRoles).standardSalary!) : 
    0;
  
  const isPositive = difference > 0;

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
            {hasStandardSalary ? 
              formatSalary((employee as EmployeeWithRoles).standardSalary!) : 
              "Не определена"
            }
          </span>
        </div>
        {hasStandardSalary && (
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-gray-500">Разница:</span>
            <div className="flex items-center gap-2">
              <Badge className={isPositive ? "bg-green-500" : "bg-red-500"}>
                {isPositive ? "+" : ""}
                {formatSalary(difference)}
              </Badge>
              <Badge variant="outline" className={`${isPositive ? "text-green-500 border-green-500" : "text-red-500 border-red-500"}`}>
                {isPositive ? "+" : ""}
                {Math.abs(percentageDiff).toFixed(1)}%
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
