
import { useState } from "react";
import RoleSalaryEditor from "./RoleSalaryEditor";
import RoleEditButton from "./RoleEditButton";

interface RoleStandardSalaryProps {
  roleName: string;
  standardSalary: number;
  hasEmployees: boolean;
  formatSalary: (salary: number) => string;
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
}

const RoleStandardSalary = ({ 
  roleName,
  standardSalary, 
  hasEmployees,
  formatSalary,
  onStandardSalaryChange
}: RoleStandardSalaryProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!hasEmployees) {
    return <span className="text-gray-400">—</span>;
  }

  const handleSalaryChange = (role: string, value: number) => {
    if (onStandardSalaryChange) {
      onStandardSalaryChange(role, value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <RoleSalaryEditor
        roleName={roleName}
        standardSalary={standardSalary}
        formatSalary={formatSalary}
        onStandardSalaryChange={handleSalaryChange}
      />
    );
  }

  return (
    <div className="flex items-center justify-between">
      <span>{formatSalary(standardSalary)}</span>
      <RoleEditButton 
        hasEmployees={hasEmployees}
        onClick={() => setIsEditing(true)}
      />
    </div>
  );
};

export default RoleStandardSalary;
