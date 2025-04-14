
import { useUploadedFiles } from "./useUploadedFiles";
import { useLeadershipData } from "./useLeadershipData";
import { useSalaryCustomization } from "./useSalaryCustomization";
import { useDataProcessing } from "./useDataProcessing";

export const useFileProcessing = () => {
  const { 
    uploadedFiles, 
    filesProcessed,
    handleFilesUploaded, 
    markFileAsParsed, 
    updateUploadedFiles,
    markFilesAsProcessed,
    resetProcessedState
  } = useUploadedFiles();
  
  const { 
    leadershipData, 
    setLeadershipData, 
    handleLeadershipFileUpload 
  } = useLeadershipData(markFileAsParsed);
  
  const { 
    customStandardSalaries, 
    handleStandardSalaryChange 
  } = useSalaryCustomization();
  
  const { 
    employees, 
    rolesData, 
    circlesData, 
    isProcessing, 
    processFiles 
  } = useDataProcessing();

  const handleProcessFiles = () => {
    processFiles(uploadedFiles, updateUploadedFiles, leadershipData, setLeadershipData);
    markFilesAsProcessed();
  };

  const handleResetUploadControls = () => {
    resetProcessedState();
  };

  return {
    uploadedFiles,
    employees,
    rolesData,
    circlesData,
    leadershipData,
    isProcessing,
    filesProcessed,
    customStandardSalaries,
    handleFilesUploaded,
    handleStandardSalaryChange,
    handleLeadershipFileUpload,
    processFiles: handleProcessFiles,
    resetUploadControls: handleResetUploadControls
  };
};
