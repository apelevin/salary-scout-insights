
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";

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
        <button 
          onClick={onClick}
          className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
        >
          {cleanCircleName}
        </button>
      </TableCell>
      <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
    </TableRow>
  );
};

export default CircleRow;
