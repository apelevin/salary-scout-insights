
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const CirclesTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[60px]">№</TableHead>
        <TableHead>Название круга</TableHead>
        <TableHead>Функциональная принадлежность</TableHead>
        <TableHead>Стандартный бюджет</TableHead>
        <TableHead>Текущий бюджет</TableHead>
        <TableHead>Разница</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CirclesTableHeader;
