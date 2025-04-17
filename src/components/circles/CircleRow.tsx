
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType, formatSalary } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { CircleBudgetSummary } from "@/hooks/useCircleRoles";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  onCircleClick: (circleName: string) => void;
  budgetSummary?: CircleBudgetSummary;
}

const CircleRow = ({ 
  index, 
  circleName, 
  functionalType,
  onCircleClick,
  budgetSummary
}: CircleRowProps) => {
  // Очищаем название круга и функционального типа от кавычек
  const cleanCircleName = circleName.replace(/["']/g, '').trim();

  // Extract budget information
  const standardBudget = budgetSummary?.totalStandardIncome || 0;
  const currentBudget = budgetSummary?.totalActualIncome || 0;
  const percentageDifference = budgetSummary?.percentageDifference || 0;
  const isPositive = percentageDifference >= 0;

  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal text-blue-600 hover:underline hover:text-blue-800 justify-start"
          onClick={() => onCircleClick(cleanCircleName)}
        >
          {cleanCircleName}
        </Button>
      </TableCell>
      <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
      <TableCell>{formatSalary(standardBudget)}</TableCell>
      <TableCell>{formatSalary(currentBudget)}</TableCell>
      <TableCell className={isPositive ? 'text-green-600' : 'text-red-600'}>
        {isPositive ? '+' : ''}{percentageDifference}%
      </TableCell>
    </TableRow>
  );
};

export default CircleRow;
