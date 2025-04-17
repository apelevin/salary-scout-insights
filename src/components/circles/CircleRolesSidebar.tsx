
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleData } from "@/types";
import { cleanRoleName, formatName } from "@/utils/formatUtils";

interface CircleRolesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  circleName: string | null;
  rolesData: RoleData[];
}

interface RoleWithParticipant {
  roleName: string;
  participants: string[];
}

const CircleRolesSidebar = ({
  isOpen,
  onClose,
  circleName,
  rolesData
}: CircleRolesSidebarProps) => {
  // Filter roles that belong to the selected circle
  const circleRoles = rolesData.filter(role => {
    return role.circleName && 
           role.circleName.replace(/["']/g, '').trim() === circleName;
  });

  // Group roles by name and collect participants for each role
  const roleMap = new Map<string, string[]>();
  
  circleRoles.forEach(role => {
    const cleanedRoleName = cleanRoleName(role.roleName);
    const participantName = formatName(role.participantName);
    
    if (roleMap.has(cleanedRoleName)) {
      const participants = roleMap.get(cleanedRoleName) || [];
      if (!participants.includes(participantName)) {
        participants.push(participantName);
      }
      roleMap.set(cleanedRoleName, participants);
    } else {
      roleMap.set(cleanedRoleName, [participantName]);
    }
  });

  // Convert map to array and sort by role name
  const rolesWithParticipants: RoleWithParticipant[] = Array.from(roleMap.entries())
    .map(([roleName, participants]) => ({
      roleName,
      participants: participants.sort((a, b) => a.localeCompare(b, "ru"))
    }))
    .sort((a, b) => a.roleName.localeCompare(b.roleName, "ru"));

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pr-8">
          <SheetTitle className="text-xl">{circleName || ""}</SheetTitle>
          <SheetDescription>
            Роли в этом круге ({rolesWithParticipants.length})
          </SheetDescription>
        </SheetHeader>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть</span>
        </SheetClose>
        
        <div className="mt-6 space-y-1">
          {rolesWithParticipants.length > 0 ? (
            <ul className="space-y-4">
              {rolesWithParticipants.map((role, index) => (
                <li key={index} className="px-2 py-1 rounded-md">
                  <div className="font-medium">{role.roleName}</div>
                  <ul className="pl-4 mt-1 text-sm text-gray-600 space-y-1">
                    {role.participants.map((participant, idx) => (
                      <li key={idx} className="hover:bg-gray-100 rounded-sm px-1">
                        {participant}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">В этом круге нет определенных ролей</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleRolesSidebar;
