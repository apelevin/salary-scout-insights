
import { Card, CardContent } from "@/components/ui/card";
import { Employee, EmployeeWithRoles } from "@/types";

interface DashboardSummaryCardsProps {
  employees: (Employee | EmployeeWithRoles)[];
}

const DashboardSummaryCards = ({ employees }: DashboardSummaryCardsProps) => {
  const calculateTotals = () => {
    let totalPositive = 0;
    let totalNegative = 0;

    employees.forEach(employee => {
      if ('standardSalary' in employee && employee.standardSalary && employee.standardSalary > 0) {
        // Changed direction of calculation: standardSalary - salary
        const difference = employee.standardSalary - employee.salary;
        if (difference > 0) {
          totalPositive += difference;
        } else if (difference < 0) {
          totalNegative += Math.abs(difference);
        }
      }
    });

    return { totalPositive, totalNegative };
  };

  const { totalPositive, totalNegative } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Экономия по стандартной зарплате
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPositive)}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Превышение стандартной зарплаты
            </h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalNegative)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummaryCards;
