
import { useState, useMemo } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, RoleData, Employee } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import CircleRolesSidebar from "@/components/circles/CircleRolesSidebar";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";
import { useCircleRoles, CircleBudgetSummary } from "@/hooks/useCircleRoles";

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

  // Предварительно вычисляем бюджетную информацию для всех кругов за один проход
  // это намного эффективнее, чем вызывать useCircleRoles для каждого круга
  const circleBudgets = useMemo(() => {
    const budgets = new Map<string, CircleBudgetSummary>();
    
    // Проходим по всем ролям один раз и группируем их по кругам
    const rolesByCircle = new Map<string, RoleData[]>();
    
    rolesData.forEach(role => {
      if (!role.circleName) return;
      
      const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
      
      if (!rolesByCircle.has(normalizedCircleName)) {
        rolesByCircle.set(normalizedCircleName, []);
      }
      
      rolesByCircle.get(normalizedCircleName)?.push(role);
    });
    
    // Для каждого круга вычисляем бюджет
    rolesByCircle.forEach((circleRoles, circleName) => {
      const { budgetSummary } = useCircleRoles(circleName, circleRoles, employees);
      budgets.set(circleName, budgetSummary);
    });
    
    return budgets;
  }, [rolesData, employees]);

  return (
    <div className="w-full">
      <CirclesTableActions circlesCount={uniqueCircles.length} />
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <CirclesTableHeader />
          <TableBody>
            {uniqueCircles.map((circle, index) => {
              const cleanCircleName = circle.name.replace(/["']/g, '').trim();
              const budgetSummary = circleBudgets.get(cleanCircleName);
              
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
