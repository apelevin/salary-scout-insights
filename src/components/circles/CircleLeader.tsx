
import { formatFTE } from "@/utils/formatUtils";

interface CircleLeaderProps {
  leaderName: string | null;
  leaderFte: number;
}

const CircleLeader = ({ leaderName, leaderFte }: CircleLeaderProps) => {
  if (!leaderName) return null;
  
  return (
    <div className="text-sm text-gray-600">
      Лидер: {leaderName}
      <span className="ml-2 text-gray-500 font-mono">
        FTE: {formatFTE(leaderFte)}
      </span>
    </div>
  );
};

export default CircleLeader;
