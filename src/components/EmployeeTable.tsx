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
import EmployeeInfoSidebar from "./EmployeeInfoSidebar";

interface EmployeeTableProps {
  employees: Employee[];
  rolesData?: RoleData[];
  isLoading?: boolean;
  customStandardSalaries?: Map<string, number>;
}

interface EmployeeWithRoles extends Employee {
  roles: string[];
  totalFTE: number;
  normalizedRolesFTE: Map<string, number>;
  standardSalary?: number;
}

const EmployeeTable = ({ 
  employees, 
  rolesData = [], 
  isLoading = false,
  customStandardSalaries = new Map()
}: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithRoles[]>([]);
  const [employeesWithRoles, setEmployeesWithRoles] = useState<EmployeeWithRoles[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithRoles | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const withRoles = employees.map(emp => {
      const nameParts = formatName(emp.name).split(' ');
      const lastName = nameParts[0];
      const firstName = nameParts.length > 1 ? nameParts[1] : '';
      
      const rolesFTEMap = findRolesWithFTEForEmployee(lastName, firstName);
      const roles = Array.from(rolesFTEMap.keys());
      const totalFTE = calculateTotalFTE(rolesFTEMap);
      
      const normalizedRolesFTE = normalizeRolesFTE(rolesFTEMap, totalFTE);
      
      const standardSalary = calculateStandardSalary(normalizedRolesFTE);
      
      return {
        ...emp,
        roles,
        totalFTE,
        normalizedRolesFTE,
        standardSalary
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
  }, [employees, searchTerm, rolesData, customStandardSalaries]);

  const handleEmployeeClick = (employee: EmployeeWithRoles) => {
    setSelectedEmployee(employee);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const calculateStandardSalary = (normalizedRolesFTE: Map<string, number>): number => {
    let totalStandardSalary = 0;
    
    for (const [roleName, fte] of normalizedRolesFTE.entries()) {
      const standardRateForRole = findStandardRateForRole(roleName);
      totalStandardSalary += fte * standardRateForRole;
    }
    
    return totalStandardSalary;
  };
  
  const findStandardRateForRole = (roleName: string): number => {
    if (customStandardSalaries.has(roleName)) {
      return customStandardSalaries.get(roleName) || 0;
    }
    
    if (!roleName || !rolesData.length) return 0;
    
    const normalizedRoleName = roleName.toLowerCase();
    
    const salaries: number[] = [];
    
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      const cleanedRoleName = cleanRoleName(entry.roleName).toLowerCase();
      
      if (cleanedRoleName === normalizedRoleName) {
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
    
    if (salaries.length === 0) return 0;
    
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);
    
    return calculateStandardRate(minSalary, maxSalary);
  };
  
  const calculateStandardRate = (min: number, max: number): number => {
    if (min === max) {
      return max;
    }
    return min + (max - min) * 0.5;
  };

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
              <TableHead className="w-1/3">Имя сотрудника</TableHead>
              <TableHead className="w-1/3">Зарплата</TableHead>
              <TableHead className="w-1/3">Стандартная зарплата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <TableRow key={employee.id || index}>
                  <TableCell className="font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                      onClick={() => handleEmployeeClick(employee)}
                    >
                      {formatName(employee.name)}
                    </button>
                  </TableCell>
                  <TableCell>{formatSalary(employee.salary)}</TableCell>
                  <TableCell>
                    {employee.standardSalary && employee.standardSalary > 0 ? (
                      formatSalary(employee.standardSalary)
                    ) : (
                      <span className="text-gray-400">—</span>
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

      <EmployeeInfoSidebar 
        employee={selectedEmployee} 
        open={sidebarOpen} 
        onClose={closeSidebar} 
      />
    </div>
  );
};

export default EmployeeTable;
