
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  onCircleClick: (circleName: string) => void;
}

const CircleRow = ({ 
  index, 
  circleName, 
  functionalType,
  onCircleClick
}: CircleRowProps) => {
  // Очищаем название круга и функционального типа от кавычек
  const cleanCircleName = circleName.replace(/["']/g, '').trim();

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
    </TableRow>
  );
};

export default CircleRow;
