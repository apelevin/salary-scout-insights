
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full h-60 flex items-center justify-center">
      <div className="animate-pulse text-lg text-gray-500">
        Загрузка данных...
      </div>
    </div>
  );
};

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full h-60 flex items-center justify-center">
      <div className="text-lg text-gray-500">
        Загрузите файл CSV для отображения данных о сотрудниках
      </div>
    </div>
  );
};
