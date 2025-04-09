
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

interface LeadershipTableHeaderProps {
  circleCounts: string[];
}

const LeadershipTableHeader = ({ circleCounts }: LeadershipTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">Тип лидерства</TableHead>
        {circleCounts.map((count, index) => (
          <TableHead key={index} className="text-center">{count}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default LeadershipTableHeader;
