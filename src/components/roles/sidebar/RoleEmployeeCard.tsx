
import { formatSalary } from "@/utils/formatUtils";

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
      <div className="flex justify-between items-center">
        <div className="font-medium">{name}</div>
        <div className="text-sm font-medium">
          {!incognitoMode ? formatSalary(contribution) : '***'}
        </div>
      </div>
    </div>
  );
};

export default RoleEmployeeCard;
