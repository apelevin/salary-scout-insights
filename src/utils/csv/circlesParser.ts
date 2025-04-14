
import { CircleData } from "@/types";
import { 
  normalizeCSVContent, 
  detectDelimiter, 
  findColumnIndex,
  normalizeFunctionalType
} from "./helpers";
import {
  CIRCLE_NAME_ALIASES
} from "./constants";

/**
 * Parse circles data from CSV content
 */
export const parseCirclesCSV = (csvContent: string): CircleData[] => {
  try {
    const normalizedContent = normalizeCSVContent(csvContent);
    const lines = normalizedContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.error("CSV файл с кругами не содержит данных");
      return [];
    }

    const delimiter = detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(header => header.trim().toLowerCase());
    console.log("Обнаруженные заголовки кругов:", headers);
    
    // Find column indices
    const circleNameColumnIndex = findColumnIndex(headers, CIRCLE_NAME_ALIASES);
    const functionalTypeColumnIndex = findColumnIndex(headers, ['функциональная принадлежность', 'тип', 'type', 'functional type']);
    
    console.log("Индекс колонки с названием круга:", circleNameColumnIndex);
    console.log("Индекс колонки с функциональной принадлежностью:", functionalTypeColumnIndex);
    
    if (circleNameColumnIndex === -1) {
      console.error("CSV файл с кругами должен содержать колонку 'название круга'");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    const circles = parseCircleRows(lines, delimiter, circleNameColumnIndex, functionalTypeColumnIndex);
    
    // Add more detailed debug logging
    console.log(`Распознанные круги (${circles.length} записей):`);
    circles.forEach((circle, index) => {
      if (index < 10) { // Limit logging to avoid console flooding
        console.log(`${index + 1}. Круг: "${circle.name}", Тип: "${circle.functionalType}"`);
      }
    });
    
    return circles;
    
  } catch (error) {
    console.error("Ошибка при парсинге CSV с кругами:", error);
    return [];
  }
};

/**
 * Parse circle rows from CSV lines
 */
function parseCircleRows(
  lines: string[],
  delimiter: string,
  circleNameColumnIndex: number,
  functionalTypeColumnIndex: number = -1
): CircleData[] {
  const circles: CircleData[] = [];
  
  // Начинаем с 1, чтобы пропустить заголовки
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(value => value.trim());
    
    // Пропускаем пустые строки
    if (values.every(v => v === '')) {
      continue;
    }
    
    // Пропускаем строки без названия круга
    if (values.length <= circleNameColumnIndex || !values[circleNameColumnIndex]) {
      console.warn(`Строка ${i + 1} не содержит названия круга. Пропускаем.`);
      continue;
    }
    
    const name = values[circleNameColumnIndex].trim();
    let functionalType = "The others"; // Default value
    
    // Try to get functional type if column exists
    if (functionalTypeColumnIndex !== -1 && values.length > functionalTypeColumnIndex && values[functionalTypeColumnIndex]) {
      functionalType = normalizeFunctionalType(values[functionalTypeColumnIndex]);
    }
    
    circles.push({
      name,
      functionalType
    });
  }
  
  console.log(`Успешно распознано ${circles.length} записей о кругах`);
  
  return circles;
}
