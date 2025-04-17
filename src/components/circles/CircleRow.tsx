
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

  // Prefilter employees with this circle to check if we have any
  const hasEmployees = employees?.some(emp => 
    rolesData?.some(role => 
      ((role.circleName && role.circleName.toLowerCase() === cleanCircleName.toLowerCase()) ||
       (role.circle && role.circle.toLowerCase() === cleanCircleName.toLowerCase())) &&
      (role.participantName && emp.name && 
        (role.participantName.toLowerCase().includes(emp.name.toLowerCase()) || 
         emp.name.toLowerCase().includes(role.participantName.toLowerCase().split(' ')[0])))
    )
  );

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
            {hasEmployees && <span className="ml-2 text-xs text-green-600">(есть сотрудники)</span>}
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
