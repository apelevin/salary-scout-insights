
import { BarChart } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-foreground">
            Salary Scout Insights
          </h1>
        </div>
      </div>
      <p className="mt-2 text-muted-foreground">
        Анализ зарплат сотрудников компании
      </p>
    </header>
  );
};

export default DashboardHeader;
