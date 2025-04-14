
import { useState } from "react";
import { UploadedFile } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const useUploadedFiles = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [filesProcessed, setFilesProcessed] = useState(false);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setFilesProcessed(false);
  };

  const markFileAsParsed = (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, parsed: true } : f)
    );
  };

  const updateUploadedFiles = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };
  
  const markFilesAsProcessed = () => {
    setFilesProcessed(true);
  };
  
  const resetProcessedState = () => {
    setFilesProcessed(false);
  };

  return {
    uploadedFiles,
    filesProcessed,
    handleFilesUploaded,
    markFileAsParsed,
    updateUploadedFiles,
    markFilesAsProcessed,
    resetProcessedState
  };
};
