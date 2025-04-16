
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  onClick: () => void;
}

const CircleRow = ({ 
  index, 
  circleName, 
  functionalType,
  onClick
}: CircleRowProps) => {
  // Очищаем название круга и функционального типа от кавычек
  const cleanCircleName = circleName.replace(/["']/g, '').trim();

  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>
        <Button 
          variant="link" 
          className="p-0 h-auto text-left font-normal text-foreground hover:text-primary"
          onClick={onClick}
        >
          {cleanCircleName}
        </Button>
      </TableCell>
      <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
    </TableRow>
  );
};

export default CircleRow;
