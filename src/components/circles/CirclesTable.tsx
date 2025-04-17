
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, RoleData } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import CircleRolesSidebar from "@/components/circles/CircleRolesSidebar";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";

interface CirclesTableProps {
  circlesData: CircleData[];
  rolesData: RoleData[];
  isLoading?: boolean;
}

const CirclesTable = ({ 
  circlesData = [], 
  rolesData = [],
  isLoading = false
}: CirclesTableProps) => {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCircleClick = (circleName: string) => {
    setSelectedCircle(circleName);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedCircle(null);
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
                onCircleClick={handleCircleClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <CircleRolesSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        circleName={selectedCircle}
        rolesData={rolesData}
      />
    </div>
  );
};

export default CirclesTable;
