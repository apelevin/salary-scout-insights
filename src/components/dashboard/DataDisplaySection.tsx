
import { BarChart, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeTable from "@/components/employee-table/EmployeeTable";
import RolesTable from "@/components/roles/RolesTable";
import LeadershipTable from "@/components/leadership/LeadershipTable";
import CirclesTable from "@/components/circles/CirclesTable";
import VariablesTable from "@/components/variables/VariablesTable";
import { Employee, RoleData, CircleData, LeadershipData } from "@/types";

interface DataDisplaySectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employees: Employee[];
  rolesData: RoleData[];
  circlesData: CircleData[];
  leadershipData: LeadershipData[];
  isProcessing: boolean;
  customStandardSalaries: Map<string, number>;
  onStandardSalaryChange: (roleName: string, newStandardSalary: number) => void;
  onLeadershipDataChange?: (updatedData: LeadershipData[]) => void;
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
  return (
    <Card className={fullWidth ? "w-full" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-foreground">Данные</h2>
        </div>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="employees">Сотрудники</TabsTrigger>
            <TabsTrigger value="roles">Роли</TabsTrigger>
            <TabsTrigger value="circles">Круги</TabsTrigger>
            <TabsTrigger value="leadership">Лидерство</TabsTrigger>
            <TabsTrigger value="variables"><Code className="h-4 w-4 mr-2" />Переменные</TabsTrigger>
          </TabsList>
          <TabsContent value="employees" className="w-full">
            <EmployeeTable 
              employees={employees} 
              rolesData={rolesData}
              circlesData={circlesData}
              leadershipData={leadershipData}
              isLoading={isProcessing} 
              customStandardSalaries={customStandardSalaries}
              incognitoMode={incognitoMode}
            />
          </TabsContent>
          <TabsContent value="roles" className="w-full">
            <RolesTable
              rolesData={rolesData}
              employees={employees}
              isLoading={isProcessing}
              onStandardSalaryChange={onStandardSalaryChange}
              customStandardSalaries={customStandardSalaries}
              incognitoMode={incognitoMode}
            />
          </TabsContent>
          <TabsContent value="circles" className="w-full">
            <CirclesTable
              circlesData={circlesData}
              isLoading={isProcessing}
            />
          </TabsContent>
          <TabsContent value="leadership" className="w-full">
            <LeadershipTable 
              leadershipData={leadershipData}
              isLoading={isProcessing}
              onLeadershipDataChange={onLeadershipDataChange}
            />
          </TabsContent>
          <TabsContent value="variables" className="w-full">
            <VariablesTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataDisplaySection;
