
import { useState } from "react";
import { ChevronDown, ChevronUp, User, Users } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/accordion";
import { formatName } from "@/utils/formatUtils";
import { RoleData } from "@/types";

interface CircleEmployeesListProps {
  circleName: string;
  rolesData: RoleData[];
}

const CircleEmployeesList = ({ circleName, rolesData }: CircleEmployeesListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Найдем всех сотрудников, связанных с этим кругом
  const circleEmployees = rolesData
    .filter(role => role.circleName?.toLowerCase() === circleName.toLowerCase())
    .map(role => role.participantName)
    .filter((name): name is string => !!name);

  // Удалим дубликаты имен
  const uniqueEmployees = Array.from(new Set(circleEmployees))
    .sort((a, b) => formatName(a).localeCompare(formatName(b), "ru"));

  if (uniqueEmployees.length === 0) {
    return (
      <div className="text-sm text-muted-foreground ml-2">
        Нет сотрудников в этом круге
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger className="flex items-center text-sm text-blue-600 hover:text-blue-800 gap-1 ml-2">
        <Users className="h-4 w-4" />
        <span>{uniqueEmployees.length} сотрудников</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1 ml-4 border-l-2 pl-2 border-blue-100">
        {uniqueEmployees.map((employee, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <User className="h-3 w-3 text-gray-500" />
            {formatName(employee)}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CircleEmployeesList;
