
import React from "react";
import { formatFTE } from "@/utils/formatUtils";
import { User } from "lucide-react";

interface CircleLeaderInfoProps {
  leaderName: string | null;
  leaderFte: number;
}

const CircleLeaderInfo: React.FC<CircleLeaderInfoProps> = ({ leaderName, leaderFte }) => {
  if (!leaderName) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm mt-1">
      <User className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">
        {leaderName}
      </span>
      <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
        FTE: {formatFTE(leaderFte)}
      </span>
    </div>
  );
};

export default CircleLeaderInfo;
