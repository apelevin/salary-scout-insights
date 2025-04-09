
import { TableCell, TableRow } from "@/components/ui/table";

interface LeadershipTableRowProps {
  leadershipType: string;
  circleSalaries: Map<string, number>;
  circleCounts: string[];
  formatSalary: (salary: number) => string;
}

const LeadershipTableRow = ({ 
  leadershipType,
  circleSalaries,
  circleCounts,
  formatSalary
}: LeadershipTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{leadershipType}</TableCell>
      {circleCounts.map((count, index) => (
        <TableCell key={index} className="text-center">
          {circleSalaries.has(count) 
            ? formatSalary(circleSalaries.get(count) || 0) 
            : <span className="text-gray-400">—</span>}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default LeadershipTableRow;
