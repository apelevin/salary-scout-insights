
import { useMemo } from 'react';
import { Employee, EmployeeWithRoles, RoleData, CircleData } from '@/types';
import { formatName } from '@/utils/formatUtils';

interface EmployeeDetailsResult {
  roles: string[];
  circles: string[];
  salary: number;
  standardSalary: number | undefined;
  hasRoles: boolean;
  circleCount: number;
}

export const useEmployeeDetails = (
  employee: Employee | EmployeeWithRoles | null,
  rolesData: RoleData[],
  circlesData: CircleData[]
): EmployeeDetailsResult => {
  return useMemo(() => {
    if (!employee) {
      return {
        roles: [],
        circles: [],
        salary: 0,
        standardSalary: undefined,
        hasRoles: false,
        circleCount: 0
      };
    }

    // Check if the employee has roles (is EmployeeWithRoles)
    const hasRoles = 'roles' in employee && 'totalFTE' in employee;
    
    // Get roles
    const roles = hasRoles ? (employee as EmployeeWithRoles).roles : [];
    
    // Get circles based on roles data
    const circles = useMemo(() => {
      const result: string[] = [];
      if (!rolesData || !rolesData.length) return result;
      
      const nameParts = formatName(employee.name).toLowerCase().split(' ');
      const lastName = nameParts[0];
      const firstName = nameParts.length > 1 ? nameParts[1] : '';
      
      for (const roleData of rolesData) {
        if (!roleData.participantName || !roleData.circleName) continue;
        
        const participantNameParts = formatName(roleData.participantName).toLowerCase().split(' ');
        const roleLastName = participantNameParts[0];
        const roleFirstName = participantNameParts.length > 1 ? participantNameParts[1] : '';
        
        // Check for name match
        if (roleLastName === lastName && 
           (firstName === '' || roleFirstName === firstName)) {
          if (roleData.circleName && !result.includes(roleData.circleName)) {
            result.push(roleData.circleName);
          }
        }
      }
      
      return result;
    }, [employee.name, rolesData]);
    
    return {
      roles,
      circles,
      salary: employee.salary,
      standardSalary: hasRoles ? (employee as EmployeeWithRoles).standardSalary : undefined,
      hasRoles,
      circleCount: circles.length
    };
  }, [employee, rolesData, circlesData]);
};
