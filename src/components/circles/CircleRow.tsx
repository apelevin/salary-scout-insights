
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  onClick: (circleName: string) => void;
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
    <TableRow 
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(cleanCircleName)}
    >
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{cleanCircleName}</TableCell>
      <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
    </TableRow>
  );
};

export default CircleRow;
