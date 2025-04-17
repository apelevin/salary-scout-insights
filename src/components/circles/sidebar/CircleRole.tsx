
import React from "react";
import CircleParticipant from "./CircleParticipant";
import { formatSalary } from "@/utils/formatUtils";

interface RoleParticipant {
  name: string;
  fte: number;
  standardIncome?: number;
  actualIncome?: string;
}

interface CircleRoleProps {
  roleName: string;
  participants: RoleParticipant[];
  standardSalary: number;
  index: number;
}

const CircleRole: React.FC<CircleRoleProps> = ({
  roleName,
  participants,
  standardSalary,
  index
}) => {
  return (
    <li key={index} className="p-4 rounded-md border border-gray-100 shadow-sm bg-white">
      <div className="font-medium text-base">
        {roleName}
        {standardSalary > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            Стандартный оклад: {formatSalary(standardSalary)}
          </div>
        )}
      </div>
      <ul className="pl-4 mt-3 space-y-3">
        {participants.map((participant, idx) => (
          <CircleParticipant
            key={idx}
            index={idx}
            name={participant.name}
            fte={participant.fte}
            standardIncome={participant.standardIncome}
            actualIncome={participant.actualIncome}
          />
        ))}
      </ul>
    </li>
  );
};

export default CircleRole;
