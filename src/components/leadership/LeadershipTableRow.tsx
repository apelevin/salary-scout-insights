
import { TableCell, TableRow } from "@/components/ui/table";

interface LeadershipTableRowProps {
  roleName: string;
  standardSalary: number;
  description?: string;
  formatSalary: (salary: number) => string;
}

const LeadershipTableRow = ({ 
  roleName, 
  standardSalary,
  description,
  formatSalary
}: LeadershipTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{roleName}</TableCell>
      <TableCell>{formatSalary(standardSalary)}</TableCell>
      <TableCell>
        {description || <span className="text-gray-400">—</span>}
      </TableCell>
    </TableRow>
  );
};

export default LeadershipTableRow;
