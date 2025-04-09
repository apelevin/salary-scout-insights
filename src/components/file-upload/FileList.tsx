
import { FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadedFile } from "@/types";

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

const FileList = ({ files, onRemoveFile }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="text-md font-medium mb-3">Загруженные файлы:</h4>
      <div className="space-y-2">
        {files.map(file => (
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
              onClick={() => onRemoveFile(file.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FileList;
