
import { TableCell, TableRow } from "@/components/ui/table";
import RoleNameCell from "./RoleNameCell";
import RoleMinSalary from "./RoleMinSalary";
import RoleMaxSalary from "./RoleMaxSalary";
import RoleStandardSalary from "./RoleStandardSalary";

interface RoleRowProps {
  roleName: string;
  minSalary: number;
  maxSalary: number;
  standardSalary: number;
  salaries: number[];
  index: number;
  formatSalary: (salary: number) => string;
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
  onRoleClick?: (roleName: string) => void;
}

const RoleRow = ({ 
  roleName, 
  minSalary, 
  maxSalary, 
  standardSalary, 
  salaries,
  index,
  formatSalary,
  onStandardSalaryChange,
  onRoleClick
}: RoleRowProps) => {
  const hasEmployees = salaries.length > 0;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <RoleNameCell 
          roleName={roleName} 
          hasEmployees={hasEmployees} 
          onRoleClick={onRoleClick} 
        />
      </TableCell>
      <TableCell>
        <RoleMinSalary 
          minSalary={minSalary} 
          hasEmployees={hasEmployees} 
          formatSalary={formatSalary} 
        />
      </TableCell>
      <TableCell>
        <RoleMaxSalary 
          maxSalary={maxSalary} 
          minSalary={minSalary}
          hasEmployees={hasEmployees} 
          formatSalary={formatSalary} 
        />
      </TableCell>
      <TableCell>
        <RoleStandardSalary
          roleName={roleName}
          standardSalary={standardSalary}
          hasEmployees={hasEmployees}
          formatSalary={formatSalary}
          onStandardSalaryChange={onStandardSalaryChange}
        />
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

export default RoleRow;
