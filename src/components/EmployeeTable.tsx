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
import { Employee, RoleData } from "@/types";
import { Search } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
  rolesData?: RoleData[];
  isLoading?: boolean;
}

interface EmployeeWithRoles extends Employee {
  roles: string[];
  totalFTE: number;
  normalizedRolesFTE: Map<string, number>;
}

const EmployeeTable = ({ 
  employees, 
  rolesData = [], 
  isLoading = false 
}: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithRoles[]>([]);
  const [employeesWithRoles, setEmployeesWithRoles] = useState<EmployeeWithRoles[]>([]);

  useEffect(() => {
    const withRoles = employees.map(emp => {
      const nameParts = formatName(emp.name).split(' ');
      const lastName = nameParts[0];
      const firstName = nameParts.length > 1 ? nameParts[1] : '';
      
      const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName);
      const roles = Array.from(rolesFTEMap.keys());
      const totalFTE = calculateTotalFTE(rolesFTEMap);
      
      const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
      
      return {
        ...emp,
        roles,
        totalFTE,
        normalizedRolesFTE
      };
    });
    
    setEmployeesWithRoles(withRoles);
    
    if (searchTerm.trim() === "") {
      setFilteredEmployees(withRoles);
    } else {
      const term = searchTerm.toLowerCase().trim();
      setFilteredEmployees(
        withRoles.filter((employee) =>
          formatName(employee.name).toLowerCase().includes(term)
        )
      );
    }
  }, [employees, searchTerm, rolesData]);

  const findRolesWithFTEForEmployee = (lastName: string, firstName: string): Map<string, number> => {
    if (!lastName || !firstName || !rolesData.length) return new Map();
    
    const rolesWithFTE = new Map<string, number>();
    
    const normalizedLastName = lastName.toLowerCase();
    const normalizedFirstName = firstName.toLowerCase();
    
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      const participantNameParts = entry.participantName
        .replace(/["']/g, '')
        .trim()
        .split(/\s+/)
        .map(part => part.toLowerCase());
      
      if (
        participantNameParts.some(part => part === normalizedLastName) && 
        participantNameParts.some(part => part === normalizedFirstName)
      ) {
        const roleName = cleanRoleName(entry.roleName);
        
        if (rolesWithFTE.has(roleName)) {
          const currentFTE = rolesWithFTE.get(roleName) || 0;
          if (entry.fte !== undefined && !isNaN(entry.fte)) {
            rolesWithFTE.set(roleName, currentFTE + entry.fte);
          }
        } else {
          if (entry.fte !== undefined && !isNaN(entry.fte)) {
            rolesWithFTE.set(roleName, entry.fte);
          } else {
            rolesWithFTE.set(roleName, 0);
          }
        }
      }
    });
    
    return rolesWithFTE;
  };

  const calculateTotalFTE = (rolesMap: Map<string, number>): number => {
    let total = 0;
    for (const fte of rolesMap.values()) {
      total += fte;
    }
    return total;
  };

  const normalizeRolesFTE = (rolesMap: Map<string, number>, totalFTE: number): Map<string, number> => {
    if (totalFTE === 0) return rolesMap;
    if (totalFTE === 1) return rolesMap;
    
    const normalizedMap = new Map<string, number>();
    
    for (const [role, fte] of rolesMap.entries()) {
      const normalizedFTE = fte / totalFTE;
      normalizedMap.set(role, normalizedFTE);
    }
    
    return normalizedMap;
  };

  const findRolesForEmployee = (lastName: string, firstName: string): string[] => {
    if (!lastName || !firstName || !rolesData.length) return [];
    
    const roles: string[] = [];
    
    const normalizedLastName = lastName.toLowerCase();
    const normalizedFirstName = firstName.toLowerCase();
    
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      const participantNameParts = entry.participantName
        .replace(/["']/g, '')
        .trim()
        .split(/\s+/)
        .map(part => part.toLowerCase());
      
      if (
        participantNameParts.some(part => part === normalizedLastName) && 
        participantNameParts.some(part => part === normalizedFirstName)
      ) {
        if (!roles.includes(entry.roleName)) {
          roles.push(cleanRoleName(entry.roleName));
        }
      }
    });
    
    return roles;
  };

  const formatRoleFTE = (employee: EmployeeWithRoles, roleName: string): string => {
    const normalizedFTE = employee.normalizedRolesFTE.get(roleName) || 0;
    
    return normalizedFTE.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatSalary = (salary: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(salary);
  };
  
  const formatName = (name: string): string => {
    const cleanName = name.replace(/["']/g, '').trim();
    
    if (cleanName === "") {
      return "Без имени";
    }
    
    const nameParts = cleanName.split(/\s+/);
    
    if (nameParts.length >= 2) {
      return `${nameParts[0]} ${nameParts[1]}`;
    }
    
    return cleanName;
  };

  const cleanRoleName = (roleName: string): string => {
    return roleName.replace(/["']/g, '').trim();
  };

  const formatFTE = (fte: number): string => {
    return fte.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

  if (employees.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="text-lg text-gray-500">
          Загрузите файл CSV для отображения данных о сотрудниках
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex mb-4 relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Поиск по имени сотрудника..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Имя сотрудника</TableHead>
              <TableHead className="w-1/5">Зарплата</TableHead>
              <TableHead className="w-3/5">Роли и нормализованный FTE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <TableRow key={employee.id || index}>
                  <TableCell className="font-medium">{formatName(employee.name)}</TableCell>
                  <TableCell>{formatSalary(employee.salary)}</TableCell>
                  <TableCell>
                    {employee.roles.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {employee.roles.map((role, roleIndex) => (
                          <li key={roleIndex} className="text-sm">
                            {role} <span className="text-gray-500 ml-2">FTE: {formatRoleFTE(employee, role)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-sm">Нет ролей</span>
                    )}
                    {employee.normalizedRolesFTE.size > 0 && (
                      <div className="text-xs text-gray-400 mt-2">
                        {employee.totalFTE === 1 
                          ? "Суммарный FTE: 1,00 (нормализация не требуется)" 
                          : employee.totalFTE > 1 
                            ? `Суммарный FTE до нормализации: ${formatFTE(employee.totalFTE)} (пропорционально уменьшен)`
                            : `Суммарный FTE до нормализации: ${formatFTE(employee.totalFTE)} (пропорционально увеличен)`
                        }
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-32">
                  Сотрудники не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500 mt-3">
        Всего сотрудников: {filteredEmployees.length}
      </div>
    </div>
  );
};

export default EmployeeTable;
