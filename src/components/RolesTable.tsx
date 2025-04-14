
import { useState } from "react";
import { RoleData } from "@/types";
import { Employee } from "@/types";
import { useRolesData } from "@/hooks/useRolesData";
import LoadingState from "@/components/roles/LoadingState";
import EmptyState from "@/components/roles/EmptyState";
import RoleDetailSidebar from "@/components/roles/RoleDetailSidebar";
import RolesList from "@/components/roles/RolesList";
import RolesSummary from "@/components/roles/RolesSummary";
import RolesExportButton from "@/components/roles/RolesExportButton";

interface RolesTableProps {
  rolesData: RoleData[];
  isLoading?: boolean;
  employees?: Employee[];
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
  incognitoMode?: boolean;
}

const RolesTable = ({ 
  rolesData = [], 
  isLoading = false,
  employees = [],
  onStandardSalaryChange,
  incognitoMode = false
}: RolesTableProps) => {
  const { roles } = useRolesData(rolesData, employees);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <RolesSummary count={roles.length} />
        <RolesExportButton roles={roles} />
      </div>
      
      <RolesList 
        roles={roles}
        onStandardSalaryChange={onStandardSalaryChange}
        onRoleClick={handleRoleClick}
      />
      
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
