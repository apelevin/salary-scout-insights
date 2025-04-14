
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
    
    console.log("Индекс колонки с названием круга:", circleNameColumnIndex);
    
    if (circleNameColumnIndex === -1) {
      console.error("CSV файл с кругами должен содержать колонку 'название круга'");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    // Specifically use column 5 (index 4) for functional type, as requested by the user
    const functionalTypeColumnIndex = 4; // Explicitly using column 5 (index 4)
    console.log("Используем колонку 5 (индекс 4) для функциональной принадлежности");
    
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
    
    let functionalType = "";
    
    // Пытаемся получить функциональную принадлежность из колонки 5 (индекс 4)
    if (values.length > functionalTypeColumnIndex) {
      functionalType = values[functionalTypeColumnIndex].trim();
      console.log(`Круг "${name}": найден тип в колонке 5: "${functionalType}"`);
    } else {
      console.warn(`Для круга "${name}" нет данных в колонке 5 (индекс ${functionalTypeColumnIndex})`);
    }
    
    // Нормализуем значение функционального типа к одному из четырех допустимых значений
    functionalType = normalizeCircleType(functionalType);
    
    circles.push({
      name,
      functionalType
    });
  }
  
  console.log(`Успешно распознано ${circles.length} записей о кругах и их типах`);
  
  return circles;
}

/**
 * Normalize the functional type to one of the allowed values
 */
function normalizeCircleType(type: string): string {
  const normalizedType = type.trim().toLowerCase();
  
  // Check for exact matches or substring matches
  if (normalizedType === '' || normalizedType === 'undefined' || normalizedType === 'null') {
    return 'The others';
  } else if (normalizedType.includes('marketing') || normalizedType.includes('маркетинг')) {
    return 'Marketing';
  } else if (
    (normalizedType.includes('delivery') && normalizedType.includes('discovery')) ||
    normalizedType.includes('delivery & discovery')
  ) {
    return 'Delivery & Discovery';
  } else if (normalizedType.includes('sales') || normalizedType.includes('продажи')) {
    return 'Sales';
  } else if (normalizedType.includes('discovery') || normalizedType.includes('hub')) {
    return 'Discovery (Hub)';
  } else if (normalizedType.includes('delivery')) {
    return 'Delivery';
  }
  
  // Default case
  return 'The others';
}
