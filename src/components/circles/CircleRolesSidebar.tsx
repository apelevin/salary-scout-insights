
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
import { cleanRoleName } from "@/utils/formatUtils";

interface CircleRolesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  circleName: string | null;
  rolesData: RoleData[];
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

  // Get unique role names
  const uniqueRoleNames = Array.from(
    new Set(circleRoles.map(role => cleanRoleName(role.roleName)))
  ).sort((a, b) => a.localeCompare(b, "ru"));

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pr-8">
          <SheetTitle className="text-xl">{circleName || ""}</SheetTitle>
          <SheetDescription>
            Роли в этом круге ({uniqueRoleNames.length})
          </SheetDescription>
        </SheetHeader>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть</span>
        </SheetClose>
        
        <div className="mt-6 space-y-1">
          {uniqueRoleNames.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {uniqueRoleNames.map((roleName, index) => (
                <li key={index} className="px-2 py-1 rounded-md hover:bg-gray-100">
                  {roleName}
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
