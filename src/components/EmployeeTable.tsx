
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee, EmployeeWithRoles, RoleData } from "@/types";
import EmployeeInfoSidebar from "./EmployeeInfoSidebar";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeTableRow from "./EmployeeTableRow";
import { LoadingState, EmptyState } from "./EmployeeTableStates";
import { formatName, processEmployeesWithRoles } from "@/utils/employeeUtils";
import SalaryDifferenceCard from "./dashboard/SalaryDifferenceCard";

interface EmployeeTableProps {
  employees: Employee[];
  rolesData?: RoleData[];
  isLoading?: boolean;
  customStandardSalaries?: Map<string, number>;
}

// List of employees to exclude from the display
const EXCLUDED_EMPLOYEES = ["Пелевин Алексей", "Чиракадзе Дмитрий"];

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
    // Filter out excluded employees
    const filteredEmployeesList = employees.filter(emp => 
      !EXCLUDED_EMPLOYEES.some(excluded => 
        formatName(emp.name).toLowerCase().includes(excluded.toLowerCase())
      )
    );
    
    const withRoles = processEmployeesWithRoles(filteredEmployeesList, rolesData, customStandardSalaries);
    
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (employees.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      <SalaryDifferenceCard employees={filteredEmployees} />
      
      <EmployeeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Имя сотрудника</TableHead>
              <TableHead className="w-1/4">Зарплата</TableHead>
              <TableHead className="w-1/4">Стандартная зарплата</TableHead>
              <TableHead className="w-1/4">Разница</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <EmployeeTableRow 
                  key={employee.id || index} 
                  employee={employee} 
                  onClick={handleEmployeeClick} 
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-32">
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
