
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

  // Add debug logging to track circles data
  console.log("useFileProcessing has circles data:", {
    count: circlesData?.length || 0,
    sample: circlesData?.slice(0, 3).map(c => ({ name: c.name, type: c.functionalType })) || [],
    roles: rolesData?.slice(0, 3).map(r => ({ 
      role: r.roleName, 
      circleName: r.circleName,
      participant: r.participantName
    })) || []
  });

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
