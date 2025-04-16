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

  const uniqueCircles = Array.from(
    new Map(circlesData.map(circle => [circle.name, circle])).values()
  ).sort((a, b) => a.name.localeCompare(b.name, "ru"));

  const handleCircleClick = (circle: CircleData) => {
    setSelectedCircle(circle);
    setSidebarOpen(true);
  };

  const getCircleEmployees = () => {
    if (!selectedCircle) return [];

    const circleRoles = rolesData
      .filter(role => role.circleName === selectedCircle.name);
    
    const employeeRolesMap = new Map();
    
    circleRoles.forEach(role => {
      const formattedName = formatName(role.participantName || "");
      const key = formattedName.toLowerCase();
      
      if (employeeRolesMap.has(key)) {
        const employee = employeeRolesMap.get(key);
        employee.fte += role.fte || 0;
        
        const cleanedRoleName = role.roleName.replace(/["']/g, '').trim();
        
        if (!employee.roles.includes(cleanedRoleName)) {
          employee.roles.push(cleanedRoleName);
        }
      } else {
        const cleanedRoleName = role.roleName.replace(/["']/g, '').trim();
        
        employeeRolesMap.set(key, {
          name: formattedName,
          fte: role.fte || 0,
          roles: [cleanedRoleName]
        });
      }
    });
    
    return Array.from(employeeRolesMap.values())
      .map(employee => ({
        name: employee.name,
        fte: employee.fte,
        role: employee.roles.join(", ") // Join multiple roles with comma
      }))
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
