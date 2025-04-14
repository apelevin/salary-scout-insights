
import { Table, TableBody } from "@/components/ui/table";
import { CircleData } from "@/types";
import CirclesTableHeader from "@/components/circles/CirclesTableHeader";
import CircleRow from "@/components/circles/CircleRow";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import CirclesTableActions from "@/components/circles/CirclesTableActions";

interface CirclesTableProps {
  circlesData: CircleData[];
  isLoading?: boolean;
}

const CirclesTable = ({ 
  circlesData = [], 
  isLoading = false
}: CirclesTableProps) => {
  
  if (isLoading) {
    return <LoadingState>Загрузка кругов...</LoadingState>;
  }

  if (circlesData.length === 0) {
    return <EmptyState 
      icon="CircleOff" 
      title="Нет доступных кругов" 
      description="Загрузите файл с данными о кругах, чтобы увидеть информацию."
    />;
  }

  // Sort circles by name for consistent display
  const sortedCircles = [...circlesData].sort((a, b) => 
    a.name.localeCompare(b.name, "ru")
  );

  return (
    <div className="w-full">
      <CirclesTableActions circlesCount={sortedCircles.length} />
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <CirclesTableHeader />
          <TableBody>
            {sortedCircles.map((circle, index) => (
              <CircleRow
                key={index}
                index={index}
                circleName={circle.name}
                functionalType={circle.functionalType}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CirclesTable;
