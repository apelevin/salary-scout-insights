
import { useState } from "react";
import { UploadedFile } from "@/types";

export const useFileUploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  return {
    uploadedFiles,
    setUploadedFiles,
    handleFilesUploaded
  };
};
