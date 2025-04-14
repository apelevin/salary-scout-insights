
import { Table, TableBody } from "@/components/ui/table";
import { LeadershipData } from "@/types";
import LeadershipTableHeader from "./LeadershipTableHeader";
import LeadershipTableRow from "./LeadershipTableRow";
import EmptyState from "../roles/EmptyState";
import LoadingState from "../roles/LoadingState";
import { transformLeadershipData } from "@/utils/leadershipParser";
import { useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface LeadershipTableProps {
  leadershipData: LeadershipData[];
  isLoading: boolean;
  onLeadershipDataChange?: (updatedData: LeadershipData[]) => void;
  incognitoMode?: boolean;
}

const LeadershipTable = ({ 
  leadershipData, 
  isLoading,
  onLeadershipDataChange,
  incognitoMode = false
}: LeadershipTableProps) => {
  const [localLeadershipData, setLocalLeadershipData] = useState<LeadershipData[]>(leadershipData);

  const currentData = onLeadershipDataChange ? leadershipData : localLeadershipData;
  
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(salary);
  };
  
  const { tableData, uniqueCircleCounts } = useMemo(() => {
    const transformedData = transformLeadershipData(currentData);
    
    const allCircleCounts = new Set<string>();
    transformedData.forEach(item => {
      item.circleSalaries.forEach((_, count) => {
        allCircleCounts.add(count);
      });
    });
    
    const uniqueCounts = Array.from(allCircleCounts).sort((a, b) => parseInt(a) - parseInt(b));
    
    return {
      tableData: transformedData,
      uniqueCircleCounts: uniqueCounts
    };
  }, [currentData]);
  
  const handleSalaryChange = (leadershipType: string, circleCount: string, newSalary: number) => {
    const updatedData = currentData.map(item => {
      if (item.leadershipType === leadershipType && item.circleCount === circleCount) {
        return {
          ...item,
          standardSalary: newSalary
        };
      }
      return item;
    });
    
    const entryExists = updatedData.some(
      item => item.leadershipType === leadershipType && item.circleCount === circleCount
    );
    
    if (!entryExists) {
      updatedData.push({
        roleName: `${leadershipType} (${circleCount})`,
        standardSalary: newSalary,
        leadershipType: leadershipType,
        circleCount: circleCount
      });
    }
    
    if (onLeadershipDataChange) {
      onLeadershipDataChange(updatedData);
    } else {
      setLocalLeadershipData(updatedData);
    }
    
    toast({
      title: "Значение обновлено",
      description: `Оклад для ${leadershipType} с ${circleCount} кругами: ${formatSalary(newSalary)}`,
    });
  };
  
  if (isLoading) {
    return <LoadingState>Загрузка данных о лидерстве...</LoadingState>;
  }

  if (currentData.length === 0) {
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
              onSalaryChange={handleSalaryChange}
              incognitoMode={incognitoMode}
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
