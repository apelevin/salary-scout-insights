
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleData } from "@/types";
import { Employee } from "@/types";
import { Edit2, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

  // Helper functions first
  const cleanRoleName = (roleName: string): string => {
    return roleName.replace(/["']/g, '').trim();
  };

  const formatSalary = (salary: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Calculate standard salary based on min and max values
  const calculateStandardSalary = (min: number, max: number): number => {
    if (min === max) {
      return max;
    }
    return min + (max - min) * 0.7;
  };

  // Function to find all salaries associated with a role
  const findSalariesForRole = (roleName: string): number[] => {
    if (!roleName || !rolesData.length || !employees.length) return [];
    
    const salaries: number[] = [];
    const normalizedRoleName = roleName.toLowerCase();
    
    // Find all employees who have this role
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      const cleanedRoleName = cleanRoleName(entry.roleName).toLowerCase();
      
      if (cleanedRoleName === normalizedRoleName) {
        // Find this participant in employees list
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

  // Initialize and update roles data
  useEffect(() => {
    // Get unique role names and sort them in descending alphabetical order
    const uniqueRoles = [...new Set(rolesData.map((role) => cleanRoleName(role.roleName)))]
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a));

    // Create roles array with salary data
    const rolesWithSalaries = uniqueRoles.map(role => {
      const salaries = findSalariesForRole(role);
      const minSalary = salaries.length ? Math.min(...salaries) : 0;
      const maxSalary = salaries.length ? Math.max(...salaries) : 0;
      const standardSalary = salaries.length ? calculateStandardSalary(minSalary, maxSalary) : 0;
      
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

  // Handle edit mode for a role
  const handleEditClick = (index: number) => {
    setRoles(prevRoles => 
      prevRoles.map((role, i) => 
        i === index 
          ? { ...role, isEditing: true, editValue: role.standardSalary.toString() } 
          : role
      )
    );
  };

  // Handle standard salary change
  const handleStandardSalaryChange = (index: number, value: string) => {
    setRoles(prevRoles => 
      prevRoles.map((role, i) => 
        i === index ? { ...role, editValue: value } : role
      )
    );
  };

  // Save edited standard salary
  const handleSaveClick = (index: number) => {
    setRoles(prevRoles => {
      const updatedRoles = [...prevRoles];
      const role = updatedRoles[index];
      
      let newValue = parseFloat(role.editValue.replace(/[^\d,.]/g, '').replace(',', '.'));
      
      if (isNaN(newValue) || newValue <= 0) {
        toast({
          title: "Ошибка ввода",
          description: "Пожалуйста, введите корректное положительное число",
          variant: "destructive",
        });
        return prevRoles;
      }
      
      // Update the role's standard salary
      updatedRoles[index] = { 
        ...role, 
        standardSalary: newValue, 
        isEditing: false 
      };
      
      // Call parent callback if provided
      if (onStandardSalaryChange) {
        onStandardSalaryChange(role.roleName, newValue);
      }
      
      toast({
        title: "Стандартный оклад обновлен",
        description: `Новый стандартный оклад для роли "${role.roleName}": ${formatSalary(newValue)}`,
      });
      
      return updatedRoles;
    });
  };

  // Cancel editing
  const handleCancelClick = (index: number) => {
    setRoles(prevRoles => 
      prevRoles.map((role, i) => 
        i === index ? { ...role, isEditing: false, editValue: role.standardSalary.toString() } : role
      )
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-500">
          Загрузка данных...
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
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
              <TableHead className="w-1/3">Название роли</TableHead>
              <TableHead className="w-1/5">Мин. зарплата</TableHead>
              <TableHead className="w-1/5">Макс. зарплата</TableHead>
              <TableHead className="w-1/4">Стандартный оклад</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{role.roleName}</TableCell>
                <TableCell>
                  {role.salaries.length ? (
                    formatSalary(role.minSalary)
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {role.salaries.length ? (
                    formatSalary(role.maxSalary)
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {role.isEditing ? (
                    <Input
                      value={role.editValue}
                      onChange={(e) => handleStandardSalaryChange(index, e.target.value)}
                      className="max-w-[150px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveClick(index);
                        } else if (e.key === "Escape") {
                          handleCancelClick(index);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    role.salaries.length ? (
                      formatSalary(role.standardSalary)
                    ) : (
                      <span className="text-gray-400">—</span>
                    )
                  )}
                </TableCell>
                <TableCell>
                  {role.salaries.length ? (
                    role.isEditing ? (
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSaveClick(index)}
                          className="h-8 w-8"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleCancelClick(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(index)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )
                  ) : null}
                </TableCell>
              </TableRow>
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
