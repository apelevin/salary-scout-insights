
import { useState } from "react";
import { Employee, UploadedFile, RoleData, CircleData, LeadershipData } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useFileUploads } from "./useFileUploads";
import { useEmployeeProcessing } from "./useEmployeeProcessing";
import { useRoleManagement } from "./useRoleManagement";
import { useLeadershipData } from "./useLeadershipData";

export const useFileProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    uploadedFiles, 
    handleFilesUploaded,
    setUploadedFiles
  } = useFileUploads();
  
  const {
    employees,
    setEmployees,
    processEmployeeData
  } = useEmployeeProcessing();
  
  const {
    rolesData,
    setRolesData,
    circlesData,
    setCirclesData,
    customStandardSalaries,
    handleStandardSalaryChange
  } = useRoleManagement({
    employees,
    setEmployees
  });
  
  const {
    leadershipData,
    handleLeadershipDataChange,
    handleLeadershipFileUpload
  } = useLeadershipData({
    employees,
    rolesData,
    customStandardSalaries,
    circlesData,
    setEmployees
  });

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
      const { 
        updatedFiles,
        allEmployees, 
        rolesList, 
        circlesList, 
        processedEmployees 
      } = processEmployeeData(uploadedFiles);
      
      setUploadedFiles(updatedFiles);
      setRolesData(rolesList);
      setCirclesData(circlesList);
      
      if (allEmployees.length > 0) {
        setEmployees(processedEmployees);
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
