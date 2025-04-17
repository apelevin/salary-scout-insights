
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { cleanFunctionalType } from "@/utils/formatUtils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Employee, RoleData } from "@/types";
import { formatName } from "@/utils/formatUtils";

interface CircleRowProps {
  index: number;
  circleName: string;
  functionalType: string;
  rolesData?: RoleData[];
  employees?: Employee[];
}

const CircleRow = ({ 
  index, 
  circleName, 
  functionalType,
  rolesData = [],
  employees = []
}: CircleRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Очищаем название круга и функционального типа от кавычек
  const cleanCircleName = circleName.replace(/["']/g, '').trim();
  
  // Находим сотрудников, которые работают в этом круге
  const circleEmployees = employees.filter(employee => {
    // Проверяем есть ли у сотрудника роль в этом круге
    return rolesData.some(role => {
      const roleCircleName = role.circleName?.replace(/["']/g, '').trim() || '';
      const employeeName = role.participantName?.replace(/["']/g, '').trim() || '';
      const normalizedName = employee.name.replace(/["']/g, '').trim();
      
      return roleCircleName === cleanCircleName && 
             employeeName.toLowerCase().includes(normalizedName.toLowerCase());
    });
  });
  
  // Используем Set для исключения дубликатов
  const uniqueEmployees = Array.from(
    new Map(circleEmployees.map(emp => [emp.name, emp])).values()
  );

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell>
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <CollapsibleTrigger className="flex items-center text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
              {cleanCircleName}
              {isOpen ? 
                <ChevronUp className="h-4 w-4 ml-1" /> : 
                <ChevronDown className="h-4 w-4 ml-1" />
              }
            </CollapsibleTrigger>
          </Collapsible>
        </TableCell>
        <TableCell>{cleanFunctionalType(functionalType)}</TableCell>
      </TableRow>
      
      {isOpen && uniqueEmployees.length > 0 && (
        <TableRow>
          <TableCell colSpan={3}>
            <Collapsible open={isOpen} className="w-full border-l-2 border-blue-200 pl-4 ml-4 mt-1 mb-2">
              <CollapsibleContent>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Сотрудники в круге ({uniqueEmployees.length}):</p>
                  <ul className="space-y-1">
                    {uniqueEmployees.map((employee, idx) => (
                      <li key={idx} className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-gray-400" />
                        {formatName(employee.name)}
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default CircleRow;
