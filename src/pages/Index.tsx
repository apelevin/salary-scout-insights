
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FileUploadSection from "@/components/dashboard/FileUploadSection";
import DataDisplaySection from "@/components/dashboard/DataDisplaySection";
import { useFileProcessing } from "@/hooks/useFileProcessing";

const Index = () => {
  const [activeTab, setActiveTab] = useState("employees");
  
  const {
    uploadedFiles,
    employees,
    rolesData,
    isProcessing,
    customStandardSalaries,
    handleFilesUploaded,
    handleStandardSalaryChange,
    processFiles
  } = useFileProcessing();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <FileUploadSection 
              uploadedFiles={uploadedFiles}
              isProcessing={isProcessing}
              onFilesUploaded={handleFilesUploaded}
              onProcessFiles={processFiles}
            />
          </div>

          <div className="lg:col-span-8">
            <DataDisplaySection 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              employees={employees}
              rolesData={rolesData}
              isProcessing={isProcessing}
              customStandardSalaries={customStandardSalaries}
              onStandardSalaryChange={handleStandardSalaryChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
