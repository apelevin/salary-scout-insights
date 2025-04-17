
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";
import CircleEmployeesList from "./CircleEmployeesList";
import { RoleData } from "@/types";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  rolesData: RoleData[];
}

const CircleRow = ({ 
  index, 
  circleName, 
  functionalType,
  rolesData
}: CircleRowProps) => {
  // Очищаем название круга и функционального типа от кавычек
  const cleanCircleName = circleName.replace(/["']/g, '').trim();

  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{cleanCircleName}</div>
          <CircleEmployeesList 
            circleName={cleanCircleName} 
            rolesData={rolesData} 
          />
        </div>
      </TableCell>
      <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
    </TableRow>
  );
};

export default CircleRow;
