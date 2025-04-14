
import { useState } from "react";
import { UploadedFile } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const useUploadedFiles = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const markFileAsParsed = (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, parsed: true } : f)
    );
  };

  const updateUploadedFiles = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  return {
    uploadedFiles,
    handleFilesUploaded,
    markFileAsParsed,
    updateUploadedFiles
  };
};
