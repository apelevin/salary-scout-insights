
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import { formatSalary } from "@/utils/formatUtils";
import { EmployeeWithRoles } from "@/types";

interface SalaryDifferenceCardProps {
  employees: EmployeeWithRoles[];
}

const SalaryDifferenceCard = ({ employees }: SalaryDifferenceCardProps) => {
  // Calculate total difference for all employees with valid standard salary
  // using Salary - StandardSalary
  const totalDifference = employees
    .filter(emp => emp.standardSalary && emp.standardSalary > 0)
    .reduce((acc, emp) => acc + (emp.salary - emp.standardSalary), 0);

  const isPositive = totalDifference >= 0;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-blue-500" />
          Суммарная разница зарплат
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {formatSalary(totalDifference)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {isPositive 
            ? "Общий избыток бюджета на зарплаты" 
            : "Общая экономия бюджета на зарплаты"}
        </p>
      </CardContent>
    </Card>
  );
};

export default SalaryDifferenceCard;
