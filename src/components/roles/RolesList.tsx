
import { Table, TableBody } from "@/components/ui/table";
import { formatSalary } from "@/utils/formatUtils";
import RoleRow from "@/components/roles/RoleRow";
import RolesTableHeader from "@/components/roles/RolesTableHeader";

interface RolesListProps {
  roles: Array<{
    roleName: string;
    minSalary: number;
    maxSalary: number;
    standardSalary: number;
    salaries: number[];
  }>;
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
  onRoleClick?: (roleName: string) => void;
}

const RolesList = ({ 
  roles, 
  onStandardSalaryChange,
  onRoleClick 
}: RolesListProps) => {
  return (
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
              onRoleClick={onRoleClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RolesList;
