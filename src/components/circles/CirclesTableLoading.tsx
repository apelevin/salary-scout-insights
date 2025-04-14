
import React from "react";

const CirclesTableLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="mt-4 text-sm text-muted-foreground">Загрузка данных...</p>
    </div>
  );
};

export default CirclesTableLoading;
