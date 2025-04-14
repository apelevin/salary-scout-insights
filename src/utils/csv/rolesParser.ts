
import { RoleData } from "@/types";
import { 
  normalizeCSVContent, 
  detectDelimiter, 
  findColumnIndex,
  parseFTEValue
} from "./helpers";
import {
  ROLE_PARTICIPANT_ALIASES,
  ROLE_NAME_ALIASES,
  FTE_COLUMN_ALIASES,
  CIRCLE_NAME_ALIASES
} from "./constants";

/**
 * Parse roles data from CSV content
 */
export const parseRolesCSV = (csvContent: string): RoleData[] => {
  try {
    const normalizedContent = normalizeCSVContent(csvContent);
    const lines = normalizedContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.error("CSV файл с ролями не содержит данных");
      return [];
    }

    const delimiter = detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(header => header.trim().toLowerCase());
    console.log("Обнаруженные заголовки ролей:", headers);
    
    // Find column indices
    const participantColumnIndex = findColumnIndex(headers, ROLE_PARTICIPANT_ALIASES);
    const roleNameColumnIndex = findColumnIndex(headers, ROLE_NAME_ALIASES);
    const fteColumnIndex = findColumnIndex(headers, FTE_COLUMN_ALIASES);
    const circleNameColumnIndex = findColumnIndex(headers, CIRCLE_NAME_ALIASES);
    
    console.log("Индекс колонки с участником роли:", participantColumnIndex);
    console.log("Индекс колонки с названием роли:", roleNameColumnIndex);
    console.log("Индекс колонки с FTE:", fteColumnIndex);
    console.log("Индекс колонки с названием круга:", circleNameColumnIndex);
    
    if (participantColumnIndex === -1 || roleNameColumnIndex === -1) {
      console.error("CSV файл с ролями должен содержать колонки 'участник роли' и 'название роли'");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    // Check if we have "Название" column as a fallback for circle name
    const titleColumnIndex = headers.findIndex(h => 
      h === 'название' || h === 'название круга' || h === 'наименование'
    );
    
    const effectiveCircleNameColumnIndex = circleNameColumnIndex !== -1 
      ? circleNameColumnIndex 
      : titleColumnIndex;
    
    console.log("Эффективный индекс колонки с названием круга:", effectiveCircleNameColumnIndex);
    
    return parseRoleRows(
      lines, 
      delimiter, 
      participantColumnIndex, 
      roleNameColumnIndex, 
      fteColumnIndex, 
      effectiveCircleNameColumnIndex
    );
    
  } catch (error) {
    console.error("Ошибка при парсинге CSV с ролями:", error);
    return [];
  }
};

/**
 * Parse role rows from CSV lines
 */
function parseRoleRows(
  lines: string[],
  delimiter: string,
  participantColumnIndex: number,
  roleNameColumnIndex: number,
  fteColumnIndex: number,
  circleNameColumnIndex: number
): RoleData[] {
  const roles: RoleData[] = [];
  const leadershipRoles: RoleData[] = [];
  
  // Start at 1 to skip headers
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(value => value.trim());
    
    // Skip empty rows
    if (values.every(v => v === '')) {
      continue;
    }
    
    // Skip rows with insufficient values
    if (values.length < Math.max(participantColumnIndex, roleNameColumnIndex) + 1) {
      console.warn(`Строка ${i + 1} в файле ролей имеет недостаточно значений. Пропускаем.`);
      continue;
    }
    
    const participantName = values[participantColumnIndex];
    const roleName = values[roleNameColumnIndex];
    
    if (participantName && roleName) {
      const role = createRoleFromValues(
        values, 
        participantName, 
        roleName, 
        fteColumnIndex, 
        circleNameColumnIndex
      );
      
      // Separate leadership roles for logging
      if (roleName.toLowerCase().includes('лидер')) {
        leadershipRoles.push(role);
      }
      
      roles.push(role);
    }
  }
  
  console.log(`Успешно распознано ${roles.length} записей о ролях`);
  console.log(`Из них ${leadershipRoles.length} ролей лидерства`);
  
  // Log leadership roles for debugging
  if (leadershipRoles.length > 0) {
    console.log("Роли лидерства:");
    leadershipRoles.forEach(role => {
      console.log(`Участник: "${role.participantName}", Роль: "${role.roleName}", Круг: "${role.circleName || 'не указан'}"`);
    });
  }
  
  return roles;
}

/**
 * Create a role object from CSV values
 */
function createRoleFromValues(
  values: string[],
  participantName: string,
  roleName: string,
  fteColumnIndex: number,
  circleNameColumnIndex: number
): RoleData {
  const role: RoleData = {
    participantName,
    roleName
  };
  
  // Add FTE if column exists and has a valid value
  if (fteColumnIndex !== -1 && values[fteColumnIndex]) {
    const fteValue = parseFTEValue(values[fteColumnIndex]);
    
    if (fteValue !== undefined) {
      role.fte = fteValue;
      console.log(`Parsed FTE for ${participantName}: ${values[fteColumnIndex]} -> ${fteValue}`);
    } else {
      console.warn(`Invalid FTE value for ${participantName}: ${values[fteColumnIndex]}`);
    }
  }
  
  // Add circleName if column exists
  if (circleNameColumnIndex !== -1 && values[circleNameColumnIndex]) {
    role.circleName = values[circleNameColumnIndex].trim();
    
    // Debug log for leadership roles
    if (roleName.toLowerCase().includes('лидер')) {
      console.log(`Leadership role "${roleName}" for ${participantName} in circle "${role.circleName}"`);
    }
  }
  
  return role;
}
