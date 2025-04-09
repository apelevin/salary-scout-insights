
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

interface RolesTableProps {
  rolesData: RoleData[];
  isLoading?: boolean;
  employees?: Employee[];
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
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
  onStandardSalaryChange
}: RolesTableProps) => {
  const [roles, setRoles] = useState<RoleWithSalaries[]>([]);

  // Constants for the circle leader role names
  const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
  const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
  const GENERIC_LEADER_ROLE = "лидер";
  const NORMALIZED_LEADER_ROLE = "Лидер"; // Capitalized version for display
  
  const findSalariesForRole = (roleName: string): number[] => {
    if (!roleName || !rolesData.length || !employees.length) return [];
    
    const salaries: number[] = [];
    const normalizedRoleName = roleName.toLowerCase();
    
    // Check if this is the unified leader role
    const isLeaderRole = normalizedRoleName === NORMALIZED_LEADER_ROLE.toLowerCase();
    
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      let matchesRole = false;
      const entryRoleName = entry.roleName.toLowerCase();
      
      if (isLeaderRole) {
        // For leader role, match any of the leader role variants
        matchesRole = entryRoleName === GENERIC_LEADER_ROLE.toLowerCase() || 
                      entryRoleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
                      entryRoleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase());
      } else {
        // For other roles, use normal matching
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
    // Step 1: First extract all roles and normalize them
    const allRoles = rolesData.map((role) => {
      // Check if the role is a leader role and normalize it
      const roleName = role.roleName.toLowerCase();
      if (
        roleName === GENERIC_LEADER_ROLE.toLowerCase() || 
        roleName.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
        roleName.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase())
      ) {
        return NORMALIZED_LEADER_ROLE; // Use capitalized "Лидер"
      } else {
        return cleanRoleName(role.roleName);
      }
    }).filter(Boolean);
    
    // Step 2: Get unique roles and sort them
    const uniqueRoles = [...new Set(allRoles)]
      .filter(roleName => roleName.toLowerCase() !== 'ceo') // Filter out CEO role
      .sort((a, b) => a.localeCompare(b)); // Changed from b.localeCompare(a) to a.localeCompare(b) for ascending order

    // Step 3: Calculate salaries for each unique role
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
      <div className="text-sm text-gray-500 mt-3">
        Всего ролей: {roles.length}
      </div>
    </div>
  );
};

export default RolesTable;
