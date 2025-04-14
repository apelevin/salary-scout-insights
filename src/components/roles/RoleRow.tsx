
import { TableCell, TableRow } from "@/components/ui/table";
import RoleNameCell from "./RoleNameCell";
import RoleMinSalary from "./RoleMinSalary";
import RoleMaxSalary from "./RoleMaxSalary";
import RoleStandardSalary from "./RoleStandardSalary";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  functionalType?: string;  // Add this new property
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
  onRoleClick,
  functionalType = "Не указано"  // Default value
}: RoleRowProps) => {
  const hasEmployees = salaries.length > 0;

  return (
    <TableRow>
      <TableCell className="font-medium flex items-center">
        <RoleNameCell 
          roleName={roleName} 
          hasEmployees={hasEmployees} 
          onRoleClick={onRoleClick} 
        />
        {functionalType && functionalType !== "Не указано" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="ml-2 h-4 w-4 text-gray-500 hover:text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Функциональная принадлежность: {functionalType}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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
