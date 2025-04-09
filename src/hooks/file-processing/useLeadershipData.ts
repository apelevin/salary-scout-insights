
import { useState } from "react";
import { LeadershipData, Employee, RoleData, CircleData, UploadedFile } from "@/types";
import { parseLeadershipCSV } from "@/utils/leadershipParser";
import { toast } from "@/components/ui/use-toast";
import { processEmployeesWithRoles } from "@/utils/employeeUtils";

interface UseLeadershipDataProps {
  employees: Employee[];
  rolesData: RoleData[];
  customStandardSalaries: Map<string, number>;
  circlesData: CircleData[];
  setEmployees: (employees: Employee[]) => void;
}

export const useLeadershipData = ({ 
  employees, 
  rolesData, 
  customStandardSalaries, 
  circlesData,
  setEmployees 
}: UseLeadershipDataProps) => {
  const [leadershipData, setLeadershipData] = useState<LeadershipData[]>([]);
  
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
    }
  };

  return {
    leadershipData,
    handleLeadershipDataChange,
    handleLeadershipFileUpload
  };
};
