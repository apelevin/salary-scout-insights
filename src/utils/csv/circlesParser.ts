
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
    
    if (circleNameColumnIndex === -1) {
      console.error("CSV файл с кругами должен содержать колонку 'название круга'");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    // We can still parse circles even without functional type column
    if (functionalTypeColumnIndex === -1) {
      console.warn("В CSV файле не найдена колонка 'функциональная принадлежность'");
      console.warn("Будет выполнена попытка извлечь тип из названия круга");
    }
    
    const circles = parseCircleRows(lines, delimiter, circleNameColumnIndex, functionalTypeColumnIndex);
    
    // Add more detailed debug logging
    console.log(`Распознанные круги и их функциональные принадлежности (${circles.length} записей):`);
    circles.forEach((circle, index) => {
      if (index < 10) { // Limit logging to avoid console flooding
        console.log(`${index + 1}. Круг: "${circle.name}", Тип: "${circle.functionalType || 'Не указано'}"`);
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
    
    // Skip rows with insufficient values for circle name
    if (values.length <= circleNameColumnIndex || !values[circleNameColumnIndex]) {
      console.warn(`Строка ${i + 1} не содержит названия круга. Пропускаем.`);
      continue;
    }
    
    const name = values[circleNameColumnIndex].trim();
    let functionalType = "";
    
    // Get functional type from column if available
    if (functionalTypeColumnIndex !== -1 && values.length > functionalTypeColumnIndex && values[functionalTypeColumnIndex]) {
      functionalType = values[functionalTypeColumnIndex].trim();
      console.log(`Круг "${name}": найден тип в колонке: "${functionalType}"`);
    }
    
    // If no functional type specified, try to extract from name
    if (!functionalType) {
      const lowerName = name.toLowerCase();
      
      if (lowerName.includes('delivery') && lowerName.includes('discovery')) {
        functionalType = 'Delivery & Discovery';
      } else if (lowerName.includes('delivery')) {
        functionalType = 'Delivery';
      } else if (lowerName.includes('discovery')) {
        functionalType = 'Discovery';
      } else if (lowerName.includes('platform')) {
        functionalType = 'Platform';
      } else if (lowerName.includes('enablement')) {
        functionalType = 'Enablement';
      } else {
        functionalType = 'Не указано';
      }
      
      console.log(`Круг "${name}": извлечён функциональный тип из названия: "${functionalType}"`);
    }
    
    circles.push({
      name,
      functionalType
    });
  }
  
  console.log(`Успешно распознано ${circles.length} записей о кругах и их типах`);
  
  return circles;
}
