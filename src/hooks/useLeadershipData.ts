
import { useState } from "react";
import { UploadedFile, LeadershipData } from "@/types";
import { parseLeadershipCSV } from "@/utils/leadershipParser";
import { toast } from "@/components/ui/use-toast";

export const useLeadershipData = (
  markFileAsParsed: (fileId: string) => void, 
  setIsProcessing: (isProcessing: boolean) => void
) => {
  const [leadershipData, setLeadershipData] = useState<LeadershipData[]>([]);

  const handleLeadershipFileUpload = (file: UploadedFile) => {
    setIsProcessing(true);
    
    try {
      console.log("Начинаем парсинг файла лидерства:", file.name);
      console.log("Первые 100 символов содержимого:", file.content.substring(0, 100));
      
      const parsedLeadership = parseLeadershipCSV(file.content);
      console.log("Результат парсинга лидерства:", parsedLeadership.length, "записей");
      
      if (parsedLeadership.length > 0) {
        setLeadershipData(parsedLeadership);
        
        // Отмечаем файл как успешно обработанный
        markFileAsParsed(file.id);
        
        toast({
          title: "Файл лидерства загружен",
          description: `Загружено ${parsedLeadership.length} записей о стандартных зарплатах ролей.`,
        });
      } else {
        console.error("Файл не содержит корректных данных о лидерстве");
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

  return {
    leadershipData,
    setLeadershipData,
    handleLeadershipFileUpload
  };
};
