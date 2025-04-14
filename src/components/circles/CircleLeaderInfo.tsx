
import React from "react";
import { Award } from "lucide-react";

interface CircleLeaderInfoProps {
  circleLeader: string | undefined;
}

const CircleLeaderInfo: React.FC<CircleLeaderInfoProps> = ({ circleLeader }) => {
  if (!circleLeader) return null;
  
  return (
    <div className="flex items-center mb-4 p-3 bg-muted rounded-md">
      <Award className="h-5 w-5 text-blue-500 mr-2" />
      <div>
        <span className="text-sm text-muted-foreground">Лидер круга:</span>
        <h4 className="font-medium">{circleLeader}</h4>
      </div>
    </div>
  );
};

export default CircleLeaderInfo;
