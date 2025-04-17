
import { useMemo, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, RoleData, Employee } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import CircleRolesSidebar from "@/components/circles/CircleRolesSidebar";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";
import { useCircleRoles } from "@/hooks/useCircleRoles";

interface CirclesTableProps {
  circlesData: CircleData[];
  rolesData: RoleData[];
  isLoading?: boolean;
  employees?: Employee[];
}

const CirclesTable = ({ 
  circlesData = [], 
  rolesData = [],
  isLoading = false,
  employees = []
}: CirclesTableProps) => {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Remove duplicates and sort circles by name
  const uniqueCircles = useMemo(() => {
    return Array.from(
      new Map(circlesData.map(circle => [circle.name, circle])).values()
    ).sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }, [circlesData]);
  
  // Pre-calculate all budgets in a single useMemo to avoid recalculations
  const circleBudgets = useMemo(() => {
    const budgetsMap = new Map();
    
    // Calculate budget summaries for all circles at once
    uniqueCircles.forEach(circle => {
      const circleName = circle.name.replace(/["']/g, '').trim();
      const { budgetSummary } = useCircleRoles(circleName, rolesData, employees);
      budgetsMap.set(circleName, budgetSummary);
    });
    
    return budgetsMap;
  }, [uniqueCircles, rolesData, employees]);

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

  return (
    <div className="w-full">
      <CirclesTableActions circlesCount={uniqueCircles.length} />
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <CirclesTableHeader />
          <TableBody>
            {uniqueCircles.map((circle, index) => {
              const circleName = circle.name.replace(/["']/g, '').trim();
              const budgetSummary = circleBudgets.get(circleName);
              
              return (
                <CircleRow
                  key={circle.name}
                  index={index}
                  circleName={circle.name}
                  functionalType={circle.functionalType}
                  onCircleClick={handleCircleClick}
                  budgetSummary={budgetSummary}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      <CircleRolesSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        circleName={selectedCircle}
        rolesData={rolesData}
        employees={employees}
      />
    </div>
  );
};

export default CirclesTable;
