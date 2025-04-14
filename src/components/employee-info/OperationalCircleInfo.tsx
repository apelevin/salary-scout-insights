
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
  const functionalType = employee.operationalCircleType || "";
  
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

  // Add debug logging to see what values we're using for the lookup
  console.log("Leadership data for employee:", {
    employeeName: employee.name,
    functionalType,
    circleCount,
    leadershipDataLength: leadershipData?.length || 0,
    foundSalary: standardSalary,
    leadershipTypes: leadershipData?.map(d => `${d.leadershipType} (${d.circleCount})`)?.slice(0, 10)
  });

  // Format functional type display value
  const displayFunctionalType = functionalType || "Не указано";

  // Debug information about circles data
  const circlesDebugInfo = circlesData?.length > 0 ? (
    <div className="mt-4 p-3 bg-gray-50 rounded-md">
      <div className="font-medium mb-1 text-sm text-blue-600">Отладочная информация:</div>
      <div className="max-h-60 overflow-y-auto text-xs">
        <div className="mb-2 text-gray-700">Всего кругов: {circlesData.length}</div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1">Название круга</th>
              <th className="p-1">Функциональная принадлежность</th>
            </tr>
          </thead>
          <tbody>
            {circlesData.map((circle, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-1 border-t border-gray-200">{circle.name}</td>
                <td className="p-1 border-t border-gray-200">{circle.functionalType || "Не указано"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : null;

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
        
        {circlesDebugInfo}
      </CardContent>
    </Card>
  );
};
