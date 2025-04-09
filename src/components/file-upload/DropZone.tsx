
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  maxFiles: number;
  onFilesDrop: (files: File[]) => void;
}

const DropZone = ({ maxFiles, onFilesDrop }: DropZoneProps) => {
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === "text/csv" || file.name.endsWith(".csv")
    );

    if (files.length > 0) {
      onFilesDrop(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files).filter(
      file => file.type === "text/csv" || file.name.endsWith(".csv")
    );

    if (files.length > 0) {
      onFilesDrop(files);
    }

    e.target.value = '';
  };

  return (
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
  );
};

export default DropZone;
