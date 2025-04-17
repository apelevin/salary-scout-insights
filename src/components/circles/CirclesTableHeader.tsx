
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const CirclesTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[60px]">№</TableHead>
        <TableHead>Название круга</TableHead>
        <TableHead>Функциональная принадлежность</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default CirclesTableHeader;
