
import { useState } from "react";
import { Employee, UploadedFile, RoleData, CircleData, LeadershipData } from "@/types";
import { parseCSV, parseRolesCSV, parseCirclesCSV } from "@/utils/csvParser";
import { toast } from "@/components/ui/use-toast";

export const useDataProcessing = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [circlesData, setCirclesData] = useState<CircleData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = (
    uploadedFiles: UploadedFile[], 
    updateUploadedFiles: (files: UploadedFile[]) => void,
    currentLeadershipData: LeadershipData[],
    setLeadershipData: (data: LeadershipData[]) => void
  ) => {
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
      let leadershipList: LeadershipData[] = [];

      uploadedFiles.forEach((file, index) => {
        // Проверяем, может ли файл быть файлом лидерства
        const fileName = file.name.toLowerCase();
        const firstLine = file.content.split('\n')[0].toLowerCase();
        
        if (
          fileName.includes('lead') || 
          fileName.includes('лидер') || 
          firstLine.includes('лидерство') || 
          firstLine.includes('leadership') ||
          firstLine.includes('lead') ||
          firstLine.includes('тип')
        ) {
          console.log(`Анализ возможного файла лидерства: ${file.name}`);
          const possibleLeadership = parseLeadershipCSV(file.content);
          
          if (possibleLeadership.length > 0) {
            leadershipList = [...leadershipList, ...possibleLeadership];
            updatedFiles[index].parsed = true;
            console.log(`Файл ${file.name} распознан как файл лидерства с ${possibleLeadership.length} записями`);
            return;
          }
        }
        
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

      updateUploadedFiles(updatedFiles);
      setEmployees(allEmployees);
      setRolesData(rolesList);
      setCirclesData(circlesList);
      
      // Обновляем leadershipData только если были найдены новые данные
      if (leadershipList.length > 0) {
        setLeadershipData(leadershipList);
      }
      
      let successMessage = `Загружено ${allEmployees.length} сотрудников.`;
      if (rolesList.length > 0) {
        successMessage += ` Найдено ${rolesList.length} записей о ролях.`;
      }
      if (circlesList.length > 0) {
        successMessage += ` Найдено ${circlesList.length} записей о кругах.`;
      }
      if (leadershipList.length > 0) {
        successMessage += ` Найдено ${leadershipList.length} записей о лидерстве.`;
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
    employees,
    rolesData,
    circlesData,
    isProcessing,
    processFiles
  };
};
