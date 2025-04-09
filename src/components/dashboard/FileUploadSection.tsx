
import { FileType, FileText, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/types";
import LeadershipFileUpload from "@/components/leadership/LeadershipFileUpload";

interface FileUploadSectionProps {
  uploadedFiles: UploadedFile[];
  isProcessing: boolean;
  onFilesUploaded: (files: UploadedFile[]) => void;
  onProcessFiles: () => void;
  onLeadershipFileUpload?: (file: UploadedFile) => void;
  maxFiles?: number;
}

const FileUploadSection = ({
  uploadedFiles,
  isProcessing,
  onFilesUploaded,
  onProcessFiles,
  onLeadershipFileUpload,
  maxFiles = 3
}: FileUploadSectionProps) => {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileType className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">Загрузка данных</h2>
          </div>
          <FileUpload onFilesUploaded={onFilesUploaded} maxFiles={maxFiles} />
          <div className="mt-6">
            <Button 
              className="w-full" 
              disabled={uploadedFiles.length === 0 || isProcessing}
              onClick={onProcessFiles}
            >
              {isProcessing ? "Обработка..." : "Обработать данные"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {onLeadershipFileUpload && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-foreground">Загрузка данных лидерства</h2>
            </div>
            <LeadershipFileUpload onLeadershipFileUpload={onLeadershipFileUpload} isProcessing={isProcessing} />
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">Инструкция</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              1. Загрузите до 3 файлов в формате CSV с данными о сотрудниках и ролях.
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
    </>
  );
};

export default FileUploadSection;
