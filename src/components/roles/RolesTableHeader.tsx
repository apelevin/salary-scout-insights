
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RolesTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/3">Название роли</TableHead>
        <TableHead className="w-1/5">Мин. зарплата</TableHead>
        <TableHead className="w-1/5">Макс. зарплата</TableHead>
        <TableHead className="w-1/4">Стандартный оклад</TableHead>
        <TableHead className="w-[80px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RolesTableHeader;
