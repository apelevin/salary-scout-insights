
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { EmployeeWithRoles } from "@/types";
import { formatSalary, formatFTE } from "@/utils/formatUtils";

interface SalaryCalculationProps {
  employee: EmployeeWithRoles;
}

export const SalaryCalculation = ({ employee }: SalaryCalculationProps) => {
  if (!employee.standardSalary || employee.standardSalary <= 0) {
    return null;
  }

  return (
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
              {employee.operationalCircleType && (
                <li>Для роли лидера используется таблица лидерства (<strong>{employee.operationalCircleType}</strong>, <strong>{employee.operationalCircleCount} кругов</strong>)</li>
              )}
            </ul>
          </div>
          
          <div className="space-y-3">
            {Array.from(employee.normalizedRolesFTE.entries()).map(([role, fte], index) => {
              // For leader role, get the right standard salary based on leadership data
              let roleContribution = 0;
              
              // For debugging
              console.log(`Calculating role contribution for ${role} with FTE ${fte}`);
              
              if (role.toLowerCase() === "лидер" && employee.operationalCircleType && employee.operationalCircleCount) {
                const baseLeaderSalary = employee.standardSalary / fte; // Calculate base leader salary from total
                roleContribution = fte * baseLeaderSalary;
                console.log(`Leader role: Base salary=${baseLeaderSalary}, FTE=${fte}, Contribution=${roleContribution}`);
              } else {
                roleContribution = employee.standardSalary * fte;
              }
              
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
  );
};
