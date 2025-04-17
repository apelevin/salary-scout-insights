
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { RoleData, Employee } from "@/types";
import { formatName } from "@/utils/formatUtils";
import { useRolesData } from "@/hooks/useRolesData";
import CircleLeader from "./CircleLeader";
import RolesList from "./RolesList";
import { findCircleLeader, getCircleRoles, processCircleRoles } from "./circleUtils";

interface CircleRolesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  circleName: string | null;
  rolesData: RoleData[];
  employees: Employee[];
}

const CircleRolesSidebar = ({
  isOpen,
  onClose,
  circleName,
  rolesData,
  employees
}: CircleRolesSidebarProps) => {
  // Get roles data with standard salaries
  const { roles: rolesWithSalaries } = useRolesData(rolesData, employees);

  // Find leader for this circle
  const circleLeader = findCircleLeader(rolesData, circleName);

  // Get leader name and FTE if available
  const leaderName = circleLeader ? formatName(circleLeader.participantName) : null;
  const leaderFte = circleLeader ? circleLeader.fte || 0 : 0;

  // Filter roles that belong to the selected circle (excluding leader roles)
  const circleRoles = getCircleRoles(rolesData, circleName);

  // Process roles into a grouped format with participants
  const rolesWithParticipants = processCircleRoles(circleRoles, rolesWithSalaries);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pr-8">
          <SheetTitle className="text-xl">{circleName || ""}</SheetTitle>
          <CircleLeader leaderName={leaderName} leaderFte={leaderFte} />
          <SheetDescription>
            Роли в этом круге ({rolesWithParticipants.length})
          </SheetDescription>
        </SheetHeader>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть</span>
        </SheetClose>
        
        <RolesList roles={rolesWithParticipants} />
      </SheetContent>
    </Sheet>
  );
};

export default CircleRolesSidebar;
