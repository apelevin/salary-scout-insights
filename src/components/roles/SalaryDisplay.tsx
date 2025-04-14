
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";

interface SalaryDisplayProps {
  value: number;
  formattedValue: string;
  needsWarning?: boolean;
  warningMessage?: string;
  isEmpty?: boolean;
}

const SalaryDisplay = ({ 
  value, 
  formattedValue, 
  needsWarning = false, 
  warningMessage = "Роль требует декомпозиции", 
  isEmpty = false 
}: SalaryDisplayProps) => {
  if (isEmpty) {
    return <span className="text-gray-400">—</span>;
  }
  
  return (
    <div className="flex items-center gap-2">
      {formattedValue}
      {needsWarning && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle size={16} className="text-[#F97316]" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{warningMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SalaryDisplay;
