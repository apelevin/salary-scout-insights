
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, ArrowDown, ArrowUp } from "lucide-react";

type SortDirection = "none" | "asc" | "desc";
type SortField = "name" | "difference";

interface EmployeeTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  toggleSort: (field: SortField) => void;
}

const EmployeeTableHeader: React.FC<EmployeeTableHeaderProps> = ({
  sortField,
  sortDirection,
  toggleSort
}) => {
  const getSortIconForDifference = () => {
    if (sortField !== "difference") {
      return <ArrowDown className="h-4 w-4 text-muted-foreground/70" />;
    }
    
    switch (sortDirection) {
      case "asc":
        return <ArrowUp className="h-4 w-4" />;
      case "desc":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <ArrowDown className="h-4 w-4 text-muted-foreground/70" />;
    }
  };

  const getSortIconForName = () => {
    if (sortField !== "name") {
      return <ArrowDownAZ className="h-4 w-4 text-muted-foreground/70" />;
    }
    
    switch (sortDirection) {
      case "asc":
        return <ArrowDownAZ className="h-4 w-4" />;
      case "desc":
        return <ArrowUpAZ className="h-4 w-4" />;
      default:
        return <ArrowDownAZ className="h-4 w-4 text-muted-foreground/70" />;
    }
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/4">
          <div className="flex items-center justify-between">
            <span>Имя сотрудника</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toggleSort("name")}
              className="ml-2 h-8 w-8 p-0"
            >
              {getSortIconForName()}
            </Button>
          </div>
        </TableHead>
        <TableHead className="w-1/4">Зарплата</TableHead>
        <TableHead className="w-1/4">Стандартная зарплата</TableHead>
        <TableHead className="w-1/4">
          <div className="flex items-center justify-between">
            <span>Разница</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toggleSort("difference")}
              className="ml-2 h-8 w-8 p-0"
            >
              {getSortIconForDifference()}
            </Button>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default EmployeeTableHeader;
