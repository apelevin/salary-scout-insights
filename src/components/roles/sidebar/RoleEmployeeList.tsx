
import { Users } from "lucide-react";
import { formatName, formatSalary, formatNameIncognito } from "@/utils/formatUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RoleEmployeeData {
  name: string;
  salary: number;
  fte: number;
  contribution: number;
}

interface RoleEmployeeListProps {
  employeesWithRole: RoleEmployeeData[];
  totalRoleCost: number;
  incognitoMode?: boolean;
}

const RoleEmployeeList = ({ 
  employeesWithRole, 
  totalRoleCost,
  incognitoMode = false 
}: RoleEmployeeListProps) => {
  // Sort employees by salary (ascending order)
  const sortedEmployees = [...employeesWithRole].sort((a, b) => a.salary - b.salary);

  return (
    <div data-testid="role-employee-list">
      <div className="flex items-center my-4">
        <Users className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-base font-medium">Сотрудники с ролью ({employeesWithRole.length})</h3>
      </div>
      
      {sortedEmployees && sortedEmployees.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя Фамилия</TableHead>
                <TableHead className="text-right">Оклад</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEmployees.map((employee, index) => (
                <TableRow key={`${employee.name}-${index}`}>
                  <TableCell>{formatNameIncognito(employee.name, incognitoMode)}</TableCell>
                  <TableCell className="text-right">
                    {!incognitoMode ? formatSalary(employee.salary) : '***'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 border border-dashed border-gray-200 rounded-md">
          Нет сотрудников с данной ролью
        </div>
      )}
    </div>
  );
};

export default RoleEmployeeList;
