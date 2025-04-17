
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, Employee } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";
import CircleInfoSidebar from "./CircleInfoSidebar";

interface CirclesTableProps {
  circlesData: CircleData[];
  employees: Employee[];
  isLoading?: boolean;
}

const CirclesTable = ({ 
  circlesData = [], 
  employees = [],
  isLoading = false
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

  const handleCloseSidebar = () => {
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
                onCircleClick={handleCircleClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <CircleInfoSidebar
        circleName={selectedCircle}
        open={selectedCircle !== null}
        onClose={handleCloseSidebar}
        circlesData={circlesData}
        employees={employees}
      />
    </div>
  );
};

export default CirclesTable;
