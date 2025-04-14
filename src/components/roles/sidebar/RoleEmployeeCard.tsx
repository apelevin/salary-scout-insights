
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatSalary, formatFTE } from "@/utils/formatUtils";

interface RoleEmployeeCardProps {
  name: string;
  salary: number;
  fte: number;
  contribution: number;
  totalRoleCost: number;
  incognitoMode?: boolean;
}

const RoleEmployeeCard = ({
  name,
  salary,
  fte,
  contribution,
  totalRoleCost,
  incognitoMode = false
}: RoleEmployeeCardProps) => {
  // Calculate percentage of total role cost
  const percentage = totalRoleCost > 0 ? (contribution / totalRoleCost) * 100 : 0;
  
  return (
    <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{name}</div>
        <div className="text-sm font-medium">
          {!incognitoMode ? formatSalary(contribution) : '***'}
        </div>
      </div>
      
      <ScrollArea className="h-auto">
        <div className="space-y-2">
          <div className="text-sm flex justify-between items-center">
            <span className="text-muted-foreground">FTE:</span>
            <span className="text-xs bg-secondary/20 px-2 py-0.5 rounded-full">
              {formatFTE(fte)}
            </span>
          </div>
          
          {!incognitoMode && (
            <div className="text-sm flex justify-between items-center">
              <span className="text-muted-foreground">Оклад:</span>
              <span>{formatSalary(salary)}</span>
            </div>
          )}
          
          <div className="text-sm flex justify-between items-center">
            <span className="text-muted-foreground">Доля в стоимости роли:</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
          </div>
        </div>
      </ScrollArea>
      
      {/* Progress bar showing percentage of total cost */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
        <div 
          className="bg-blue-500 h-1.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RoleEmployeeCard;
