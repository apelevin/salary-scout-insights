import { useState, useEffect } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { RoleData } from "@/types";
import { Employee } from "@/types";
import { formatSalary, cleanRoleName } from "@/utils/formatUtils";
import { calculateStandardRate } from "@/utils/salaryUtils";
import RoleRow from "@/components/roles/RoleRow";
import RolesTableHeader from "@/components/roles/RolesTableHeader";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import RoleDetailSidebar from "@/components/roles/RoleDetailSidebar";

interface RolesTableProps {
  rolesData: RoleData[];
  isLoading?: boolean;
  employees?: Employee[];
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
  incognitoMode?: boolean;
}

interface RoleWithSalaries {
  roleName: string;
  minSalary: number;
  maxSalary: number;
  standardSalary: number;
  salaries: number[];
  isEditing: boolean;
  editValue: string;
}

const RolesTable = ({ 
  rolesData = [], 
  isLoading = false,
  employees = [],
  onStandardSalaryChange,
  incognitoMode = false
}: RolesTableProps) => {
  const [roles, setRoles] = useState<RoleWithSalaries[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
  const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
  const GENERIC_LEADER_ROLE = "лидер";
  const NORMALIZED_LEADER_ROLE = "Лидер";

  const findSalariesForRole = (roleName: string): number[] => {
    if (!roleName || !rolesData.length || !employees.length) return [];
    
    const salaries: number[] = [];
    const normalizedRoleName = roleName.toLowerCase();
    
    const isLeaderRole = normalizedRoleName === NORMALIZED_LEADER_ROLE.toLowerCase();
    
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      let matchesRole = false;
      const entryRoleName = entry.roleName.toLowerCase();
      
      if (isLeaderRole) {
        matchesRole = entryRoleName === GENERIC_LEADER_ROLE.toLowerCase() || 
                      entryRoleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
                      entryRoleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase());
      } else {
        const cleanedRoleName = cleanRoleName(entry.roleName).toLowerCase();
        matchesRole = cleanedRoleName === normalizedRoleName;
      }
      
      if (matchesRole) {
        const participantNameParts = entry.participantName
          .replace(/["']/g, '')
          .trim()
          .split(/\s+/)
          .map(part => part.toLowerCase());
        
        if (participantNameParts.length < 2) return;
          
        const lastName = participantNameParts[0];
        const firstName = participantNameParts[1];
        
        employees.forEach(emp => {
          const empNameParts = emp.name
            .replace(/["']/g, '')
            .trim()
            .split(/\s+/)
            .map(part => part.toLowerCase());
          
          if (
            empNameParts.some(part => part === lastName) && 
            empNameParts.some(part => part === firstName)
          ) {
            salaries.push(emp.salary);
          }
        });
      }
    });
    
    return salaries;
  };

  useEffect(() => {
    const allRoles = rolesData.map((role) => {
      const roleName = role.roleName.toLowerCase();
      if (
        roleName === GENERIC_LEADER_ROLE.toLowerCase() || 
        roleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
        roleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase())
      ) {
        return NORMALIZED_LEADER_ROLE;
      } else {
        return cleanRoleName(role.roleName);
      }
    }).filter(Boolean);
    
    const uniqueRoles = [...new Set(allRoles)]
      .filter(roleName => roleName.toLowerCase() !== 'ceo')
      .sort((a, b) => a.localeCompare(b));
    
    const rolesWithSalaries = uniqueRoles.map(role => {
      const salaries = findSalariesForRole(role);
      const minSalary = salaries.length ? Math.min(...salaries) : 0;
      const maxSalary = salaries.length ? Math.max(...salaries) : 0;
      const standardSalary = salaries.length ? calculateStandardRate(minSalary, maxSalary) : 0;
      
      return {
        roleName: role,
        minSalary,
        maxSalary,
        standardSalary,
        salaries,
        isEditing: false,
        editValue: standardSalary.toString()
      };
    });

    setRoles(rolesWithSalaries);
  }, [rolesData, employees]);

  const downloadCSV = () => {
    if (roles.length === 0) {
      toast({
        title: "Нет данных для выгрузки",
        description: "Загрузите данные о ролях, прежде чем экспортировать их в CSV.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Название роли", "Стандартный оклад"];
    
    const rows = roles.map(role => {
      const salary = role.standardSalary ? 
        role.standardSalary.toString().replace('.', ',') : 
        "0";
      return [role.roleName, salary];
    });
    
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `roles-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Экспорт завершен",
      description: `Файл со списком ${roles.length} ролей успешно скачан.`,
    });
  };

  const handleRoleClick = (roleName: string) => {
    setSelectedRole(roleName);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedRole(null);
  };

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

  const selectedRoleStandardSalary = selectedRole ? 
    roles.find(role => role.roleName === selectedRole)?.standardSalary || 0 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          Всего ролей: {roles.length}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadCSV}
          className="flex items-center gap-2"
        >
          <Download size={16} /> 
          Скачать CSV
        </Button>
      </div>
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
                onRoleClick={handleRoleClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <RoleDetailSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        roleName={selectedRole}
        employees={employees}
        rolesData={rolesData}
        standardSalary={selectedRoleStandardSalary}
        incognitoMode={incognitoMode}
      />
    </div>
  );
};

export default RolesTable;
