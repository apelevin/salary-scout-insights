
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, Employee, RoleData } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";
import { useState } from "react";
import CircleDetailsSidebar from "./CircleDetailsSidebar";

interface CirclesTableProps {
  circlesData: CircleData[];
  isLoading?: boolean;
  employees?: Employee[];
  rolesData?: RoleData[];
}

const CirclesTable = ({ 
  circlesData = [], 
  isLoading = false,
  employees = [],
  rolesData = []
}: CirclesTableProps) => {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  
  if (isLoading) {
    return <LoadingState>Загрузка кругов...</LoadingState>;
  }

  if (circlesData.length === 0) {
    return <EmptyState 
      icon="CircleOff" 
      title="Нет доступных кругов" 
      description="Загрузите файл с данными о кругах, чтобы увидеть информацию."
    />;
  }

  // Remove duplicates and sort circles by name
  const uniqueCircles = Array.from(
    new Map(circlesData.map(circle => [circle.name, circle])).values()
  ).sort((a, b) => a.name.localeCompare(b.name, "ru"));

  const handleCircleClick = (circleName: string) => {
    setSelectedCircle(circleName);
  };

  const handleClosePanel = () => {
    setSelectedCircle(null);
  };

  return (
    <div className="w-full">
      <CirclesTableActions circlesCount={uniqueCircles.length} />
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <CirclesTableHeader />
          <TableBody>
            {uniqueCircles.map((circle, index) => (
              <CircleRow
                key={circle.name}
                index={index}
                circleName={circle.name}
                functionalType={circle.functionalType}
                onClick={handleCircleClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedCircle && (
        <CircleDetailsSidebar
          circleName={selectedCircle}
          open={!!selectedCircle}
          onClose={handleClosePanel}
          employees={employees}
          rolesData={rolesData}
        />
      )}
    </div>
  );
};

export default CirclesTable;
