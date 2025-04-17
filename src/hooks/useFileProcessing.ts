
import { useState } from "react";
import { Employee, RoleData, CircleData } from "@/types";
import { useFileUpload } from "./useFileUpload";
import { useLeadershipData } from "./useLeadershipData";
import { useStandardSalary } from "./useStandardSalary";
import { useFileParser } from "./useFileParser";
import { saveAllDataToSupabase } from "@/utils/supabaseDataSync";
import { toast } from "@/components/ui/use-toast";
import { isSupabaseConfigured } from "@/lib/supabase";

export const useFileProcessing = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [circlesData, setCirclesData] = useState<CircleData[]>([]);
  const [isSavingToSupabase, setIsSavingToSupabase] = useState(false);

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

  const saveToSupabase = async () => {
    if (employees.length === 0 && rolesData.length === 0 && circlesData.length === 0) {
      toast({
        title: "Нет данных для сохранения",
        description: "Пожалуйста, сначала загрузите и обработайте файлы с данными.",
        variant: "destructive",
      });
      return;
    }

    if (!isSupabaseConfigured()) {
      toast({
        title: "Supabase не настроен",
        description: "Пожалуйста, настройте подключение к Supabase перед сохранением данных.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingToSupabase(true);
    
    try {
      await saveAllDataToSupabase(employees, rolesData, circlesData, leadershipData);
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить данные: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    } finally {
      setIsSavingToSupabase(false);
    }
  };

  return {
    uploadedFiles,
    employees,
    rolesData,
    circlesData,
    leadershipData,
    isProcessing,
    isSavingToSupabase,
    customStandardSalaries,
    handleFilesUploaded,
    handleStandardSalaryChange,
    handleLeadershipFileUpload,
    handleLeadershipDataChange,
    processFiles,
    saveToSupabase
  };
};
