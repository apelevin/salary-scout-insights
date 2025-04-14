
import React from "react";
import { TableBody } from "@/components/ui/table";
import { CircleData } from "@/types";
import CirclesTableRow from "./CirclesTableRow";
import { getBudgetDifference } from "./utils/circleCalculations";

interface CirclesTableBodyProps {
  uniqueCircles: CircleData[];
  circleBudgets: Map<string, number>;
  currentSalaryBudgets: Map<string, number>;
  onCircleClick: (circleName: string) => void;
}

const CirclesTableBody: React.FC<CirclesTableBodyProps> = ({
  uniqueCircles,
  circleBudgets,
  currentSalaryBudgets,
  onCircleClick
}) => {
  return (
    <TableBody>
      {uniqueCircles.map((circle, index) => {
        const standardBudget = circleBudgets.get(circle.name) || 0;
        const currentBudget = currentSalaryBudgets.get(circle.name) || 0;
        const budgetDifference = getBudgetDifference(standardBudget, currentBudget);
        
        return (
          <CirclesTableRow
            key={`${circle.name}-${index}`}
            circleName={circle.name}
            functionalType={circle.functionalType || ""}
            standardBudget={standardBudget}
            currentBudget={currentBudget}
            budgetDifferenceValue={budgetDifference.value}
            budgetDifferenceClass={budgetDifference.className}
            onCircleClick={onCircleClick}
          />
        );
      })}
    </TableBody>
  );
};

export default CirclesTableBody;
