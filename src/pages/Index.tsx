
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
  
  const {
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
    processFiles,
    resetUploadControls
  } = useFileProcessing();

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

        <div className={`grid ${filesProcessed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12 gap-6'}`}>
          {!filesProcessed && (
            <div className="lg:col-span-4">
              <FileUploadSection 
                uploadedFiles={uploadedFiles}
                isProcessing={isProcessing}
                filesProcessed={filesProcessed}
                onFilesUploaded={handleFilesUploaded}
                onProcessFiles={processFiles}
                onResetUploadControls={resetUploadControls}
                onLeadershipFileUpload={handleLeadershipFileUpload}
                maxFiles={4}
              />
            </div>
          )}

          <div className={`${filesProcessed ? 'col-span-full' : 'lg:col-span-8'}`}>
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
              incognitoMode={incognitoMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
