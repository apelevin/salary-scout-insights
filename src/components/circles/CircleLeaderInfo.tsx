
import React from "react";
import { formatName } from "@/utils/formatUtils";
import { Crown } from "lucide-react";

interface CircleLeaderInfoProps {
  circleLeader: string | undefined;
  incognitoMode?: boolean;
}

const CircleLeaderInfo: React.FC<CircleLeaderInfoProps> = ({ 
  circleLeader,
  incognitoMode = false
}) => {
  return (
    <div className="flex items-center mb-4">
      <Crown className="h-5 w-5 text-amber-400 mr-2" />
      <h3 className="text-base font-medium">
        Лидер круга: {" "}
        <span className="font-normal">
          {circleLeader 
            ? (incognitoMode ? '░░░░░ ░░░░░' : formatName(circleLeader))
            : "Не назначен"}
        </span>
      </h3>
    </div>
  );
};

export default CircleLeaderInfo;
