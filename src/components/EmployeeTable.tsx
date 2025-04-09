import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee, EmployeeWithRoles, RoleData, CircleData } from "@/types";
import EmployeeInfoSidebar from "./EmployeeInfoSidebar";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeTableRow from "./EmployeeTableRow";
import { LoadingState, EmptyState } from "./EmployeeTableStates";
import { formatName, processEmployeesWithRoles } from "@/utils/employeeUtils";
import DashboardSummaryCards from "./DashboardSummaryCards";
import { ArrowDownAZ, ArrowUpAZ, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeTableProps {
  employees: Employee[];
  rolesData?: RoleData[];
  circlesData?: CircleData[];
  isLoading?: boolean;
  customStandardSalaries?: Map<string, number>;
}

// List of employees to exclude from the display
const EXCLUDED_EMPLOYEES = ["Пелевин Алексей", "Чиракадзе Дмитрий"];

type SortDirection = "none" | "asc" | "desc";
type SortField = "name" | "difference";

const EmployeeTable = ({ 
  employees, 
  rolesData = [], 
  circlesData = [],
  isLoading = false,
  customStandardSalaries = new Map()
}: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithRoles[]>([]);
  const [employeesWithRoles, setEmployeesWithRoles] = useState<EmployeeWithRoles[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithRoles | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [sortField, setSortField] = useState<SortField>("difference");

  useEffect(() => {
    // Filter out excluded employees
    const filteredEmployeesList = employees.filter(emp => 
      !EXCLUDED_EMPLOYEES.some(excluded => 
        formatName(emp.name).toLowerCase().includes(excluded.toLowerCase())
      )
    );
    
    const withRoles = processEmployeesWithRoles(filteredEmployeesList, rolesData, customStandardSalaries, circlesData);
    
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
  }, [employees, searchTerm, rolesData, customStandardSalaries, circlesData]);

  useEffect(() => {
    if (sortDirection !== "none") {
      const sortedEmployees = [...filteredEmployees].sort((a, b) => {
        if (sortField === "difference") {
          const diffA = a.standardSalary ? a.salary - a.standardSalary : 0;
          const diffB = b.standardSalary ? b.salary - b.standardSalary : 0;
          
          return sortDirection === "asc" ? diffA - diffB : diffB - diffA;
        } else if (sortField === "name") {
          const nameA = formatName(a.name).toLowerCase();
          const nameB = formatName(b.name).toLowerCase();
          
          return sortDirection === "asc" 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        }
        
        return 0;
      });
      
      setFilteredEmployees(sortedEmployees);
    }
  }, [sortDirection, sortField, filteredEmployees]);

  const handleEmployeeClick = (employee: EmployeeWithRoles) => {
    setSelectedEmployee(employee);
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("asc");
    } else {
      setSortDirection(prev => {
        if (prev === "none") return "asc";
        if (prev === "asc") return "desc";
        return "none";
      });
    }
  };

  const getSortIconForDifference = () => {
    if (sortField !== "difference") {
      return <ArrowDown className="h-4 w-4 text-muted-foreground/70" />;
    }
    
    switch (sortDirection) {
      case "asc":
        return <ArrowUp className="h-4 w-4" />;
      case "desc":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <ArrowDown className="h-4 w-4 text-muted-foreground/70" />;
    }
  };

  const getSortIconForName = () => {
    if (sortField !== "name") {
      return <ArrowDownAZ className="h-4 w-4 text-muted-foreground/70" />;
    }
    
    switch (sortDirection) {
      case "asc":
        return <ArrowDownAZ className="h-4 w-4" />;
      case "desc":
        return <ArrowUpAZ className="h-4 w-4" />;
      default:
        return <ArrowDownAZ className="h-4 w-4 text-muted-foreground/70" />;
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (employees.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      <DashboardSummaryCards employees={filteredEmployees} />
      
      <EmployeeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">
                <div className="flex items-center justify-between">
                  <span>Имя сотрудника</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleSort("name")}
                    className="ml-2 h-8 w-8 p-0"
                  >
                    {getSortIconForName()}
                  </Button>
                </div>
              </TableHead>
              <TableHead className="w-1/4">Зарплата</TableHead>
              <TableHead className="w-1/4">Стандартная зарплата</TableHead>
              <TableHead className="w-1/4">
                <div className="flex items-center justify-between">
                  <span>Разница</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleSort("difference")}
                    className="ml-2 h-8 w-8 p-0"
                  >
                    {getSortIconForDifference()}
                  </Button>
                </div>
              </TableHead>
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
