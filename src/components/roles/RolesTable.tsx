
import { Table, TableBody } from "@/components/ui/table";
import { RoleData, Employee } from "@/types";
import { formatSalary } from "@/utils/formatUtils";
import RoleRow from "@/components/roles/RoleRow";
import RolesTableHeader from "@/components/roles/RolesTableHeader";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import TableActions from "@/components/roles/TableActions";
import { useRolesData } from "@/hooks/useRolesData";

interface RolesTableProps {
  rolesData: RoleData[];
  isLoading?: boolean;
  employees?: Employee[];
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
  incognitoMode?: boolean;
  customStandardSalaries?: Map<string, number>;
}

const RolesTable = ({ 
  rolesData = [], 
  isLoading = false,
  employees = [],
  onStandardSalaryChange,
  incognitoMode = false,
  customStandardSalaries = new Map()
}: RolesTableProps) => {
  const { roles } = useRolesData(rolesData, employees, customStandardSalaries);

  if (isLoading) {
    return <LoadingState>Загрузка ролей...</LoadingState>;
  }

  if (roles.length === 0) {
    return <EmptyState 
      icon="FileQuestion" 
      title="Нет доступных ролей" 
      description="Загрузите файл с данными о ролях, чтобы увидеть информацию."
    />;
  }

  return (
    <div className="w-full">
      <TableActions roles={roles} />
      <div className="border rounded-md">
        <Table>
          <RolesTableHeader />
          <TableBody>
            {roles.map((role, index) => (
              <RoleRow
                key={index}
                index={index}
                roleName={role.roleName}
                minSalary={role.minSalary}
                maxSalary={role.maxSalary}
                standardSalary={role.standardSalary}
                salaries={role.salaries}
                formatSalary={formatSalary}
                onStandardSalaryChange={onStandardSalaryChange}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RolesTable;
