
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CircleIcon } from "lucide-react";
import { Employee, EmployeeWithRoles, RoleData, CircleData } from "@/types";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";

interface EmployeeCirclesProps {
  employee: Employee | EmployeeWithRoles;
  rolesData: RoleData[];
  circlesData: CircleData[];
}

export const EmployeeCircles = ({ 
  employee, 
  rolesData,
  circlesData 
}: EmployeeCirclesProps) => {
  const { circles } = useEmployeeDetails(employee, rolesData, circlesData);
  
  if (circles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleIcon className="h-5 w-5 text-indigo-500" />
          Круги
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Количество кругов:</span>
            <span className="font-medium">{circles.length}</span>
          </div>
          
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-2">Список кругов:</h4>
            <ul className="space-y-1">
              {circles.map((circle, index) => (
                <li key={index} className="px-3 py-2 bg-gray-50 rounded-md text-sm">
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
