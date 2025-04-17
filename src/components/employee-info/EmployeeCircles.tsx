
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { EmployeeWithRoles, RoleData } from "@/types";

interface EmployeeCirclesProps {
  employee: EmployeeWithRoles;
  rolesData: RoleData[];
}

export const EmployeeCircles = ({ employee, rolesData }: EmployeeCirclesProps) => {
  // Find all unique circles the employee belongs to
  const employeeCircles = rolesData
    .filter(role => {
      const participantNameParts = role.participantName
        .replace(/["']/g, '')
        .trim()
        .split(/\s+/)
        .map(part => part.toLowerCase());
      
      if (participantNameParts.length < 2) return false;
        
      const lastName = participantNameParts[0];
      const firstName = participantNameParts[1];
      
      const empNameParts = employee.name
        .replace(/["']/g, '')
        .trim()
        .split(/\s+/)
        .map(part => part.toLowerCase());
      
      return empNameParts.some(part => part === lastName) && 
             empNameParts.some(part => part === firstName);
    })
    .filter(role => role.circleName) // Only include roles with circle info
    .map(role => role.circleName!.replace(/["']/g, '').trim())
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  // If no circles found, don't display this section
  if (employeeCircles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleAlert className="h-5 w-5 text-blue-500" />
          Круги
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Количество кругов:</span>
            <span className="font-medium">{employeeCircles.length}</span>
          </div>
          <div className="mt-2">
            <span className="text-gray-500">Участие в кругах:</span>
            <ul className="mt-1 pl-1">
              {employeeCircles.map((circle, index) => (
                <li key={index} className="text-sm py-1">
                  {circle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
