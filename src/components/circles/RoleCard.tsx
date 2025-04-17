
import { formatSalary } from "@/utils/formatUtils";
import RoleParticipants from "./RoleParticipants";

interface Participant {
  name: string;
  fte: number;
  standardIncome?: number;
}

interface RoleCardProps {
  roleName: string;
  standardSalary: number;
  participants: Participant[];
}

const RoleCard = ({ roleName, standardSalary, participants }: RoleCardProps) => {
  return (
    <li className="px-2 py-2 rounded-md border border-gray-100">
      <div className="font-medium">
        {roleName}
        {standardSalary > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            Стандартный оклад: {formatSalary(standardSalary)}
          </div>
        )}
      </div>
      <RoleParticipants participants={participants} />
    </li>
  );
};

export default RoleCard;
