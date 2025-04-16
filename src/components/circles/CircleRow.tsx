
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  onClick?: () => void;
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
          className="p-0 h-auto font-normal flex items-center gap-1 text-foreground hover:underline"
          onClick={onClick}
        >
          {cleanCircleName}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </TableCell>
      <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
    </TableRow>
  );
};

export default CircleRow;
