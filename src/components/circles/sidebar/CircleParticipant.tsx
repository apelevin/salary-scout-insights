
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
    <li key={index} className="hover:bg-gray-100 rounded-sm px-1 py-1">
      <div className="flex justify-between items-center">
        <span>{name}</span>
        <span className="text-gray-500 font-mono">
          FTE: {formatFTE(fte)}
        </span>
      </div>
      {standardIncome && standardIncome > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          Стандартный доход: {formatSalary(standardIncome)}
        </div>
      )}
      {actualIncome && (
        <div className="text-xs text-gray-600 mt-1">
          Текущий доход: {actualIncome}
        </div>
      )}
    </li>
  );
};

export default CircleParticipant;
