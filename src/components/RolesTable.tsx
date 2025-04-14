
import { useState, useEffect } from "react";
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
  const { roles: initialRoles } = useRolesData(rolesData, employees);
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update local roles state when initialRoles change
  useEffect(() => {
    setRoles(initialRoles);
  }, [initialRoles]);

  // Calculate roles with alert status
  const alertRoles = roles.filter(role => {
    return (
      role.standardSalary === 0 || 
      role.salaries.length === 0 ||
      role.maxSalary - role.minSalary > 10000  // Large salary disparity
    );
  });

  const handleRoleClick = (roleName: string) => {
    setSelectedRole(roleName);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedRole(null);
  };

  const handleStandardSalaryChange = (roleName: string, newStandardSalary: number) => {
    // Update local state immediately
    setRoles(prevRoles => 
      prevRoles.map(role => 
        role.roleName === roleName 
          ? { ...role, standardSalary: newStandardSalary }
          : role
      )
    );
    
    // Call the parent handler if provided
    if (onStandardSalaryChange) {
      onStandardSalaryChange(roleName, newStandardSalary);
    }
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

  const selectedRoleData = selectedRole ? 
    roles.find(role => role.roleName === selectedRole) : null;
  
  const selectedRoleStandardSalary = selectedRoleData?.standardSalary || 0;
  const selectedRoleMinSalary = selectedRoleData?.minSalary || 0;
  const selectedRoleMaxSalary = selectedRoleData?.maxSalary || 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <RolesSummary 
          count={roles.length} 
          alertCount={alertRoles.length}
        />
        <RolesExportButton roles={roles} />
      </div>
      
      <RolesList 
        roles={roles}
        onStandardSalaryChange={handleStandardSalaryChange}
        onRoleClick={handleRoleClick}
      />
      
      <RoleDetailSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        roleName={selectedRole}
        employees={employees}
        rolesData={rolesData}
        standardSalary={selectedRoleStandardSalary}
        minSalary={selectedRoleMinSalary}
        maxSalary={selectedRoleMaxSalary}
        incognitoMode={incognitoMode}
      />
    </div>
  );
};

export default RolesTable;
