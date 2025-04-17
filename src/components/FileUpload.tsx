
import { useState } from "react";
import { UploadedFile } from "@/types";
import DropZone from "@/components/file-upload/DropZone";
import FileList from "@/components/file-upload/FileList";
import { useFileUploadHandler } from "@/hooks/useFileUploadHandler";

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

const FileUpload = ({ onFilesUploaded, maxFiles = 4 }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { handleFilesDropped, handleRemoveFile } = useFileUploadHandler({
    uploadedFiles,
    setUploadedFiles,
    onFilesUploaded,
    maxFiles
  });

  return (
    <div className="w-full">
      <DropZone maxFiles={maxFiles} onFilesDrop={handleFilesDropped} />
      <FileList files={uploadedFiles} onRemoveFile={handleRemoveFile} />
    </div>
  );
};

export default FileUpload;
