
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
  isLoading?: boolean;
}

const EmployeeTable = ({ employees, isLoading = false }: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
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
  }, [employees, searchTerm]);

  // Mock function to find roles for an employee
  // This would typically get the data from the roles file
  const findRolesForEmployee = (lastName: string, firstName: string): string[] => {
    // In a real implementation, this would search through the roles data
    // For now, let's return some example roles based on employee names
    if (!lastName || !firstName) return [];
    
    // This is placeholder logic - in a real app, this would look up roles from 
    // parsed role data that was uploaded as another CSV file
    const rolesMappings: Record<string, string[]> = {
      "Иванов Иван": ["Менеджер", "Консультант"],
      "Петров Петр": ["Директор"],
      "Сидоров Алексей": ["Аналитик", "Разработчик"]
    };
    
    // Try to match by last name and first name
    const key = `${lastName} ${firstName}`;
    if (rolesMappings[key]) {
      return rolesMappings[key];
    }
    
    // Try partial matches (when we only have part of the name)
    for (const [name, roles] of Object.entries(rolesMappings)) {
      if (name.includes(lastName) && name.includes(firstName)) {
        return roles;
      }
    }
    
    return [];
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
