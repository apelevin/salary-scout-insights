
import React from "react";
import { Crown, FileQuestion } from "lucide-react";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
}

const EmptyState = ({ 
  icon = "FileQuestion", 
  title = "Нет доступных данных", 
  description = "Загрузите файл с данными, чтобы увидеть информацию." 
}: EmptyStateProps) => {
  
  const IconComponent = () => {
    switch (icon) {
      case "Crown":
        return <Crown className="h-12 w-12 text-gray-400 mb-2" />;
      default:
        return <FileQuestion className="h-12 w-12 text-gray-400 mb-2" />;
    }
  };
  
  return (
    <div className="w-full h-60 flex flex-col items-center justify-center">
      <IconComponent />
      <div className="text-lg font-medium text-gray-700">
        {title}
      </div>
      <div className="text-sm text-gray-500 max-w-md text-center mt-1">
        {description}
      </div>
    </div>
  );
};

export default EmptyState;
