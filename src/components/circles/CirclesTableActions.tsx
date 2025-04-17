
import { CircleDot } from "lucide-react";

interface CirclesTableActionsProps {
  circlesCount: number;
}

const CirclesTableActions = ({ circlesCount }: CirclesTableActionsProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <CircleDot className="h-5 w-5 text-blue-500" />
        <span className="font-medium">
          Всего кругов: {circlesCount}
        </span>
      </div>
    </div>
  );
};

export default CirclesTableActions;
