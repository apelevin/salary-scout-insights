
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FileUploadSection from "@/components/dashboard/FileUploadSection";
import DataDisplaySection from "@/components/dashboard/DataDisplaySection";
import { useFileProcessing } from "@/hooks/useFileProcessing";
import { Switch } from "@/components/ui/switch";
import { EyeOff } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(false);
  
  const {
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
    handleLeadershipDataChange,
    processFiles
  } = useFileProcessing();

  // Обработчик, вызывающийся после успешной обработки файлов
  const handleProcessFiles = () => {
    processFiles();
    setFilesUploaded(true);
  };

  // Обновленный обработчик загрузки файлов
  const handleUploadFiles = (files) => {
    handleFilesUploaded(files);
    if (files.length > 0) {
      setFilesUploaded(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <DashboardHeader />
        
        <div className="flex justify-end mb-4 items-center gap-2">
          <EyeOff className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500 mr-2">Режим инкогнито</span>
          <Switch 
            checked={incognitoMode}
            onCheckedChange={setIncognitoMode}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {!filesUploaded && (
            <FileUploadSection 
              uploadedFiles={uploadedFiles}
              isProcessing={isProcessing}
              onFilesUploaded={handleUploadFiles}
              onProcessFiles={handleProcessFiles}
              onLeadershipFileUpload={handleLeadershipFileUpload}
              maxFiles={4}
            />
          )}

          {(filesUploaded || uploadedFiles.length > 0) && (
            <DataDisplaySection 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              employees={employees}
              rolesData={rolesData}
              circlesData={circlesData}
              leadershipData={leadershipData}
              isProcessing={isProcessing}
              customStandardSalaries={customStandardSalaries}
              onStandardSalaryChange={handleStandardSalaryChange}
              onLeadershipDataChange={handleLeadershipDataChange}
              incognitoMode={incognitoMode}
              fullWidth={filesUploaded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
