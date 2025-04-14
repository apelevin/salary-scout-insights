
import { AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RoleMaxSalaryProps {
  maxSalary: number;
  minSalary: number;
  hasEmployees: boolean;
  formatSalary: (salary: number) => string;
}

const RoleMaxSalary = ({ maxSalary, minSalary, hasEmployees, formatSalary }: RoleMaxSalaryProps) => {
  if (!hasEmployees) {
    return <span className="text-gray-400">—</span>;
  }

  // Calculate salary difference percentage
  const salaryDifferencePercentage = minSalary > 0 ? ((maxSalary - minSalary) / minSalary) * 100 : 0;
  const needsDecomposition = salaryDifferencePercentage > 30;

  return (
    <div className="flex items-center gap-2">
      {formatSalary(maxSalary)}
      {needsDecomposition && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle size={16} className="text-[#F97316]" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Роль требует декомпозиции</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default RoleMaxSalary;
