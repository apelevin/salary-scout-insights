
import { useState } from "react";
import { Employee, UploadedFile, RoleData, CircleData } from "@/types";
import { parseCSV, parseRolesCSV, parseCirclesCSV } from "@/utils/csvParser";
import { processEmployeesWithRoles } from "@/utils/employeeUtils";
import { toast } from "@/components/ui/use-toast";

export const useEmployeeProcessing = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const processEmployeeData = (
    uploadedFiles: UploadedFile[]
  ) => {
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

    // Process employees with roles and calculate standard salaries
    const processedEmployees = allEmployees.length > 0 
      ? processEmployeesWithRoles(allEmployees, rolesList, new Map(), circlesList, [])
      : allEmployees;

    return {
      updatedFiles,
      allEmployees,
      rolesList,
      circlesList,
      processedEmployees
    };
  };

  return {
    employees,
    setEmployees,
    processEmployeeData
  };
};
