
import { CircleData } from "@/types";
import { 
  normalizeCSVContent, 
  detectDelimiter, 
  findColumnIndex 
} from "./helpers";
import {
  CIRCLE_NAME_ALIASES,
  FUNCTIONAL_TYPE_ALIASES
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
    const functionalTypeColumnIndex = findColumnIndex(headers, FUNCTIONAL_TYPE_ALIASES);
    
    console.log("Индекс колонки с названием круга:", circleNameColumnIndex);
    console.log("Индекс колонки с функциональным типом:", functionalTypeColumnIndex);
    
    if (circleNameColumnIndex === -1 || functionalTypeColumnIndex === -1) {
      console.error("CSV файл с кругами должен содержать колонки 'название круга' и 'функциональная принадлежность'");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    return parseCircleRows(lines, delimiter, circleNameColumnIndex, functionalTypeColumnIndex);
    
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
  functionalTypeColumnIndex: number
): CircleData[] {
  const circles: CircleData[] = [];
  
  // Start at 1 to skip headers
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(value => value.trim());
    
    // Skip empty rows
    if (values.every(v => v === '')) {
      continue;
    }
    
    // Skip rows with insufficient values
    if (values.length < Math.max(circleNameColumnIndex, functionalTypeColumnIndex) + 1) {
      console.warn(`Строка ${i + 1} в файле кругов имеет недостаточно значений. Пропускаем.`);
      continue;
    }
    
    const name = values[circleNameColumnIndex];
    const functionalType = values[functionalTypeColumnIndex];
    
    if (name && functionalType) {
      circles.push({
        name: name.trim(),
        functionalType: functionalType.trim()
      });
    }
  }
  
  console.log(`Успешно распознано ${circles.length} записей о кругах и их типах`);
  return circles;
}
