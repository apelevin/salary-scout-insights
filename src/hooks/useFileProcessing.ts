
import { useState } from "react";
import { Employee, UploadedFile, RoleData, CircleData, LeadershipData } from "@/types";
import { parseCSV, parseRolesCSV, parseCirclesCSV } from "@/utils/csvParser";
import { parseLeadershipCSV } from "@/utils/leadershipParser";
import { toast } from "@/components/ui/use-toast";
import { processEmployeesWithRoles } from "@/utils/employeeUtils";

export const useFileProcessing = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [circlesData, setCirclesData] = useState<CircleData[]>([]);
  const [leadershipData, setLeadershipData] = useState<LeadershipData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
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
    
    // Recalculate employee standard salaries when role standard salary changes
    if (employees.length > 0 && rolesData.length > 0) {
      const updatedEmployees = processEmployeesWithRoles(
        employees, 
        rolesData, 
        new Map(customStandardSalaries).set(roleName, newStandardSalary),
        circlesData,
        leadershipData
      );
      setEmployees(updatedEmployees);
    }
  };
  
  const handleLeadershipDataChange = (updatedData: LeadershipData[]) => {
    setLeadershipData(updatedData);
    
    // Recalculate employee standard salaries when leadership data changes
    if (employees.length > 0 && rolesData.length > 0) {
      const updatedEmployees = processEmployeesWithRoles(
        employees,
        rolesData,
        customStandardSalaries,
        circlesData,
        updatedData
      );
      setEmployees(updatedEmployees);
    }
  };

  const handleLeadershipFileUpload = (file: UploadedFile) => {
    setIsProcessing(true);
    
    try {
      const parsedLeadership = parseLeadershipCSV(file.content);
      
      if (parsedLeadership.length > 0) {
        setLeadershipData(parsedLeadership);
        
        // Recalculate employee standard salaries with the new leadership data
        if (employees.length > 0 && rolesData.length > 0) {
          const updatedEmployees = processEmployeesWithRoles(
            employees,
            rolesData,
            customStandardSalaries,
            circlesData,
            parsedLeadership
          );
          setEmployees(updatedEmployees);
        }
        
        toast({
          title: "Файл лидерства загружен",
          description: `Загружено ${parsedLeadership.length} записей о стандартных зарплатах ролей.`,
        });
      } else {
        toast({
          title: "Ошибка парсинга файла",
          description: "Файл не содержит корректных данных о лидерстве.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при обработке файла лидерства:", error);
      toast({
        title: "Ошибка обработки файла",
        description: "Произошла ошибка при обработке загруженного файла лидерства.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
      let circlesList: CircleData[] = [];

      uploadedFiles.forEach((file, index) => {
        const possibleRoles = parseRolesCSV(file.content);
        
        if (possibleRoles.length > 0) {
          rolesList = [...rolesList, ...possibleRoles];
          updatedFiles[index].parsed = true;
          console.log(`Файл ${file.name} распознан как файл с ролями`);
          return;
        }
        
        const possibleCircles = parseCirclesCSV(file.content);
        
        if (possibleCircles.length > 0) {
          circlesList = [...circlesList, ...possibleCircles];
          updatedFiles[index].parsed = true;
          console.log(`Файл ${file.name} распознан как файл с кругами`);
          return;
        }
        
        const parsedEmployees = parseCSV(file.content);
        if (parsedEmployees.length === 0) {
          toast({
            title: "Ошибка парсинга файла",
            description: `Файл ${file.name} не содержит корректных данных о сотрудниках, ролях или кругах.`,
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
      setRolesData(rolesList);
      setCirclesData(circlesList);
      
      // Process employees with roles and calculate standard salaries
      if (allEmployees.length > 0) {
        const processedEmployees = processEmployeesWithRoles(
          allEmployees,
          rolesList,
          customStandardSalaries,
          circlesList,
          leadershipData
        );
        setEmployees(processedEmployees);
      } else {
        setEmployees(allEmployees);
      }
      
      let successMessage = `Загружено ${allEmployees.length} сотрудников.`;
      if (rolesList.length > 0) {
        successMessage += ` Найдено ${rolesList.length} записей о ролях.`;
      }
      if (circlesList.length > 0) {
        successMessage += ` Найдено ${circlesList.length} записей о кругах.`;
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

  return {
    uploadedFiles,
    employees,
    rolesData,
    circlesData,
    leadershipData,
    isProcessing,
    customStandardSalaries,
    handleFilesUploaded,
    handleStandardSalaryChange,
    handleLeadershipDataChange,
    handleLeadershipFileUpload,
    processFiles
  };
};
