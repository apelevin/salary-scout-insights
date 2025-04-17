
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
    <li key={index} className="px-2 py-2 rounded-md border border-gray-100">
      <div className="font-medium">
        {roleName}
        {standardSalary > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            Стандартный оклад: {formatSalary(standardSalary)}
          </div>
        )}
      </div>
      <ul className="pl-4 mt-2 text-sm text-gray-600 space-y-2">
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
