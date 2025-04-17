
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee, LeadershipData, RoleData, CircleData } from "@/types";
import EmployeeTable from "@/components/employee-table/EmployeeTable";
import RolesTable from "@/components/roles/RolesTable";
import CirclesTable from "@/components/circles/CirclesTable"; 
import LeadershipTable from "@/components/leadership/LeadershipTable";
import EmployeeInfoSidebar from "@/components/EmployeeInfoSidebar";
import { filterEmployeesWithRoles } from "@/utils/employeeUtils";
import { useRolesData } from "@/hooks/useRolesData";

interface DataDisplaySectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employees: Employee[];
  rolesData: RoleData[];
  circlesData: CircleData[];
  leadershipData: LeadershipData[];
  isProcessing: boolean;
  customStandardSalaries?: Map<string, number>;
  onStandardSalaryChange: (roleName: string, value: number) => void;
  onLeadershipDataChange: (data: LeadershipData[]) => void;
  incognitoMode?: boolean;
  fullWidth?: boolean;
}

const DataDisplaySection = ({
  activeTab,
  setActiveTab,
  employees,
  rolesData,
  circlesData,
  leadershipData,
  isProcessing,
  customStandardSalaries,
  onStandardSalaryChange,
  onLeadershipDataChange,
  incognitoMode = false,
  fullWidth = false
}: DataDisplaySectionProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const employeesWithRoles = filterEmployeesWithRoles(employees, rolesData);
  const { roles } = useRolesData(rolesData, employees, customStandardSalaries);

  const handleOpenSidebar = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`bg-white rounded-lg border ${fullWidth ? 'w-full' : ''}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b w-full justify-start rounded-none p-0">
          <TabsTrigger 
            value="employees" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none px-6 py-3"
          >
            Сотрудники
          </TabsTrigger>
          <TabsTrigger 
            value="roles" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none px-6 py-3"
          >
            Роли
          </TabsTrigger>
          <TabsTrigger 
            value="circles" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none px-6 py-3"
          >
            Круги
          </TabsTrigger>
          <TabsTrigger 
            value="leadership" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none px-6 py-3"
          >
            Лидерство
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="p-4">
          <EmployeeTable 
            employees={employeesWithRoles} 
            isLoading={isProcessing}
            onEmployeeClick={handleOpenSidebar}
            incognitoMode={incognitoMode}
          />
        </TabsContent>

        <TabsContent value="roles" className="p-4">
          <RolesTable 
            rolesData={rolesData}
            isLoading={isProcessing}
            onStandardSalaryChange={onStandardSalaryChange}
            employees={employees}
            customStandardSalaries={customStandardSalaries}
          />
        </TabsContent>

        <TabsContent value="circles" className="p-4">
          <CirclesTable 
            circlesData={circlesData}
            isLoading={isProcessing}
          />
        </TabsContent>

        <TabsContent value="leadership" className="p-4">
          <LeadershipTable 
            leadershipData={leadershipData}
            isLoading={isProcessing}
            onLeadershipDataChange={onLeadershipDataChange}
          />
        </TabsContent>
      </Tabs>

      <EmployeeInfoSidebar 
        employee={selectedEmployee} 
        open={isSidebarOpen} 
        onClose={handleCloseSidebar}
        leadershipData={leadershipData}
        rolesData={rolesData}
        incognitoMode={incognitoMode}
      />
    </div>
  );
};

export default DataDisplaySection;
