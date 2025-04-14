
import React, { useState } from "react";
import { Table } from "@/components/ui/table";
import { CircleData, RoleData, Employee, EmployeeWithRoles } from "@/types";
import { processEmployeesWithRoles } from "@/utils/employee";
import CirclesTableHeader from "./CirclesTableHeader";
import CirclesTableBody from "./CirclesTableBody";
import CirclesTableLoading from "./CirclesTableLoading";
import CirclesTableEmpty from "./CirclesTableEmpty";
import CircleDetailSidebar from "./CircleDetailSidebar";
import { calculateCircleBudgets } from "./utils/circleCalculations";

interface CirclesTableProps {
  circlesData: CircleData[];
  rolesData: RoleData[];
  isLoading: boolean;
  employees?: Employee[];
  incognitoMode?: boolean;
}

const CirclesTable: React.FC<CirclesTableProps> = ({ 
  circlesData, 
  rolesData, 
  isLoading,
  employees = [],
  incognitoMode = false
}) => {
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (isLoading) {
    return <CirclesTableLoading />;
  }

  if (!circlesData || circlesData.length === 0) {
    return <CirclesTableEmpty />;
  }

  const employeesWithRoles: EmployeeWithRoles[] = employees.length > 0 
    ? processEmployeesWithRoles(employees, rolesData, new Map(), circlesData)
    : [];

  const { uniqueCircles, circleBudgets, currentSalaryBudgets } = calculateCircleBudgets(
    circlesData,
    rolesData,
    employeesWithRoles
  );

  const handleCircleClick = (circleName: string) => {
    setSelectedCircle(circleName);
    setIsSidebarOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <CirclesTableHeader />
          <CirclesTableBody 
            uniqueCircles={uniqueCircles}
            circleBudgets={circleBudgets}
            currentSalaryBudgets={currentSalaryBudgets}
            onCircleClick={handleCircleClick}
          />
        </Table>
      </div>

      <CircleDetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedCircle(null);
        }}
        circleName={selectedCircle}
        employees={employees}
        employeesWithRoles={employeesWithRoles}
        rolesData={rolesData}
        incognitoMode={incognitoMode}
      />
    </>
  );
};

export default CirclesTable;
