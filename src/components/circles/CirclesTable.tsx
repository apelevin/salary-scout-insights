
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CircleData, RoleData } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";
import CircleInfoSidebar from "./CircleInfoSidebar";
import { formatName } from "@/utils/employeeUtils";

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
  const [selectedCircle, setSelectedCircle] = useState<CircleData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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

  const handleCircleClick = (circle: CircleData) => {
    setSelectedCircle(circle);
    setSidebarOpen(true);
  };

  // Get employees for the selected circle
  const getCircleEmployees = () => {
    if (!selectedCircle) return [];

    const circleEmployees = rolesData
      .filter(role => role.circleName === selectedCircle.name)
      .map(role => ({
        name: formatName(role.participantName || ""),
        fte: role.fte || 0
      }));

    // Remove duplicates by name and sum up FTE values
    const employeeMap = new Map();
    circleEmployees.forEach(emp => {
      const key = emp.name.toLowerCase();
      if (employeeMap.has(key)) {
        employeeMap.set(key, {
          name: emp.name,
          fte: employeeMap.get(key).fte + emp.fte
        });
      } else {
        employeeMap.set(key, emp);
      }
    });

    return Array.from(employeeMap.values())
      .sort((a, b) => a.name.localeCompare(b.name, "ru"));
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
                onClick={() => handleCircleClick(circle)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <CircleInfoSidebar 
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        circle={selectedCircle}
        employees={getCircleEmployees()}
      />
    </div>
  );
};

export default CirclesTable;
