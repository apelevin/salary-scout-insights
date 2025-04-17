
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { UploadedFile } from "@/types";
import DropZone from "@/components/file-upload/DropZone";
import FileList from "@/components/file-upload/FileList";
import { readFileContent } from "@/components/file-upload/fileUtils";

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

const FileUpload = ({ onFilesUploaded, maxFiles = 4 }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFilesDropped = async (files: File[]) => {
    if (uploadedFiles.length >= maxFiles) {
      toast({
        title: "Превышено максимальное количество файлов",
        description: `Вы можете загрузить максимум ${maxFiles} файла(ов).`,
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "Неверный формат файла",
        description: "Пожалуйста, загрузите файл в формате CSV.",
        variant: "destructive",
      });
      return;
    }

    if (files.length + uploadedFiles.length > maxFiles) {
      toast({
        title: "Превышено максимальное количество файлов",
        description: `Вы можете загрузить еще ${maxFiles - uploadedFiles.length} файл(ов).`,
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadedFile[] = [];

    for (const file of files) {
      try {
        const content = await readFileContent(file);
        newFiles.push({
          id: uuidv4(),
          name: file.name,
          content,
          parsed: false,
        });
      } catch (err) {
        console.error("Ошибка чтения файла:", err);
        toast({
          title: "Ошибка при чтении файла",
          description: `Не удалось загрузить файл: ${file.name}`,
          variant: "destructive",
        });
      }
    }

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  return (
    <div className="w-full">
      <DropZone maxFiles={maxFiles} onFilesDrop={handleFilesDropped} />
      <FileList files={uploadedFiles} onRemoveFile={handleRemoveFile} />
    </div>
  );
};

export default FileUpload;
