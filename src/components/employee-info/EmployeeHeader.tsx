
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { formatName } from "@/utils/formatUtils";
import { Employee, EmployeeWithRoles } from "@/types";

interface EmployeeHeaderProps {
  employee: Employee | EmployeeWithRoles;
  incognitoMode?: boolean;
}

export const EmployeeHeader = ({ employee, incognitoMode = false }: EmployeeHeaderProps) => {
  const nameParts = formatName(employee.name).split(' ');
  const lastName = nameParts[0];
  const firstName = nameParts.length > 1 ? nameParts[1] : '';
  
  // If incognito mode is active, replace names with the special character
  const displayLastName = incognitoMode ? '░░░░░' : lastName;
  const displayFirstName = incognitoMode ? '░░░░░' : firstName;
  
  return (
    <SheetHeader className="pb-4">
      <SheetTitle className="text-2xl flex items-center gap-2">
        <User className="h-6 w-6 text-blue-500" />
        {displayLastName} {displayFirstName}
      </SheetTitle>
      <SheetDescription>
        Подробная информация о сотруднике
      </SheetDescription>
    </SheetHeader>
  );
};
