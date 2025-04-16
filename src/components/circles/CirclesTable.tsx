
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, Employee, RoleData } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";
import CircleDetailsSidebar from "@/components/circles/CircleDetailsSidebar";
import { useState } from "react";

interface CirclesTableProps {
  circlesData: CircleData[];
  rolesData: RoleData[];
  employees: Employee[];
  isLoading?: boolean;
}

const CirclesTable = ({ 
  circlesData = [], 
  rolesData = [],
  employees = [],
  isLoading = false
}: CirclesTableProps) => {
  const [selectedCircle, setSelectedCircle] = useState<CircleData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleCircleClick = (circle: CircleData) => {
    setSelectedCircle(circle);
    setIsSidebarOpen(true);
  };
  
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  
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
                onClick={() => handleCircleClick(circle)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <CircleDetailsSidebar
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        circle={selectedCircle}
        rolesData={rolesData}
        employees={employees}
      />
    </div>
  );
};

export default CirclesTable;
