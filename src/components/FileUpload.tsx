
import { useState } from "react";
import { UploadCloud, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadedFile } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

const FileUpload = ({ onFilesUploaded, maxFiles = 3 }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploadedFiles.length >= maxFiles) {
      toast({
        title: "Превышено максимальное количество файлов",
        description: `Вы можете загрузить максимум ${maxFiles} файла(ов).`,
        variant: "destructive",
      });
      return;
    }

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === "text/csv" || file.name.endsWith(".csv")
    );

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

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    if (uploadedFiles.length >= maxFiles) {
      toast({
        title: "Превышено максимальное количество файлов",
        description: `Вы можете загрузить максимум ${maxFiles} файла(ов).`,
        variant: "destructive",
      });
      return;
    }

    const files = Array.from(e.target.files).filter(
      file => file.type === "text/csv" || file.name.endsWith(".csv")
    );

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

    // Сбросить input, чтобы можно было загружать тот же файл повторно
    e.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Не удалось прочитать файл"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Ошибка при чтении файла"));
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-blue-50 p-3 rounded-full">
            <UploadCloud className="h-10 w-10 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium">
              Перетащите CSV файлы сюда или нажмите для выбора
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Поддерживаются только CSV файлы. Максимум {maxFiles} файла.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            Выбрать файлы
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".csv,text/csv"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-3">Загруженные файлы:</h4>
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <Card key={file.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="font-medium truncate max-w-xs">{file.name}</span>
                  {file.parsed && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
