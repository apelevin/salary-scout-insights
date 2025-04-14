
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { EmployeeWithRoles, LeadershipData, CircleData } from "@/types";
import { cleanFunctionalType } from "@/utils/formatUtils";
import { findLeadershipStandardSalary } from "@/utils/salary";

interface OperationalCircleInfoProps {
  employee: EmployeeWithRoles;
  leadershipData: LeadershipData[];
  circlesData?: CircleData[];
}

export const OperationalCircleInfo = ({ 
  employee, 
  leadershipData, 
  circlesData = [] 
}: OperationalCircleInfoProps) => {
  // Get the total count of circles led by the employee
  const circleCount = employee.operationalCircleCount || 0;
  const rawFunctionalType = employee.operationalCircleType || "";
  const functionalType = cleanFunctionalType(rawFunctionalType);
  const leadCircles = employee.leadCircles || [];
  
  // Find the standard salary for this leadership role
  const standardSalary = findLeadershipStandardSalary(
    functionalType,
    String(circleCount),
    leadershipData
  );
  
  // Format the salary for display
  const formattedStandardSalary = standardSalary !== null 
    ? new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(standardSalary)
    : "Не определен";

  // Format functional type display value
  const displayFunctionalType = functionalType || "The others";

  // Debug logs to track data flow
  console.log("OperationalCircleInfo received data:", {
    employeeName: employee.name,
    circleCount,
    rawFunctionalType,
    functionalType,
    displayFunctionalType,
    standardSalary,
    leadCirclesCount: leadCircles?.length || 0,
    leadCircles: leadCircles?.map(c => ({ name: c.name, type: c.functionalType })) || [],
    circlesDataLength: circlesData?.length || 0
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleAlert className="h-5 w-5 text-blue-500" />
          Лидерство
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Функциональная принадлежность:</span>
            <span className="font-medium">{displayFunctionalType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Количество кругов:</span>
            <span className="font-medium">{circleCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Стандартный оклад:</span>
            <span className="font-medium">{formattedStandardSalary}</span>
          </div>
        </div>
        
        {/* Display employee's lead circles */}
        {leadCircles && leadCircles.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-2">Управляемые круги:</h4>
            <ul className="text-sm space-y-1">
              {leadCircles.map((circle, idx) => (
                <li key={idx} className="px-2 py-1 bg-blue-50 rounded flex justify-between">
                  <span>{circle.name}</span>
                  <span className="text-blue-600 text-xs">
                    {cleanFunctionalType(circle.functionalType)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
