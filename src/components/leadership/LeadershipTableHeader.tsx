
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const LeadershipTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Название роли</TableHead>
        <TableHead>Стандартный оклад</TableHead>
        <TableHead>Описание</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default LeadershipTableHeader;
