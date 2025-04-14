
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
}

const CircleRow = ({ 
  index, 
  circleName, 
  functionalType 
}: CircleRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{circleName}</TableCell>
      <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
    </TableRow>
  );
};

export default CircleRow;
