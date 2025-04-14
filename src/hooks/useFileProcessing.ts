
import { useState } from "react";
import { Employee, RoleData, CircleData } from "@/types";
import { useFileUpload } from "./useFileUpload";
import { useLeadershipData } from "./useLeadershipData";
import { useStandardSalary } from "./useStandardSalary";
import { useFileParser } from "./useFileParser";

export const useFileProcessing = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [circlesData, setCirclesData] = useState<CircleData[]>([]);

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
    handleLeadershipFileUpload 
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
    handleLeadershipFileUpload,
    processFiles
  };
};
