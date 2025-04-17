
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";
import { useState } from "react";
import { CircleData } from "@/types";
import CircleDetailSidebar from "./CircleDetailSidebar";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  circleData?: CircleData;
  employees?: any[];
  rolesData?: any[];
}

const CircleRow = ({ 
  index, 
  circleName, 
  functionalType,
  circleData,
  employees,
  rolesData
}: CircleRowProps) => {
  const [showSidebar, setShowSidebar] = useState(false);
  // Очищаем название круга и функционального типа от кавычек
  const cleanCircleName = circleName.replace(/["']/g, '').trim();

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>
          <button 
            onClick={() => setShowSidebar(true)}
            className="text-left hover:text-blue-600 hover:underline transition-colors"
          >
            {cleanCircleName}
          </button>
        </TableCell>
        <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
      </TableRow>
      
      <CircleDetailSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        circleName={cleanCircleName}
        functionalType={cleanFunctionalType(functionalType)}
        circleData={circleData}
        employees={employees}
        rolesData={rolesData}
      />
    </>
  );
};

export default CircleRow;
