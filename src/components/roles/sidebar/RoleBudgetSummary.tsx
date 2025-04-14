
import { formatSalary } from "@/utils/formatUtils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface RoleBudgetSummaryProps {
  standardSalary: number;
  totalRoleCost: number;
  employeeCount: number;
  incognitoMode?: boolean;
}

const RoleBudgetSummary = ({
  standardSalary,
  totalRoleCost,
  employeeCount,
  incognitoMode = false
}: RoleBudgetSummaryProps) => {
  // Calculate average salary per employee
  const averageSalary = employeeCount > 0 ? totalRoleCost / employeeCount : 0;
  
  // Calculate difference between standard salary and average
  const difference = standardSalary > 0 ? averageSalary - standardSalary : 0;
  const percentDifference = standardSalary > 0 
    ? Math.abs(difference) / standardSalary * 100 
    : 0;
  
  // Determine if average is higher or lower than standard
  const isHigher = difference > 0;
  const isDifferent = Math.abs(difference) > 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Текущая стоимость роли:</h3>
        <span className="font-medium">{formatSalary(totalRoleCost)}</span>
      </div>
      
      {/* Budget difference */}
      {standardSalary > 0 && (
        <div className={`flex justify-between mb-4 py-2 px-3 rounded-md ${isDifferent ? (isHigher ? 'bg-red-50' : 'bg-green-50') : 'bg-muted'}`}>
          <div className="flex items-center">
            <h3 className="text-sm font-medium">Среднее по сотрудникам:</h3>
            {isDifferent && (
              <span className={`ml-2 ${isHigher ? 'text-red-500' : 'text-green-500'}`}>
                {isHigher ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="font-medium">
              {formatSalary(averageSalary)}
            </span>
            {isDifferent && !incognitoMode && (
              <span className={`ml-2 text-xs ${isHigher ? 'text-red-500' : 'text-green-500'}`}>
                {percentDifference.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleBudgetSummary;
