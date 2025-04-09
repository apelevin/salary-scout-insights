
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { LeadershipData } from "@/types";
import LeadershipTableHeader from "./LeadershipTableHeader";
import LeadershipTableRow from "./LeadershipTableRow";
import EmptyState from "../roles/EmptyState";
import LoadingState from "../roles/LoadingState";

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
        <LeadershipTableHeader />
        <TableBody>
          {leadershipData.map((item, index) => (
            <LeadershipTableRow 
              key={`${item.roleName}-${index}`}
              roleName={item.roleName}
              standardSalary={item.standardSalary}
              description={item.description}
              formatSalary={formatSalary}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadershipTable;
