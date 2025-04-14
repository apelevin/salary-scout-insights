
import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { cleanRoleName } from "@/utils/formatUtils";

interface RoleEmployeeData {
  name: string;
  salary: number;
  fte: number;
  contribution: number;
}

export const useRoleEmployees = (
  roleName: string | null,
  employees: Employee[],
  rolesData: any[]
) => {
  const [employeesWithRole, setEmployeesWithRole] = useState<RoleEmployeeData[]>([]);
  const [totalRoleCost, setTotalRoleCost] = useState(0);
  
  useEffect(() => {
    if (!roleName || !employees?.length || !rolesData?.length) {
      setEmployeesWithRole([]);
      setTotalRoleCost(0);
      return;
    }
    
    // Constants for the circle leader role names
    const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
    const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
    const GENERIC_LEADER_ROLE = "лидер";
    const NORMALIZED_LEADER_ROLE = "Лидер";
    
    const isLeaderRole = roleName.toLowerCase() === NORMALIZED_LEADER_ROLE.toLowerCase();
    const employeesData: RoleEmployeeData[] = [];
    
    try {
      employees.forEach(employee => {
        // Extract employee name parts
        const empNameParts = employee.name
          .replace(/["']/g, '')
          .trim()
          .split(/\s+/)
          .map(part => part.toLowerCase());
          
        if (empNameParts.length < 2) return;
        
        const empLastName = empNameParts[0];
        const empFirstName = empNameParts[1];
        
        // Find all roles for this employee
        rolesData.forEach(entry => {
          if (!entry.participantName || !entry.roleName) return;
          
          const participantNameParts = entry.participantName
            .replace(/["']/g, '')
            .trim()
            .split(/\s+/)
            .map(part => part.toLowerCase());
          
          if (participantNameParts.length < 2) return;
          
          const lastName = participantNameParts[0];
          const firstName = participantNameParts[1];
          
          // Check if this is the same employee
          if (lastName === empLastName && firstName === empFirstName) {
            let entryRoleName = entry.roleName;
            let matchesRole = false;
            
            if (isLeaderRole) {
              // For leader roles, check if it's any type of leader
              const roleLower = entryRoleName.toLowerCase();
              matchesRole = roleLower === GENERIC_LEADER_ROLE.toLowerCase() || 
                            roleLower.includes(OPERATIONAL_CIRCLE_LEADER.toLowerCase()) || 
                            roleLower.includes(STRATEGIC_CIRCLE_LEADER.toLowerCase());
            } else {
              // For normal roles, direct comparison
              // Clean and normalize role names for comparison
              const normalizedEntryRoleName = cleanRoleName(entryRoleName).toLowerCase();
              const normalizedRoleName = roleName.toLowerCase();
              matchesRole = normalizedEntryRoleName === normalizedRoleName;
            }
            
            if (matchesRole && typeof entry.fte === 'number') {
              // Calculate contribution to role cost
              const contribution = employee.salary * entry.fte;
              
              // Check if employee already exists in the list (might have multiple entries for same role)
              const existingEmployee = employeesData.find(e => e.name === employee.name);
              
              if (existingEmployee) {
                existingEmployee.fte += entry.fte;
                existingEmployee.contribution += contribution;
              } else {
                employeesData.push({
                  name: employee.name,
                  salary: employee.salary,
                  fte: entry.fte,
                  contribution: contribution
                });
              }
            }
          }
        });
      });
      
      // Sort employees by contribution (highest first)
      employeesData.sort((a, b) => b.contribution - a.contribution);
      
      // Calculate total cost of the role
      const total = employeesData.reduce((sum, emp) => sum + emp.contribution, 0);
      
      console.log(`Role: ${roleName}, Found ${employeesData.length} employees, Total cost: ${total}`);
      
      setEmployeesWithRole(employeesData);
      setTotalRoleCost(total);
    } catch (error) {
      console.error("Error processing role employees:", error);
      setEmployeesWithRole([]);
      setTotalRoleCost(0);
    }
    
  }, [roleName, employees, rolesData]);
  
  return { employeesWithRole, totalRoleCost };
};
