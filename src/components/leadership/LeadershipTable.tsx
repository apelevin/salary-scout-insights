
import { Table, TableBody } from "@/components/ui/table";
import { LeadershipData } from "@/types";
import LeadershipTableHeader from "./LeadershipTableHeader";
import LeadershipTableRow from "./LeadershipTableRow";
import EmptyState from "../roles/EmptyState";
import LoadingState from "../roles/LoadingState";
import { transformLeadershipData } from "@/utils/leadershipParser";
import { useMemo } from "react";

interface LeadershipTableProps {
  leadershipData: LeadershipData[];
  isLoading: boolean;
}

const LeadershipTable = ({ leadershipData, isLoading }: LeadershipTableProps) => {
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(salary);
  };
  
  const { tableData, uniqueCircleCounts } = useMemo(() => {
    // Transform leadership data
    const transformedData = transformLeadershipData(leadershipData);
    
    // Get unique circle counts across all leadership types
    const allCircleCounts = new Set<string>();
    transformedData.forEach(item => {
      item.circleSalaries.forEach((_, count) => {
        allCircleCounts.add(count);
      });
    });
    
    // Sort circle counts numerically
    const uniqueCounts = Array.from(allCircleCounts).sort((a, b) => parseInt(a) - parseInt(b));
    
    return {
      tableData: transformedData,
      uniqueCircleCounts: uniqueCounts
    };
  }, [leadershipData]);
  
  if (isLoading) {
    return <LoadingState>Загрузка данных о лидерстве...</LoadingState>;
  }

  if (leadershipData.length === 0) {
    return <EmptyState 
      icon="Crown"
      title="Данные о лидерстве отсутствуют"
      description="Загрузите файл с данными о лидерстве, чтобы увидеть информацию о стандартных окладах ролей."
    />;
  }

  return (
    <div>
      <Table>
        <LeadershipTableHeader circleCounts={uniqueCircleCounts} />
        <TableBody>
          {tableData.map((item, index) => (
            <LeadershipTableRow 
              key={index}
              leadershipType={item.leadershipType}
              circleSalaries={item.circleSalaries}
              circleCounts={uniqueCircleCounts}
              formatSalary={formatSalary}
            />
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-sm text-gray-500">
        Всего типов лидерства: {tableData.length}
      </div>
    </div>
  );
};

export default LeadershipTable;
