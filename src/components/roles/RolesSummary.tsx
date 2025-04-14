
import { AlertTriangle } from "lucide-react";

interface RolesSummaryProps {
  count: number;
  alertCount?: number;
}

const RolesSummary = ({ 
  count, 
  alertCount = 0 
}: RolesSummaryProps) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <div>Всего ролей: {count}</div>
      {alertCount > 0 && (
        <div className="flex items-center gap-1 text-yellow-600">
          <AlertTriangle className="h-4 w-4" />
          Ролей с проблемами: {alertCount}
        </div>
      )}
    </div>
  );
};

export default RolesSummary;

