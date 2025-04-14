
import { useState } from "react";
import { UploadedFile } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const markFileAsParsed = (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, parsed: true } : f)
    );
  };

  return {
    uploadedFiles,
    isProcessing,
    setIsProcessing,
    handleFilesUploaded,
    setUploadedFiles,
    markFileAsParsed
  };
};
