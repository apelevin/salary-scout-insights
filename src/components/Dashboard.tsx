
import { Card, CardContent } from "@/components/ui/card";
import { Employee } from "@/types";
import { TrendingDown, TrendingUp } from "lucide-react";

interface DashboardProps {
  employees: Employee[];
  isLoading: boolean;
}

const Dashboard = ({ employees, isLoading }: DashboardProps) => {
  // Подсчет сотрудников с зарплатой выше или ниже стандартной
  const getEmployeeStats = () => {
    if (!employees.length) return { aboveStandard: 0, belowStandard: 0 };

    return employees.reduce(
      (acc, employee) => {
        // Учитываем только сотрудников, у которых есть стандартная зарплата
        if (employee.standardSalary && employee.standardSalary > 0) {
          if (employee.salary > employee.standardSalary) {
            acc.aboveStandard += 1;
          } else if (employee.salary < employee.standardSalary) {
            acc.belowStandard += 1;
          }
        }
        return acc;
      },
      { aboveStandard: 0, belowStandard: 0 }
    );
  };

  const stats = getEmployeeStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-pulse">
        <Card className="bg-gray-100 h-36" />
        <Card className="bg-gray-100 h-36" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Зарплата ниже стандартной
            </p>
            <h3 className="text-2xl font-bold mt-2">{stats.belowStandard}</h3>
            <p className="text-sm text-gray-500 mt-1">сотрудников</p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Зарплата выше стандартной
            </p>
            <h3 className="text-2xl font-bold mt-2">{stats.aboveStandard}</h3>
            <p className="text-sm text-gray-500 mt-1">сотрудников</p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
