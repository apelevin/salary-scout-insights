
import React from "react";
import { formatFTE, formatSalary } from "@/utils/formatUtils";

interface CircleParticipantProps {
  name: string;
  fte: number;
  standardIncome?: number;
  actualIncome?: string;
  index: number;
}

const CircleParticipant: React.FC<CircleParticipantProps> = ({
  name,
  fte,
  standardIncome,
  actualIncome,
  index
}) => {
  return (
    <li className="hover:bg-gray-50 rounded-md px-3 py-2 transition-colors">
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        <span className="text-gray-500 font-mono text-sm">
          FTE: {formatFTE(fte)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-1.5 text-xs">
        {standardIncome && standardIncome > 0 && (
          <div className="text-gray-500">
            Стандартный: {formatSalary(standardIncome)}
          </div>
        )}
        {actualIncome && (
          <div className="text-gray-600">
            Текущий: {actualIncome}
          </div>
        )}
      </div>
    </li>
  );
};

export default CircleParticipant;
