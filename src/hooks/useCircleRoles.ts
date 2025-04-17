
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

// Constants for leader role names
const LEADER_ROLES = {
  OPERATIONAL: "лидер операционного круга",
  STRATEGIC: "лидер стратегического круга",
  GENERIC: "лидер"
};

// Separating the calculation logic from the hook
export const calculateCircleBudget = (
  circleName: string | null,
  rolesData: RoleData[],
  employees: Employee[],
  rolesWithSalaries: any[]
): {
  circleLeader?: RoleData;
  rolesWithParticipants: RoleWithParticipants[];
  leaderName: string | null;
  leaderFte: number;
  budgetSummary: CircleBudgetSummary;
} => {
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

  // Optimize filter by creating a circleName matching function once
  const matchesCircleName = (roleCircleName: string | undefined): boolean => {
    if (!roleCircleName) return false;
    return roleCircleName.replace(/["']/g, '').trim() === circleName;
  };

  // Create a map for looking up role standard salaries faster
  const standardSalaryByRole = new Map();
  rolesWithSalaries.forEach(role => {
    if (role.roleName) { // Add null check for roleName
      standardSalaryByRole.set(role.roleName.toLowerCase(), role.standardSalary);
    }
  });

  // Filter roles that belong to the selected circle
  const circleRoles = rolesData.filter(role => {
    if (!role.circleName || !role.roleName) return false;
    
    if (!matchesCircleName(role.circleName)) return false;
    
    const normalizedRoleName = role.roleName.toLowerCase();
    
    // Exclude leader roles
    const isLeaderRole = 
      normalizedRoleName.includes(LEADER_ROLES.OPERATIONAL) || 
      normalizedRoleName.includes(LEADER_ROLES.STRATEGIC) ||
      normalizedRoleName === LEADER_ROLES.GENERIC;
    
    return !isLeaderRole;
  });

  // Process roles more efficiently with a single pass
  const roleMap = new Map<string, { participants: RoleParticipant[]; standardSalary: number }>();
  
  // Create a map for employee lookups to avoid repeated searches
  const employeeMap = new Map();
  employees.forEach(emp => {
    employeeMap.set(formatName(emp.name), emp);
  });
  
  // Process all roles in a single pass
  circleRoles.forEach(role => {
    if (!role.roleName || !role.participantName) return;
    
    const cleanedRoleName = cleanRoleName(role.roleName);
    const lowerRoleName = cleanedRoleName.toLowerCase();
    const participantName = formatName(role.participantName);
    const fte = role.fte || 0;
    
    // Get standard salary from the map for faster lookup
    const standardSalary = standardSalaryByRole.get(lowerRoleName) || 0;
    const standardIncome = fte * standardSalary;
    
    // Get employee from cache
    const employee = employeeMap.get(participantName) || 
                     findEmployeeByName(employees, participantName);
    const actualIncome = formatActualIncome(employee, fte);
    
    if (!roleMap.has(cleanedRoleName)) {
      roleMap.set(cleanedRoleName, {
        participants: [],
        standardSalary
      });
    }
    
    const roleData = roleMap.get(cleanedRoleName)!;
    
    // Check if participant already exists - optimize with a map
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

  // Convert map to array and sort by role name
  const rolesWithParticipants: RoleWithParticipants[] = Array.from(roleMap.entries())
    .map(([roleName, data]) => ({
      roleName,
      participants: data.participants.sort((a, b) => a.name.localeCompare(b.name, "ru")),
      standardSalary: data.standardSalary
    }))
    .sort((a, b) => a.roleName.localeCompare(b.roleName, "ru"));

  // Calculate totals in a single efficient pass
  let totalStandardIncome = 0;
  let totalActualIncome = 0;

  for (const role of rolesWithParticipants) {
    for (const participant of role.participants) {
      // Add standard income if available
      totalStandardIncome += participant.standardIncome || 0;
      
      // Add actual income if available
      if (participant.actualIncome) {
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
};

// The actual hook now uses the pure function above
export const useCircleRoles = (
  circleName: string | null,
  rolesData: RoleData[],
  employees: Employee[]
) => {
  // Get roles data with standard salaries
  const { roles: rolesWithSalaries } = useRolesData(rolesData, employees);

  // Use the pure calculation function in a useMemo
  return useMemo(() => {
    return calculateCircleBudget(circleName, rolesData, employees, rolesWithSalaries);
  }, [circleName, rolesData, rolesWithSalaries, employees]);
};
