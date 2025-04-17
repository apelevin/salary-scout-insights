
import { useState } from "react";
import { Employee, UploadedFile, RoleData, CircleData, LeadershipData } from "@/types";
import { parseCSV, parseRolesCSV, parseCirclesCSV } from "@/utils/csvParser";
import { parseLeadershipCSV } from "@/utils/leadershipParser";
import { toast } from "@/components/ui/use-toast";

interface UseFileParserParams {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setRolesData: (rolesData: RoleData[]) => void;
  setCirclesData: (circlesData: CircleData[]) => void;
  setLeadershipData: (leadershipData: LeadershipData[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useFileParser = ({
  uploadedFiles,
  setUploadedFiles,
  setEmployees,
  setRolesData,
  setCirclesData,
  setLeadershipData,
  setIsProcessing
}: UseFileParserParams) => {

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

      setUploadedFiles(updatedFiles);
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

  return { processFiles };
};
