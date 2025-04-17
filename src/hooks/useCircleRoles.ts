
import { useMemo } from "react";
import { RoleData, Employee } from "@/types";
import { cleanRoleName, formatName } from "@/utils/formatUtils";
import { findEmployeeByName } from "@/utils/employeeUtils";
import { formatActualIncome, parseActualIncome } from "@/utils/employeeIncomeUtils";
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

export interface CircleBudgetSummary {
  totalStandardIncome: number;
  totalActualIncome: number;
  percentageDifference: number;
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
      return { 
        circleLeader: undefined, 
        rolesWithParticipants: [], 
        leaderName: null, 
        leaderFte: 0,
        budgetSummary: { totalStandardIncome: 0, totalActualIncome: 0, percentageDifference: 0 }
      };
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
    const roleMap = new Map<string, { participants: RoleParticipant[]; standardSalary: number }>();
    
    // Optimize the loop by pulling common operations outside the loop
    circleRoles.forEach(role => {
      if (!role.roleName || !role.participantName) return;
      
      const cleanedRoleName = cleanRoleName(role.roleName);
      const participantName = formatName(role.participantName);
      const fte = role.fte || 0;
      
      // Find standard salary for this role efficiently
      const roleSalaryInfo = rolesWithSalaries.find(r => 
        r.roleName.toLowerCase() === cleanedRoleName.toLowerCase()
      );
      const standardSalary = roleSalaryInfo?.standardSalary || 0;
      
      // Calculate standard income based on FTE and standard salary
      const standardIncome = fte * standardSalary;
      
      // Find the employee to get actual salary information
      const employee = findEmployeeByName(employees, participantName);
      const actualIncome = formatActualIncome(employee, fte);
      
      // Use Map.get with default for better performance
      if (!roleMap.has(cleanedRoleName)) {
        roleMap.set(cleanedRoleName, {
          participants: [],
          standardSalary
        });
      }
      
      const roleData = roleMap.get(cleanedRoleName)!;
      
      // Check if participant already exists
      const existingParticipantIndex = roleData.participants.findIndex(p => p.name === participantName);
      
      if (existingParticipantIndex >= 0) {
        // Update existing participant's FTE
        const participant = roleData.participants[existingParticipantIndex];
        participant.fte += fte;
        participant.standardIncome = participant.fte * standardSalary;
          
        // Update actual income
        if (employee) {
          participant.actualIncome = formatActualIncome(employee, participant.fte);
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
    });

    // Convert map to array and sort by role name only once
    const rolesWithParticipants: RoleWithParticipants[] = Array.from(roleMap.entries())
      .map(([roleName, data]) => ({
        roleName,
        participants: data.participants.sort((a, b) => a.name.localeCompare(b.name, "ru")),
        standardSalary: data.standardSalary
      }))
      .sort((a, b) => a.roleName.localeCompare(b.roleName, "ru"));

    // Calculate totals for both standard and actual income in a single pass
    let totalStandardIncome = 0;
    let totalActualIncome = 0;

    // Iterate through all roles and participants once
    for (const role of rolesWithParticipants) {
      for (const participant of role.participants) {
        // Add standard income if available
        totalStandardIncome += participant.standardIncome || 0;
        
        // Add actual income if available (convert from currency string to number)
        if (participant.actualIncome) {
          // Extract numeric value from currency string (removing currency symbol and spaces)
          const numericValue = parseActualIncome(participant.actualIncome);
          totalActualIncome += numericValue;
        }
      }
    }

    // Calculate percentage difference
    const percentageDifference = totalStandardIncome === 0 ? 0 : 
      Math.round(((totalActualIncome - totalStandardIncome) / totalStandardIncome) * 10000) / 100;

    // Get leader name and FTE if available
    const leaderName = circleLeader ? formatName(circleLeader.participantName) : null;
    const leaderFte = circleLeader ? circleLeader.fte || 0 : 0;

    return { 
      circleLeader,
      rolesWithParticipants,
      leaderName,
      leaderFte,
      budgetSummary: { totalStandardIncome, totalActualIncome, percentageDifference }
    };
  }, [circleName, rolesData, rolesWithSalaries, LEADER_ROLES, employees]);
};
