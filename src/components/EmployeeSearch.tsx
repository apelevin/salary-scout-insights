
import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EmployeeSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = memo(({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex mb-4 relative">
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Поиск по имени сотрудника..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
});

// Задаем displayName для улучшения отладки
EmployeeSearch.displayName = 'EmployeeSearch';

export default EmployeeSearch;
