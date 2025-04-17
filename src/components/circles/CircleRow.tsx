
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";
import { useState } from "react";
import CircleMembersDrawer from "./CircleMembersDrawer";

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
  const [showMembers, setShowMembers] = useState(false);
  
  // Очищаем название круга и функционального типа от кавычек
  const cleanCircleName = circleName.replace(/["']/g, '').trim();

  const handleCircleClick = () => {
    setShowMembers(true);
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>
          <button 
            onClick={handleCircleClick}
            className="text-indigo-600 hover:underline text-left"
          >
            {cleanCircleName}
          </button>
        </TableCell>
        <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
      </TableRow>
      
      <CircleMembersDrawer
        circleName={cleanCircleName}
        open={showMembers}
        onClose={() => setShowMembers(false)}
      />
    </>
  );
};

export default CircleRow;
