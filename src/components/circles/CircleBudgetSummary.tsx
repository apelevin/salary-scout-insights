
import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatSalary } from "@/utils/formatUtils";

interface CircleBudgetSummaryProps {
  totalStandardBudget: number;
  totalCurrentBudget: number;
  budgetDifference: number;
  isPositiveDifference: boolean;
}

const CircleBudgetSummary: React.FC<CircleBudgetSummaryProps> = ({
  totalStandardBudget,
  totalCurrentBudget,
  budgetDifference,
  isPositiveDifference
}) => {
  return (
    <>
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Стандартный бюджет:</h3>
        <span className="font-medium">{formatSalary(totalStandardBudget)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Текущий бюджет:</h3>
        <span className="font-medium">{formatSalary(totalCurrentBudget)}</span>
      </div>
      
      {/* Budget difference */}
      <div className="flex justify-between mb-4 py-2 px-3 bg-muted rounded-md">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">Разница:</h3>
          {isPositiveDifference ? 
            <TrendingUp className="h-4 w-4 ml-2 text-green-500" /> : 
            <TrendingDown className="h-4 w-4 ml-2 text-red-500" />
          }
        </div>
        <span className={`font-medium ${isPositiveDifference ? 'text-green-600' : 'text-red-600'}`}>
          {isPositiveDifference ? '+' : ''}{formatSalary(budgetDifference)}
        </span>
      </div>
    </>
  );
};

export default CircleBudgetSummary;
