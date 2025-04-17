
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Employee, EmployeeWithRoles, RoleData, CircleData, LeadershipData } from '@/types';
import { processEmployeesWithRoles } from '@/utils/employeeUtils';

interface EmployeeDataContextType {
  employees: (Employee | EmployeeWithRoles)[];
  rolesData: RoleData[];
  circlesData: CircleData[];
  leadershipData: LeadershipData[];
  getEmployeeRoles: (employee: Employee | EmployeeWithRoles) => string[];
  getEmployeeCircles: (employee: Employee | EmployeeWithRoles) => string[];
  getEmployeeSalary: (employee: Employee | EmployeeWithRoles) => number;
  getStandardSalaryForRole: (roleName: string) => number;
  isLoading: boolean;
}

const EmployeeDataContext = createContext<EmployeeDataContextType | undefined>(undefined);

export function useEmployeeData() {
  const context = useContext(EmployeeDataContext);
  if (context === undefined) {
    throw new Error('useEmployeeData must be used within an EmployeeDataProvider');
  }
  return context;
}

interface EmployeeDataProviderProps {
  children: ReactNode;
  employees: Employee[];
  rolesData: RoleData[];
  circlesData: CircleData[];
  leadershipData: LeadershipData[];
  customStandardSalaries: Map<string, number>;
  isLoading: boolean;
}

export function EmployeeDataProvider({
  children,
  employees,
  rolesData,
  circlesData,
  leadershipData,
  customStandardSalaries,
  isLoading
}: EmployeeDataProviderProps) {
  const [processedEmployees, setProcessedEmployees] = useState<(Employee | EmployeeWithRoles)[]>([]);

  // Process employees with roles when data changes
  useEffect(() => {
    if (employees.length > 0 && rolesData.length > 0) {
      const processed = processEmployeesWithRoles(
        employees,
        rolesData,
        customStandardSalaries,
        circlesData,
        leadershipData
      );
      setProcessedEmployees(processed);
    } else {
      setProcessedEmployees(employees);
    }
  }, [employees, rolesData, circlesData, leadershipData, customStandardSalaries]);

  // Helper functions for easy data access
  const getEmployeeRoles = (employee: Employee | EmployeeWithRoles): string[] => {
    if ('roles' in employee) {
      return employee.roles;
    }
    return [];
  };

  const getEmployeeCircles = (employee: Employee | EmployeeWithRoles): string[] => {
    const circles: string[] = [];
    
    if (!('roles' in employee)) return circles;
    
    // Find all circles for the employee based on roles data
    const empWithRoles = employee as EmployeeWithRoles;
    const nameParts = employee.name.toLowerCase().split(' ');
    
    rolesData.forEach(roleData => {
      if (!roleData.participantName || !roleData.circleName) return;
      
      const participantName = roleData.participantName.toLowerCase();
      const matchesName = nameParts.every(part => participantName.includes(part));
      
      if (matchesName && roleData.circleName && !circles.includes(roleData.circleName)) {
        circles.push(roleData.circleName);
      }
    });
    
    return circles;
  };

  const getEmployeeSalary = (employee: Employee | EmployeeWithRoles): number => {
    return employee.salary;
  };

  const getStandardSalaryForRole = (roleName: string): number => {
    if (customStandardSalaries.has(roleName)) {
      return customStandardSalaries.get(roleName) || 0;
    }
    
    // Find standard salary based on the role name
    const matchingEmployees = processedEmployees.filter(emp => 
      'roles' in emp && emp.roles.includes(roleName) && 'standardSalary' in emp
    ) as EmployeeWithRoles[];
    
    if (matchingEmployees.length === 0) return 0;
    
    // Calculate average standard salary for this role
    let totalSalary = 0;
    matchingEmployees.forEach(emp => {
      if (emp.normalizedRolesFTE.has(roleName) && emp.standardSalary) {
        totalSalary += emp.normalizedRolesFTE.get(roleName)! * emp.standardSalary;
      }
    });
    
    return matchingEmployees.length > 0 ? totalSalary / matchingEmployees.length : 0;
  };

  const value = {
    employees: processedEmployees,
    rolesData,
    circlesData,
    leadershipData,
    getEmployeeRoles,
    getEmployeeCircles,
    getEmployeeSalary,
    getStandardSalaryForRole,
    isLoading
  };

  return (
    <EmployeeDataContext.Provider value={value}>
      {children}
    </EmployeeDataContext.Provider>
  );
}
