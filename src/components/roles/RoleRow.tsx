
import { TableCell, TableRow } from "@/components/ui/table";
import StandardSalaryField from "@/components/roles/StandardSalaryField";
import SalaryDisplay from "@/components/roles/SalaryDisplay";

interface RoleRowProps {
  roleName: string;
  minSalary: number;
  maxSalary: number;
  standardSalary: number;
  salaries: number[];
  index: number;
  formatSalary: (salary: number) => string;
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
}

const RoleRow = ({ 
  roleName, 
  minSalary, 
  maxSalary, 
  standardSalary, 
  salaries,
  formatSalary,
  onStandardSalaryChange
}: RoleRowProps) => {
  // Calculate salary difference percentage
  const salaryDifferencePercentage = minSalary > 0 ? ((maxSalary - minSalary) / minSalary) * 100 : 0;
  const needsDecomposition = salaryDifferencePercentage > 30;
  const hasData = salaries.length > 0;

  return (
    <TableRow>
      <TableCell className="font-medium">{roleName}</TableCell>
      <TableCell>
        <SalaryDisplay
          value={minSalary}
          formattedValue={formatSalary(minSalary)}
          isEmpty={!hasData}
        />
      </TableCell>
      <TableCell>
        <SalaryDisplay
          value={maxSalary}
          formattedValue={formatSalary(maxSalary)}
          needsWarning={needsDecomposition}
          warningMessage="Роль требует декомпозиции"
          isEmpty={!hasData}
        />
      </TableCell>
      <TableCell>
        <StandardSalaryField
          standardSalary={standardSalary}
          roleName={roleName}
          hasData={hasData}
          onStandardSalaryChange={onStandardSalaryChange}
        />
      </TableCell>
      <TableCell>{/* Empty cell for layout consistency */}</TableCell>
    </TableRow>
  );
};

export default RoleRow;
