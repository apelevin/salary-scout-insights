
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
import { Employee } from "@/types";
import { Search } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
  rolesData?: { participantName: string; roleName: string }[];
  isLoading?: boolean;
}

const EmployeeTable = ({ 
  employees, 
  rolesData = [], 
  isLoading = false 
}: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<(Employee & { roles: string[] })[]>([]);
  const [employeesWithRoles, setEmployeesWithRoles] = useState<(Employee & { roles: string[] })[]>([]);

  useEffect(() => {
    // First, map employees with roles
    const withRoles = employees.map(emp => {
      // Extract first and last name for matching
      const nameParts = formatName(emp.name).split(' ');
      const lastName = nameParts[0];
      const firstName = nameParts.length > 1 ? nameParts[1] : '';
      
      // Find roles for this employee by matching name parts
      const roles = findRolesForEmployee(lastName, firstName);
      
      return {
        ...emp,
        roles
      };
    });
    
    setEmployeesWithRoles(withRoles);
    
    // Then apply search filter if needed
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

  // Real function to find roles for an employee based on the rolesData
  const findRolesForEmployee = (lastName: string, firstName: string): string[] => {
    if (!lastName || !firstName || !rolesData.length) return [];
    
    // Create a roles map for this employee
    const roles: string[] = [];
    
    // Normalize names for better matching
    const normalizedLastName = lastName.toLowerCase();
    const normalizedFirstName = firstName.toLowerCase();
    
    // Go through all role data entries
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      // Split participant name into parts for matching
      const participantNameParts = entry.participantName
        .replace(/["']/g, '')
        .trim()
        .split(/\s+/)
        .map(part => part.toLowerCase());
      
      // Try to match by last name and first name
      // We look for the last name and first name in the participant name parts
      if (
        participantNameParts.some(part => part === normalizedLastName) && 
        participantNameParts.some(part => part === normalizedFirstName)
      ) {
        // If we found both last name and first name, add the role if it's not already added
        if (!roles.includes(entry.roleName)) {
          roles.push(entry.roleName);
        }
      }
    });
    
    return roles;
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

  // Format roles array into a comma-separated string
  const formatRoles = (roles: string[]): string => {
    if (!roles || roles.length === 0) {
      return "—";
    }
    return roles.join(", ");
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
              <TableHead className="w-1/3">Роли</TableHead>
              <TableHead>Зарплата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <TableRow key={employee.id || index}>
                  <TableCell className="font-medium">{formatName(employee.name)}</TableCell>
                  <TableCell>{formatRoles(employee.roles)}</TableCell>
                  <TableCell>{formatSalary(employee.salary)}</TableCell>
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
