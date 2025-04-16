
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
import { findStandardRateForRole } from "@/utils/salaryUtils";

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

    const circleRoles = rolesData
      .filter(role => role.circleName === selectedCircle.name);
    
    // Group roles by employee name
    const employeeRolesMap = new Map();
    
    circleRoles.forEach(role => {
      const formattedName = formatName(role.participantName || "");
      const key = formattedName.toLowerCase();
      
      if (employeeRolesMap.has(key)) {
        const employee = employeeRolesMap.get(key);
        employee.fte += role.fte || 0;
        
        // Store unique roles
        if (!employee.roles.includes(role.roleName)) {
          employee.roles.push(role.roleName);
        }

        // Store role data for standard salary calculation
        employee.roleData.push({
          roleName: role.roleName,
          fte: role.fte || 0
        });
      } else {
        employeeRolesMap.set(key, {
          name: formattedName,
          fte: role.fte || 0,
          roles: [role.roleName],
          roleData: [{
            roleName: role.roleName,
            fte: role.fte || 0
          }]
        });
      }
    });
    
    // Transform to array with combined roles and calculate standard salaries
    return Array.from(employeeRolesMap.values())
      .map(employee => {
        // Calculate standard salary for each role and multiply by FTE
        let totalStandardSalary = 0;
        if (employee.roleData && employee.roleData.length > 0) {
          employee.roleData.forEach(roleInfo => {
            // Using an empty array and map since we don't have actual employee data here
            // This is simplified just to get the standard rate
            const standardRate = findStandardRateForRole(
              roleInfo.roleName,
              rolesData,
              [], // employees array is empty as we don't need it for the circle sidebar
              new Map() // customStandardSalaries is empty as we don't need it for the circle sidebar
            );
            totalStandardSalary += standardRate * roleInfo.fte;
          });
        }

        return {
          name: employee.name,
          fte: employee.fte,
          role: employee.roles.join(", "), // Join multiple roles with comma
          standardSalary: totalStandardSalary
        };
      })
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
