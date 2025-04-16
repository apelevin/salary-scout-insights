
import { useState, useEffect } from "react";
import { Employee, RoleData, CircleData, UploadedFile } from "@/types";
import { useFileUpload } from "./useFileUpload";
import { useLeadershipData } from "./useLeadershipData";
import { useStandardSalary } from "./useStandardSalary";
import { useFileParser } from "./useFileParser";
import { useSupabaseData } from "./useSupabaseData";
import { toast } from "@/components/ui/use-toast";

export const useFileProcessing = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [circlesData, setCirclesData] = useState<CircleData[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { 
    uploadedFiles, 
    isProcessing, 
    setIsProcessing, 
    handleFilesUploaded, 
    setUploadedFiles, 
    markFileAsParsed 
  } = useFileUpload();

  const { 
    leadershipData, 
    setLeadershipData, 
    handleLeadershipFileUpload,
    handleLeadershipDataChange
  } = useLeadershipData(markFileAsParsed, setIsProcessing);

  const { 
    customStandardSalaries, 
    handleStandardSalaryChange,
    setStandardSalaries
  } = useStandardSalary();

  const { processFiles } = useFileParser({
    uploadedFiles,
    setUploadedFiles,
    setEmployees,
    setRolesData,
    setCirclesData,
    setLeadershipData,
    setIsProcessing
  });

  const {
    isLoading: isDbLoading,
    saveEmployees,
    saveCircles,
    saveRoles,
    saveEmployeeRoles,
    saveEmployeeCircles,
    fetchEmployees,
    fetchRolesData,
    fetchCirclesData,
    fetchStandardSalaries,
    updateStandardSalary
  } = useSupabaseData();

  // При первом рендере загружаем данные из базы
  useEffect(() => {
    const loadDataFromDb = async () => {
      setIsProcessing(true);
      
      try {
        // Загружаем данные из базы
        const [employeesData, rolesData, circlesData, standardSalaries] = await Promise.all([
          fetchEmployees(),
          fetchRolesData(),
          fetchCirclesData(),
          fetchStandardSalaries()
        ]);
        
        setEmployees(employeesData);
        setRolesData(rolesData);
        setCirclesData(circlesData);
        setStandardSalaries(standardSalaries);
        
        if (employeesData.length > 0 || rolesData.length > 0 || circlesData.length > 0) {
          setDataLoaded(true);
          console.log("Данные загружены из базы данных");
          toast({
            title: "Данные загружены",
            description: `Загружено ${employeesData.length} сотрудников, ${rolesData.length} записей о ролях и ${circlesData.length} кругов.`,
          });
        } else {
          console.log("В базе данных нет данных");
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных из базы:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    loadDataFromDb();
  }, []);

  // Обработчик для сохранения данных в базу
  const saveDataToDb = async () => {
    setIsProcessing(true);
    
    try {
      // Сохраняем данные в базу последовательно
      await saveEmployees(employees);
      await saveCircles(circlesData);
      await saveRoles(rolesData, customStandardSalaries);
      await saveEmployeeRoles(rolesData);
      await saveEmployeeCircles(rolesData, circlesData);
      
      toast({
        title: "Данные сохранены",
        description: "Все данные успешно сохранены в базе данных.",
      });
      
      // Обновляем флаг, что данные загружены
      setDataLoaded(true);
    } catch (error) {
      console.error("Ошибка при сохранении данных в базу:", error);
      toast({
        title: "Ошибка сохранения",
        description: `Произошла ошибка при сохранении данных: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Обновляем обработчик для обработки файлов
  const handleProcessFiles = async () => {
    // Сначала обрабатываем файлы
    processFiles();
    
    // Затем автоматически сохраняем данные в базу
    setTimeout(() => {
      if (employees.length > 0 || rolesData.length > 0 || circlesData.length > 0) {
        saveDataToDb();
      }
    }, 1000);
  };

  // Обновляем обработчик для изменения стандартных окладов
  const handleStandardSalaryUpdate = async (roleName: string, newSalary: number) => {
    // Обновляем локальное состояние
    handleStandardSalaryChange(roleName, newSalary);
    
    // Сохраняем в базу данных
    await updateStandardSalary(roleName, newSalary);
  };

  return {
    uploadedFiles,
    employees,
    rolesData,
    circlesData,
    leadershipData,
    isProcessing: isProcessing || isDbLoading,
    customStandardSalaries,
    dataLoaded,
    handleFilesUploaded,
    handleStandardSalaryChange: handleStandardSalaryUpdate,
    handleLeadershipFileUpload,
    handleLeadershipDataChange,
    processFiles: handleProcessFiles,
    saveDataToDb
  };
};
