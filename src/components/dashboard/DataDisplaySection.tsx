
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee, RoleData, CircleData, LeadershipData } from "@/types";
import CirclesTable from "../circles/CirclesTable";
import EmployeeTable from "../employee-table/EmployeeTable";
import RolesList from "../roles/RolesList";
import LeadershipTable from "../leadership/LeadershipTable";
import { Map } from "@/types";

interface DataDisplaySectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employees: Employee[];
  rolesData: RoleData[];
  circlesData: CircleData[];
  leadershipData: LeadershipData[];
  isProcessing: boolean;
  customStandardSalaries: Map<string, number>;
  onStandardSalaryChange: (employeeName: string, newSalary: number) => void;
  incognitoMode: boolean;
}

const DataDisplaySection: React.FC<DataDisplaySectionProps> = ({
  activeTab,
  setActiveTab,
  employees,
  rolesData,
  circlesData,
  leadershipData,
  isProcessing,
  customStandardSalaries,
  onStandardSalaryChange,
  incognitoMode
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Сотрудники</TabsTrigger>
          <TabsTrigger value="roles">Роли</TabsTrigger>
          <TabsTrigger value="circles">Круги</TabsTrigger>
          <TabsTrigger value="leadership">Лидерство</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <EmployeeTable 
            employees={employees} 
            rolesData={rolesData} 
            customStandardSalaries={customStandardSalaries}
            onStandardSalaryChange={onStandardSalaryChange}
            isLoading={isProcessing}
            incognitoMode={incognitoMode}
          />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RolesList 
            rolesData={rolesData} 
            employees={employees}
            isLoading={isProcessing}
            incognitoMode={incognitoMode}
          />
        </TabsContent>

        <TabsContent value="circles" className="mt-6">
          <CirclesTable 
            circlesData={circlesData} 
            rolesData={rolesData} 
            employees={employees}
            isLoading={isProcessing}
            incognitoMode={incognitoMode}
          />
        </TabsContent>

        <TabsContent value="leadership" className="mt-6">
          <LeadershipTable 
            leadershipData={leadershipData} 
            isLoading={isProcessing}
            incognitoMode={incognitoMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataDisplaySection;
