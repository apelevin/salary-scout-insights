
import { BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeTable from "@/components/employee-table/EmployeeTable";
import RolesTable from "@/components/RolesTable";
import { Employee, RoleData, CircleData } from "@/types";

interface DataDisplaySectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employees: Employee[];
  rolesData: RoleData[];
  circlesData: CircleData[];  // Added circlesData property
  isProcessing: boolean;
  customStandardSalaries: Map<string, number>;
  onStandardSalaryChange: (roleName: string, newStandardSalary: number) => void;
}

const DataDisplaySection = ({
  activeTab,
  setActiveTab,
  employees,
  rolesData,
  circlesData,
  isProcessing,
  customStandardSalaries,
  onStandardSalaryChange
}: DataDisplaySectionProps) => {
  return (
    <Card>
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
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="employees">Сотрудники</TabsTrigger>
            <TabsTrigger value="roles">Роли</TabsTrigger>
          </TabsList>
          <TabsContent value="employees">
            <EmployeeTable 
              employees={employees} 
              rolesData={rolesData}
              circlesData={circlesData}
              isLoading={isProcessing} 
              customStandardSalaries={customStandardSalaries}
            />
          </TabsContent>
          <TabsContent value="roles">
            <RolesTable
              rolesData={rolesData}
              employees={employees}
              isLoading={isProcessing}
              onStandardSalaryChange={onStandardSalaryChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataDisplaySection;
