
import { ScrollArea } from "@/components/ui/scroll-area";
import RoleCard from "./RoleCard";

interface Participant {
  name: string;
  fte: number;
  standardIncome?: number;
}

interface RoleWithParticipants {
  roleName: string;
  participants: Participant[];
  standardSalary: number;
}

interface RolesListProps {
  roles: RoleWithParticipants[];
}

const RolesList = ({ roles }: RolesListProps) => {
  return (
    <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
      <div className="space-y-1 pr-4">
        {roles.length > 0 ? (
          <ul className="space-y-6">
            {roles.map((role, index) => (
              <RoleCard
                key={index}
                roleName={role.roleName}
                standardSalary={role.standardSalary}
                participants={role.participants}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">В этом круге нет определенных ролей</p>
        )}
      </div>
    </ScrollArea>
  );
};

export default RolesList;
