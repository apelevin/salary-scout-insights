
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { formatSalary } from "@/utils/formatUtils";

interface CirclesTableRowProps {
  circleName: string;
  functionalType: string;
  standardBudget: number;
  currentBudget: number;
  budgetDifferenceValue: number;
  budgetDifferenceClass: string;
  onCircleClick: (circleName: string) => void;
}

const CirclesTableRow: React.FC<CirclesTableRowProps> = ({
  circleName,
  functionalType,
  standardBudget,
  currentBudget,
  budgetDifferenceValue,
  budgetDifferenceClass,
  onCircleClick
}) => {
  // Display "n/a" if functional type is empty
  const displayFunctionalType = functionalType && functionalType.trim() !== "" 
    ? functionalType 
    : "n/a";
  
  return (
    <TableRow>
      <TableCell>
        <button 
          onClick={() => onCircleClick(circleName)} 
          className="font-medium flex items-center text-blue-600 hover:text-blue-800 hover:underline"
        >
          {circleName}
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </TableCell>
      <TableCell>
        <span className="text-blue-600">{displayFunctionalType}</span>
      </TableCell>
      <TableCell className="text-right">
        {standardBudget > 0 ? formatSalary(standardBudget) : "—"}
      </TableCell>
      <TableCell className="text-right">
        {currentBudget > 0 ? formatSalary(currentBudget) : "—"}
      </TableCell>
      <TableCell className={`text-right ${budgetDifferenceClass}`}>
        {budgetDifferenceValue !== 0 
          ? formatSalary(budgetDifferenceValue) 
          : "—"}
      </TableCell>
    </TableRow>
  );
};

export default CirclesTableRow;
