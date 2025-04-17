
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { RoleData, Employee } from "@/types";
import CircleLeaderInfo from "./sidebar/CircleLeaderInfo";
import CircleRole from "./sidebar/CircleRole";
import { useCircleRoles } from "@/hooks/useCircleRoles";

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
  // Use the custom hook to get processed circle roles data
  const { rolesWithParticipants, leaderName, leaderFte } = useCircleRoles(
    circleName, 
    rolesData, 
    employees
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pr-8">
          <SheetTitle className="text-xl">{circleName || ""}</SheetTitle>
          <CircleLeaderInfo leaderName={leaderName} leaderFte={leaderFte} />
          <SheetDescription>
            Роли в этом круге ({rolesWithParticipants.length})
          </SheetDescription>
        </SheetHeader>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть</span>
        </SheetClose>
        
        <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
          <div className="space-y-1 pr-4">
            {rolesWithParticipants.length > 0 ? (
              <ul className="space-y-6">
                {rolesWithParticipants.map((role, index) => (
                  <CircleRole
                    key={index}
                    index={index}
                    roleName={role.roleName}
                    participants={role.participants}
                    standardSalary={role.standardSalary}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">В этом круге нет определенных ролей</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CircleRolesSidebar;
