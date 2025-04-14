
import { formatSalary } from "@/utils/formatUtils";

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
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Стандартный оклад:</h3>
        <span className="font-medium">{formatSalary(standardSalary)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Текущая стоимость роли:</h3>
        <span className="font-medium">{formatSalary(totalRoleCost)}</span>
      </div>
      
      {/* Budget difference */}
      {standardSalary > 0 && (
        <div className="flex justify-between mb-4 py-2 px-3 bg-muted rounded-md">
          <h3 className="text-sm font-medium">Среднее по сотрудникам:</h3>
          <span className="font-medium">
            {formatSalary(employeeCount > 0 ? totalRoleCost / employeeCount : 0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RoleBudgetSummary;
