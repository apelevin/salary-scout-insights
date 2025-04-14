
import React from "react";
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const CirclesTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[300px]">Название круга</TableHead>
        <TableHead className="text-right">Стандартный бюджет</TableHead>
        <TableHead className="text-right">Текущий бюджет</TableHead>
        <TableHead className="text-right">Разница</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CirclesTableHeader;
