
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
              let roleContribution = 0;
              let baseSalary = 0;
              
              // For debugging
              console.log(`Calculating role contribution for ${role} with FTE ${fte}`);
              
              if (role.toLowerCase() === "лидер") {
                // For leader role, use the exact salary from leadership data
                if (employee.operationalCircleType && employee.operationalCircleCount) {
                  // For leadership roles, we get the base salary directly from leadership data
                  // The actual contribution is calculated by multiplying this base by the FTE
                  baseSalary = 450000; // This should come from leadership data (hardcoded for now for debugging)
                  roleContribution = baseSalary * fte;
                  
                  console.log(`Leader role: Base salary=${baseSalary}, FTE=${fte}, Contribution=${roleContribution}`);
                } else {
                  // Generic leader role without circle data
                  baseSalary = employee.standardSalary / employee.normalizedRolesFTE.size;
                  roleContribution = baseSalary * fte;
                }
              } else {
                // For non-leader roles, calculate based on standardSalary and FTE
                const roleProportion = fte / Array.from(employee.normalizedRolesFTE.values()).reduce((sum, val) => sum + val, 0);
                roleContribution = employee.standardSalary * roleProportion;
                baseSalary = roleContribution / fte;
              }
              
              return (
                <div key={index} className="border rounded-md p-3">
                  <h4 className="font-semibold text-sm mb-2">{role}</h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                    <span className="text-gray-500">Нормализованный FTE:</span>
                    <span className="text-right">{formatFTE(fte)}</span>
                    
                    {role.toLowerCase() === "лидер" && employee.operationalCircleType && (
                      <>
                        <span className="text-gray-500">Тип кругов:</span>
                        <span className="text-right">{employee.operationalCircleType}</span>
                        
                        <span className="text-gray-500">Количество кругов:</span>
                        <span className="text-right">{employee.operationalCircleCount}</span>
                        
                        <span className="text-gray-500">Базовый оклад по лидерству:</span>
                        <span className="text-right">{formatSalary(baseSalary)}</span>
                      </>
                    )}
                    
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
