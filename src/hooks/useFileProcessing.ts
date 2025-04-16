
import { useState } from "react";
import { Employee, RoleData, CircleData } from "@/types";
import { useFileUpload } from "./useFileUpload";
import { useLeadershipData } from "./useLeadershipData";
import { useStandardSalary } from "./useStandardSalary";
import { useFileParser } from "./useFileParser";
import { saveAllDataToSupabase } from "@/utils/supabaseDataSync";
import { toast } from "@/components/ui/use-toast";

export const useFileProcessing = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [circlesData, setCirclesData] = useState<CircleData[]>([]);
  const [saveToSupabaseInProgress, setSaveToSupabaseInProgress] = useState<boolean>(false);
  const [dataSavedToSupabase, setDataSavedToSupabase] = useState<boolean>(false);

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
    handleStandardSalaryChange 
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

  // New function to save all data to Supabase
  const saveDataToSupabase = async () => {
    if (employees.length === 0 && rolesData.length === 0 && circlesData.length === 0) {
      toast({
        title: "Нет данных для сохранения",
        description: "Пожалуйста, сначала загрузите и обработайте файлы с данными.",
        variant: "destructive",
      });
      return;
    }

    setSaveToSupabaseInProgress(true);

    try {
      const success = await saveAllDataToSupabase(
        employees, 
        rolesData, 
        circlesData, 
        leadershipData
      );
      
      if (success) {
        setDataSavedToSupabase(true);
      }
    } catch (error) {
      console.error("Error saving data to Supabase:", error);
      toast({
        title: "Ошибка сохранения",
        description: "Произошла непредвиденная ошибка при сохранении данных.",
        variant: "destructive",
      });
    } finally {
      setSaveToSupabaseInProgress(false);
    }
  };

  return {
    uploadedFiles,
    employees,
    rolesData,
    circlesData,
    leadershipData,
    isProcessing,
    saveToSupabaseInProgress,
    dataSavedToSupabase,
    customStandardSalaries,
    handleFilesUploaded,
    handleStandardSalaryChange,
    handleLeadershipFileUpload,
    handleLeadershipDataChange,
    processFiles,
    saveDataToSupabase
  };
};
