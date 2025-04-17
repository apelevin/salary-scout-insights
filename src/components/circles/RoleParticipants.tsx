
import { formatFTE, formatSalary } from "@/utils/formatUtils";

interface Participant {
  name: string;
  fte: number;
  standardIncome?: number;
}

interface RoleParticipantsProps {
  participants: Participant[];
}

const RoleParticipants = ({ participants }: RoleParticipantsProps) => {
  return (
    <ul className="pl-4 mt-2 text-sm text-gray-600 space-y-2">
      {participants.map((participant, idx) => (
        <li key={idx} className="hover:bg-gray-100 rounded-sm px-1 py-1">
          <div className="flex justify-between items-center">
            <span>{participant.name}</span>
            <span className="text-gray-500 font-mono">
              FTE: {formatFTE(participant.fte)}
            </span>
          </div>
          {participant.standardIncome && participant.standardIncome > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Стандартный доход: {formatSalary(participant.standardIncome)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default RoleParticipants;
