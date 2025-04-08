
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import EmployeeTable from "@/components/EmployeeTable";
import RolesTable from "@/components/RolesTable";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee, UploadedFile, RoleData } from "@/types";
import { parseCSV, parseRolesCSV } from "@/utils/csvParser";
import { toast } from "@/components/ui/use-toast";
import { BarChart, FileText, FileType } from "lucide-react";

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  const [customStandardSalaries, setCustomStandardSalaries] = useState<Map<string, number>>(new Map());

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleStandardSalaryChange = (roleName: string, newStandardSalary: number) => {
    setCustomStandardSalaries(prev => {
      const updated = new Map(prev);
      updated.set(roleName, newStandardSalary);
      return updated;
    });
  };

  const processFiles = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Нет загруженных файлов",
        description: "Пожалуйста, сначала загрузите CSV файлы с данными.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const allEmployees: Employee[] = [];
      const updatedFiles = [...uploadedFiles];
      let rolesList: RoleData[] = [];

      uploadedFiles.forEach((file, index) => {
        const possibleRoles = parseRolesCSV(file.content);
        
        if (possibleRoles.length > 0) {
          rolesList = [...rolesList, ...possibleRoles];
          updatedFiles[index].parsed = true;
          console.log(`Файл ${file.name} распознан как файл с ролями`);
          return;
        }
        
        const parsedEmployees = parseCSV(file.content);
        if (parsedEmployees.length === 0) {
          toast({
            title: "Ошибка парсинга файла",
            description: `Файл ${file.name} не содержит корректных данных о сотрудниках или ролях.`,
            variant: "destructive",
          });
          return;
        }
        
        const employeesWithIds = parsedEmployees.map((emp, i) => ({
          ...emp,
          id: emp.id || `${index}-${i}`,
        }));
        
        allEmployees.push(...employeesWithIds);
        updatedFiles[index].parsed = true;
      });

      setUploadedFiles(updatedFiles);
      setEmployees(allEmployees);
      setRolesData(rolesList);
      
      let successMessage = `Загружено ${allEmployees.length} сотрудников.`;
      if (rolesList.length > 0) {
        successMessage += ` Найдено ${rolesList.length} записей о ролях.`;
      }
      
      toast({
        title: "Данные успешно загружены",
        description: successMessage,
      });
    } catch (error) {
      console.error("Ошибка при обработке файлов:", error);
      toast({
        title: "Ошибка обработки файлов",
        description: "Произошла ошибка при обработке загруженных файлов.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Salary Scout Insights
              </h1>
            </div>
          </div>
          <p className="mt-2 text-gray-600">
            Анализ зарплат сотрудников компании
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileType className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Загрузка данных</h2>
                </div>
                <FileUpload onFilesUploaded={handleFilesUploaded} maxFiles={3} />
                <div className="mt-6">
                  <Button 
                    className="w-full" 
                    disabled={uploadedFiles.length === 0 || isProcessing}
                    onClick={processFiles}
                  >
                    {isProcessing ? "Обработка..." : "Обработать данные"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Инструкция</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    1. Загрузите до 3 файлов в формате CSV с данными о сотрудниках и ролях.
                  </p>
                  <p className="text-gray-600">
                    2. CSV файлы сотрудников должны содержать колонки "name" (имя) и "salary" (зарплата).
                  </p>
                  <p className="text-gray-600">
                    3. CSV файлы ролей должны содержать колонки "участник роли" и "название роли".
                  </p>
                  <p className="text-gray-600">
                    4. Нажмите "Обработать данные" для анализа загруженных файлов.
                  </p>
                  <p className="text-gray-600">
                    5. Вы можете редактировать стандартные оклады для ролей на соответствующей вкладке.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Данные</h2>
                </div>
                
                {/* Добавляем дашборд */}
                {employees.length > 0 && (
                  <Dashboard 
                    employees={employees} 
                    isLoading={isProcessing} 
                  />
                )}
                
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
                      isLoading={isProcessing} 
                      customStandardSalaries={customStandardSalaries}
                    />
                  </TabsContent>
                  <TabsContent value="roles">
                    <RolesTable
                      rolesData={rolesData}
                      employees={employees}
                      isLoading={isProcessing}
                      onStandardSalaryChange={handleStandardSalaryChange}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
