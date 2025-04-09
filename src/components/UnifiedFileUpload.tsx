
import { useState } from "react";
import { UploadCloud, FileUp, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadedFile } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UnifiedFileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  onLeadershipFileUpload?: (file: UploadedFile) => void;
  uploadedFiles: UploadedFile[];
  isProcessing: boolean;
  onProcessFiles: () => void;
  maxFiles?: number;
}

const UnifiedFileUpload = ({
  onFilesUploaded,
  onLeadershipFileUpload,
  uploadedFiles,
  isProcessing,
  onProcessFiles,
  maxFiles = 3
}: UnifiedFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [leadershipFilename, setLeadershipFilename] = useState<string>("");
  const [activeTab, setActiveTab] = useState("regular");

  // Обработчики для обычных файлов
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
    onFilesUploaded(updatedFiles);

    // Сбросить input, чтобы можно было загружать тот же файл повторно
    e.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    onFilesUploaded(updatedFiles);
  };

  // Обработчик для файла лидерства
  const handleLeadershipFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !onLeadershipFileUpload) return;
    
    const file = e.target.files[0];
    
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Неверный формат файла",
        description: "Пожалуйста, загрузите файл в формате CSV.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const content = await readFileContent(file);
      setLeadershipFilename(file.name);
      
      const uploadedFile: UploadedFile = {
        id: uuidv4(),
        name: file.name,
        content,
        parsed: false,
      };
      
      onLeadershipFileUpload(uploadedFile);
    } catch (err) {
      console.error("Ошибка чтения файла:", err);
      toast({
        title: "Ошибка при чтении файла",
        description: `Не удалось загрузить файл: ${file.name}`,
        variant: "destructive",
      });
    }
    
    // Сбросить input, чтобы можно было загружать тот же файл повторно
    e.target.value = '';
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

  // Рендерим компонент с вкладками
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <UploadCloud className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-foreground">Загрузка данных</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="regular">Данные о сотрудниках и ролях</TabsTrigger>
            <TabsTrigger value="leadership">Данные лидерства</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular" className="space-y-4">
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
                        <FileUp className="h-5 w-5 text-blue-500" />
                        <span className="font-medium truncate max-w-xs">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button 
                className="w-full" 
                disabled={uploadedFiles.length === 0 || isProcessing}
                onClick={onProcessFiles}
              >
                {isProcessing ? "Обработка..." : "Обработать данные"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="leadership" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input 
                    type="text" 
                    value={leadershipFilename} 
                    readOnly 
                    placeholder="Файл не выбран" 
                    className="bg-muted"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById("leadership-file-input")?.click()}
                  disabled={isProcessing}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Выбрать файл
                </Button>
                <input
                  id="leadership-file-input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleLeadershipFileInput}
                  className="hidden"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-muted-foreground">
                  Загрузите CSV-файл со стандартными окладами ролей лидерства.
                  Первая колонка должна содержать тип лидерства, а в заголовках следующих колонок должно быть указано количество кругов.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnifiedFileUpload;
