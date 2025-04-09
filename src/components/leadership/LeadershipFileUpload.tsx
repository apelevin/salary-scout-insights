
import { useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface LeadershipFileUploadProps {
  onLeadershipFileUpload: (file: UploadedFile) => void;
  isProcessing: boolean;
}

const LeadershipFileUpload = ({ onLeadershipFileUpload, isProcessing }: LeadershipFileUploadProps) => {
  const [filename, setFilename] = useState<string>("");
  
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
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
      setFilename(file.name);
      
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
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input 
            type="text" 
            value={filename} 
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
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Загрузите CSV-файл со стандартными окладами ролей лидерства.
        Первая колонка должна содержать тип лидерства, а в заголовках следующих колонок должно быть указано количество кругов.
      </p>
    </div>
  );
};

export default LeadershipFileUpload;
