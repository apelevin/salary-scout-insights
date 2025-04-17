
import { useState, useMemo } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, RoleData, Employee } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import CircleRolesSidebar from "@/components/circles/CircleRolesSidebar";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";
import { CircleBudgetSummary } from "@/hooks/useCircleRoles";

interface CirclesTableProps {
  circlesData: CircleData[];
  rolesData: RoleData[];
  isLoading?: boolean;
  employees?: Employee[];
}

// Utility function to calculate budget summary, moved outside the component
const calculateCircleBudget = (
  circleName: string,
  rolesData: RoleData[],
  employees: Employee[]
): CircleBudgetSummary => {
  // Filter circle roles
  const circleRoles = rolesData.filter(role => {
    if (!role.circleName) return false;
    const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
    return normalizedCircleName === circleName;
  });
  
  let totalStandardIncome = 0;
  let totalActualIncome = 0;
  
  // Process each role in the circle
  circleRoles.forEach(role => {
    if (!role.roleName || !role.participantName || !role.fte) return;
    
    // Find employee
    const employeeName = role.participantName.replace(/["']/g, '').trim();
    const employee = employees.find(e => 
      e.name.replace(/["']/g, '').trim().toLowerCase() === employeeName.toLowerCase()
    );
    
    // Get employee's role FTE and salary
    const fte = role.fte || 0;
    
    // Find standard salary for this role from the employee's roles
    const standardSalary = employee?.standardSalary || 0;
    
    // Add to totals
    const standardIncome = fte * standardSalary;
    totalStandardIncome += standardIncome;
    
    // Add actual income
    if (employee) {
      totalActualIncome += (employee.salary || 0) * fte;
    }
  });
  
  // Calculate percentage difference
  const percentageDifference = totalStandardIncome === 0 ? 0 : 
    Math.round(((totalActualIncome - totalStandardIncome) / totalStandardIncome) * 10000) / 100;
  
  return { 
    totalStandardIncome, 
    totalActualIncome, 
    percentageDifference 
  };
};

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
  
  // Pre-calculate budget information for all circles once
  const circleBudgets = useMemo(() => {
    const budgets = new Map<string, CircleBudgetSummary>();
    
    // Remove duplicates and get unique circles
    const uniqueCircleNames = new Set<string>();
    circlesData.forEach(circle => {
      const cleanName = circle.name.replace(/["']/g, '').trim();
      uniqueCircleNames.add(cleanName);
    });
    
    // Calculate budget for each circle
    uniqueCircleNames.forEach(circleName => {
      const budget = calculateCircleBudget(circleName, rolesData, employees);
      budgets.set(circleName, budget);
    });
    
    return budgets;
  }, [circlesData, rolesData, employees]);
  
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
