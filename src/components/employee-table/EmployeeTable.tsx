
import { useState } from "react";
import { Table } from "@/components/ui/table";
import { Employee, RoleData, CircleData, LeadershipData, EmployeeWithRoles } from "@/types";
import EmployeeInfoSidebar from "../EmployeeInfoSidebar";
import EmployeeSearch from "../EmployeeSearch";
import { LoadingState, EmptyState } from "../EmployeeTableStates";
import DashboardSummaryCards from "../DashboardSummaryCards";
import EmployeeTableHeader from "./EmployeeTableHeader";
import EmployeeTableBody from "./EmployeeTableBody";
import { useEmployeeFilter } from "./useEmployeeFilter";
import { useSortableEmployees } from "./useSortableEmployees";

interface EmployeeTableProps {
  employees: Employee[];
  rolesData?: RoleData[];
  circlesData?: CircleData[];
  leadershipData?: LeadershipData[];
  isLoading?: boolean;
  customStandardSalaries?: Map<string, number>;
}

const EmployeeTable = ({ 
  employees, 
  rolesData = [], 
  circlesData = [],
  leadershipData = [], 
  isLoading = false,
  customStandardSalaries = new Map()
}: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | EmployeeWithRoles | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { filteredEmployees } = useEmployeeFilter(
    employees,
    rolesData,
    circlesData,
    customStandardSalaries,
    searchTerm,
    leadershipData
  );

  const { sortedEmployees, sortDirection, sortField, toggleSort } = 
    useSortableEmployees(filteredEmployees);

  const handleEmployeeClick = (employee: Employee | EmployeeWithRoles) => {
    setSelectedEmployee(employee);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (employees.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      <DashboardSummaryCards employees={sortedEmployees} />
      
      <EmployeeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="border rounded-md">
        <Table>
          <EmployeeTableHeader 
            sortField={sortField} 
            sortDirection={sortDirection} 
            toggleSort={toggleSort} 
          />
          <EmployeeTableBody 
            employees={sortedEmployees} 
            onEmployeeClick={handleEmployeeClick} 
          />
        </Table>
      </div>
      <div className="text-sm text-gray-500 mt-3">
        Всего сотрудников: {sortedEmployees.length}
      </div>

      <EmployeeInfoSidebar 
        employee={selectedEmployee} 
        open={sidebarOpen} 
        onClose={closeSidebar}
        leadershipData={leadershipData}
      />
    </div>
  );
};

export default EmployeeTable;
