
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { cleanRoleName } from "@/utils/formatUtils";
import { EmployeeWithRoles } from "@/types";

interface EmployeeHeaderProps {
  employee: EmployeeWithRoles;
}

export const EmployeeHeader = ({ employee }: EmployeeHeaderProps) => {
  return (
    <SheetHeader className="pb-4">
      <SheetTitle className="text-2xl flex items-center gap-2">
        <User className="h-6 w-6 text-blue-500" />
        {cleanRoleName(employee.name)}
      </SheetTitle>
      <SheetDescription>
        Подробная информация о сотруднике
      </SheetDescription>
    </SheetHeader>
  );
};
