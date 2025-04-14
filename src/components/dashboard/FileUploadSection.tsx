
import { FileType, FileText, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/types";

interface FileUploadSectionProps {
  uploadedFiles: UploadedFile[];
  isProcessing: boolean;
  filesProcessed: boolean;
  onFilesUploaded: (files: UploadedFile[]) => void;
  onProcessFiles: () => void;
  onResetUploadControls?: () => void;
  onLeadershipFileUpload?: (file: UploadedFile) => void;
  maxFiles?: number;
}

const FileUploadSection = ({
  uploadedFiles,
  isProcessing,
  filesProcessed,
  onFilesUploaded,
  onProcessFiles,
  onResetUploadControls,
  onLeadershipFileUpload,
  maxFiles = 4
}: FileUploadSectionProps) => {
  
  // Обработка всех загруженных файлов через единый обработчик
  const handleFilesUploaded = (files: UploadedFile[]) => {
    onFilesUploaded(files);
    
    // Если есть обработчик файлов лидерства, и среди загруженных файлов есть новые,
    // проверим их на соответствие формату файла лидерства
    if (onLeadershipFileUpload) {
      const newFiles = files.filter(file => !uploadedFiles.some(existing => existing.id === file.id));
      
      newFiles.forEach(file => {
        // Проверяем, является ли файл файлом лидерства по имени и содержимому
        const fileName = file.name.toLowerCase();
        const firstLine = file.content.split('\n')[0].toLowerCase();
        
        if (
          fileName.includes('lead') || 
          fileName.includes('лидер') || 
          firstLine.includes('лидерство') || 
          firstLine.includes('leadership') ||
          firstLine.includes('lead') ||
          firstLine.includes('тип')
        ) {
          console.log("Обнаружен возможный файл лидерства:", file.name);
          onLeadershipFileUpload(file);
        }
      });
    }
  };

  // Отображение статуса загруженных файлов
  const getProcessedFilesStatus = () => {
    const totalFiles = uploadedFiles.length;
    const parsedFiles = uploadedFiles.filter(file => file.parsed).length;
    
    return (
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Обработано файлов: {parsedFiles}/{totalFiles}
        </p>
      </div>
    );
  };

  // Отображение кнопки для возврата к загрузке
  const handleResetUpload = () => {
    if (onResetUploadControls) {
      onResetUploadControls();
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileType className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-foreground">Загрузка данных</h2>
            </div>
            {filesProcessed && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleResetUpload}
                title="Загрузить новые файлы"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!filesProcessed ? (
            <>
              <FileUpload onFilesUploaded={handleFilesUploaded} maxFiles={maxFiles} />
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  disabled={uploadedFiles.length === 0 || isProcessing}
                  onClick={onProcessFiles}
                >
                  {isProcessing ? "Обработка..." : "Обработать данные"}
                </Button>
              </div>
              {uploadedFiles.length > 0 && getProcessedFilesStatus()}
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-green-600 font-medium mb-2">Файлы успешно обработаны!</p>
              <p className="text-sm text-muted-foreground">
                Загружено {uploadedFiles.length} файлов. Вы можете просмотреть данные на вкладках справа.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {!filesProcessed && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-foreground">Инструкция</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                1. Загрузите до 4 файлов в формате CSV с данными о сотрудниках, ролях и лидерстве.
              </p>
              <p>
                2. CSV файлы сотрудников должны содержать колонки "name" (имя) и "salary" (зарплата).
              </p>
              <p>
                3. CSV файлы ролей должны содержать колонки "участник роли" и "название роли".
              </p>
              <p>
                4. CSV файл лидерства должен содержать тип лидерства в первой колонке и количество кругов с окладами в последующих колонках.
              </p>
              <p>
                5. Нажмите "Обработать данные" для анализа загруженных файлов.
              </p>
              <p>
                6. Вы можете редактировать стандартные оклады для ролей на соответствующей вкладке.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default FileUploadSection;
