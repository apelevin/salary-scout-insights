
import React from "react";
import { Users } from "lucide-react";

const CirclesTableEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Users className="h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">Нет данных о кругах</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Загрузите файл с информацией о кругах, чтобы увидеть данные.
      </p>
    </div>
  );
};

export default CirclesTableEmpty;
