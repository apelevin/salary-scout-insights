import { useMemo } from "react";
import { RoleData, Employee } from "@/types";
import { cleanRoleName, formatName } from "@/utils/formatUtils";
import { findEmployeeByName } from "@/utils/employeeUtils";
import { formatActualIncome } from "@/utils/employeeIncomeUtils";
import { useRolesData } from "@/hooks/useRolesData";

export interface RoleParticipant {
  name: string;
  fte: number;
  standardIncome?: number;
  actualIncome?: string;
}

export interface RoleWithParticipants {
  roleName: string;
  participants: RoleParticipant[];
  standardSalary: number;
}

export const useCircleRoles = (
  circleName: string | null,
  rolesData: RoleData[],
  employees: Employee[]
) => {
  // Get roles data with standard salaries
  const { roles: rolesWithSalaries } = useRolesData(rolesData, employees);

  // Constants for leader role names
  const LEADER_ROLES = useMemo(() => ({
    OPERATIONAL: "лидер операционного круга",
    STRATEGIC: "лидер стратегического круга",
    GENERIC: "лидер"
  }), []);

  // Process circle data using useMemo to avoid recalculations
  return useMemo(() => {
    if (!circleName) {
      return { circleLeader: undefined, rolesWithParticipants: [], leaderName: null, leaderFte: 0 };
    }
    
    // Find leader for this circle
    const circleLeader = rolesData.find(role => {
      if (!role.circleName || !role.roleName) return false;
      
      const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
      const normalizedRoleName = role.roleName.toLowerCase();
      const isCurrentCircle = normalizedCircleName === circleName;
      
      return isCurrentCircle && (
        normalizedRoleName.includes(LEADER_ROLES.OPERATIONAL) || 
        normalizedRoleName.includes(LEADER_ROLES.STRATEGIC) ||
        normalizedRoleName === LEADER_ROLES.GENERIC
      );
    });

    // Filter roles that belong to the selected circle
    const circleRoles = rolesData.filter(role => {
      if (!role.circleName || !role.roleName) return false;
      
      const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
      const normalizedRoleName = role.roleName.toLowerCase();
      const isCurrentCircle = normalizedCircleName === circleName;
      
      // Exclude leader roles
      const isLeaderRole = 
        normalizedRoleName.includes(LEADER_ROLES.OPERATIONAL) || 
        normalizedRoleName.includes(LEADER_ROLES.STRATEGIC) ||
        normalizedRoleName === LEADER_ROLES.GENERIC;
      
      return isCurrentCircle && !isLeaderRole;
    });

    // Process roles more efficiently with reduce
    const roleMap = circleRoles.reduce((acc, role) => {
      const cleanedRoleName = cleanRoleName(role.roleName);
      const participantName = formatName(role.participantName);
      const fte = role.fte || 0;
      
      // Find standard salary for this role
      const roleSalaryInfo = rolesWithSalaries.find(r => 
        r.roleName.toLowerCase() === cleanedRoleName.toLowerCase()
      );
      const standardSalary = roleSalaryInfo?.standardSalary || 0;
      
      // Calculate standard income based on FTE and standard salary
      const standardIncome = fte * standardSalary;
      
      // Find the employee to get actual salary information
      const employee = findEmployeeByName(employees, participantName);
      const actualIncome = formatActualIncome(employee, fte);
      
      if (!acc.has(cleanedRoleName)) {
        acc.set(cleanedRoleName, {
          participants: [],
          standardSalary
        });
      }
      
      const roleData = acc.get(cleanedRoleName);
      
      // Check if participant already exists
      const existingParticipantIndex = roleData.participants.findIndex(p => p.name === participantName);
      
      if (existingParticipantIndex >= 0) {
        // Update existing participant's FTE
        roleData.participants[existingParticipantIndex].fte += fte;
        roleData.participants[existingParticipantIndex].standardIncome = 
          roleData.participants[existingParticipantIndex].fte * standardSalary;
          
        // Update actual income
        if (employee) {
          roleData.participants[existingParticipantIndex].actualIncome = 
            formatActualIncome(employee, roleData.participants[existingParticipantIndex].fte);
        }
      } else {
        // Add new participant
        roleData.participants.push({
          name: participantName,
          fte,
          standardIncome,
          actualIncome
        });
      }
      
      return acc;
    }, new Map<string, { participants: RoleParticipant[]; standardSalary: number }>());

    // Convert map to array and sort by role name
    const rolesWithParticipants: RoleWithParticipants[] = Array.from(roleMap.entries())
      .map(([roleName, data]) => ({
        roleName,
        participants: data.participants.sort((a, b) => a.name.localeCompare(b.name, "ru")),
        standardSalary: data.standardSalary
      }))
      .sort((a, b) => a.roleName.localeCompare(b.roleName, "ru"));

    // Get leader name and FTE if available
    const leaderName = circleLeader ? formatName(circleLeader.participantName) : null;
    const leaderFte = circleLeader ? circleLeader.fte || 0 : 0;

    return { 
      circleLeader,
      rolesWithParticipants,
      leaderName,
      leaderFte
    };
  }, [circleName, rolesData, rolesWithSalaries, LEADER_ROLES, employees]);
};
