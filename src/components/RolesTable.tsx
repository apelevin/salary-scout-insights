
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleData } from "@/types";

interface RolesTableProps {
  rolesData: RoleData[];
  isLoading?: boolean;
}

const RolesTable = ({ rolesData = [], isLoading = false }: RolesTableProps) => {
  // Get unique role names and sort them in ascending alphabetical order
  const uniqueRoles = [...new Set(rolesData.map((role) => {
    // Clean the role name by removing quotes and other special characters
    return role.roleName.replace(/['"]/g, '').trim();
  }))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  if (isLoading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-500">
          Загрузка данных...
        </div>
      </div>
    );
  }

  if (uniqueRoles.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="text-lg text-gray-500">
          Нет доступных ролей. Загрузите файл с данными о ролях.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Название роли</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueRoles.map((role, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500 mt-3">
        Всего ролей: {uniqueRoles.length}
      </div>
    </div>
  );
};

export default RolesTable;
