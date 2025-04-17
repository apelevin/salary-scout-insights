
import React from "react";
import { formatFTE } from "@/utils/formatUtils";

interface CircleLeaderInfoProps {
  leaderName: string | null;
  leaderFte: number;
}

const CircleLeaderInfo: React.FC<CircleLeaderInfoProps> = ({ leaderName, leaderFte }) => {
  if (!leaderName) {
    return null;
  }

  return (
    <div className="text-base text-gray-600">
      Лидер: {leaderName}
      <span className="ml-2 text-gray-500 font-mono">
        FTE: {formatFTE(leaderFte)}
      </span>
    </div>
  );
};

export default CircleLeaderInfo;
