
import { RoleData } from "@/types";
import { cleanRoleName, formatName } from "@/utils/formatUtils";

// Constants for leader role names
export const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
export const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
export const GENERIC_LEADER_ROLE = "лидер";

export interface RoleWithParticipants {
  roleName: string;
  participants: Array<{
    name: string;
    fte: number;
    standardIncome?: number;
  }>;
  standardSalary: number;
}

export const findCircleLeader = (rolesData: RoleData[], circleName: string | null): RoleData | undefined => {
  return rolesData.find(role => {
    if (!role.circleName || !role.roleName) return false;
    
    const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
    const normalizedRoleName = role.roleName.toLowerCase();
    const isCurrentCircle = normalizedCircleName === circleName;
    
    return isCurrentCircle && (
      normalizedRoleName.includes(OPERATIONAL_CIRCLE_LEADER) || 
      normalizedRoleName.includes(STRATEGIC_CIRCLE_LEADER) ||
      normalizedRoleName === GENERIC_LEADER_ROLE
    );
  });
};

export const getCircleRoles = (rolesData: RoleData[], circleName: string | null): RoleData[] => {
  return rolesData.filter(role => {
    if (!role.circleName || !role.roleName) return false;
    
    const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
    const normalizedRoleName = role.roleName.toLowerCase();
    const isCurrentCircle = normalizedCircleName === circleName;
    
    // Exclude leader roles
    const isLeaderRole = 
      normalizedRoleName.includes(OPERATIONAL_CIRCLE_LEADER) || 
      normalizedRoleName.includes(STRATEGIC_CIRCLE_LEADER) ||
      normalizedRoleName === GENERIC_LEADER_ROLE;
    
    return isCurrentCircle && !isLeaderRole;
  });
};

export const processCircleRoles = (
  circleRoles: RoleData[],
  rolesWithSalaries: Array<{ roleName: string; standardSalary: number }>
): RoleWithParticipants[] => {
  const roleMap = new Map<string, Array<{name: string; fte: number; standardIncome?: number}>>();
  const roleStandardSalaries = new Map<string, number>();
  
  circleRoles.forEach(role => {
    const cleanedRoleName = cleanRoleName(role.roleName);
    const participantName = formatName(role.participantName);
    const fte = role.fte || 0;
    
    // Find standard salary for this role
    const roleSalaryInfo = rolesWithSalaries.find(r => 
      r.roleName.toLowerCase() === cleanedRoleName.toLowerCase()
    );
    const standardSalary = roleSalaryInfo?.standardSalary || 0;
    
    // Store standard salary for this role
    roleStandardSalaries.set(cleanedRoleName, standardSalary);
    
    // Calculate standard income based on FTE and standard salary
    const standardIncome = fte * standardSalary;
    
    if (roleMap.has(cleanedRoleName)) {
      const participants = roleMap.get(cleanedRoleName) || [];
      
      // Check if participant already exists
      const existingParticipant = participants.findIndex(p => p.name === participantName);
      
      if (existingParticipant >= 0) {
        // Update existing participant's FTE
        participants[existingParticipant].fte += fte;
        participants[existingParticipant].standardIncome = 
          (participants[existingParticipant].fte * standardSalary);
      } else {
        // Add new participant
        participants.push({
          name: participantName,
          fte,
          standardIncome
        });
      }
      
      roleMap.set(cleanedRoleName, participants);
    } else {
      roleMap.set(cleanedRoleName, [{
        name: participantName,
        fte,
        standardIncome
      }]);
    }
  });

  // Convert map to array and sort by role name
  return Array.from(roleMap.entries())
    .map(([roleName, participants]) => ({
      roleName,
      participants: participants.sort((a, b) => a.name.localeCompare(b.name, "ru")),
      standardSalary: roleStandardSalaries.get(roleName) || 0
    }))
    .sort((a, b) => a.roleName.localeCompare(b.roleName, "ru"));
};
