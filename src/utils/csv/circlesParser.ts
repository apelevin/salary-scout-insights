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
    
    // Also check for "функциональная принадлежность" column explicitly
    let functionalTypeColIndex = functionalTypeColumnIndex;
    if (functionalTypeColIndex === -1) {
      functionalTypeColIndex = headers.findIndex(h => 
        h === "функциональная принадлежность" || 
        h === "функциональная принадлежность "
      );
      if (functionalTypeColIndex !== -1) {
        console.log("Найдена точная колонка 'функциональная принадлежность' по индексу:", functionalTypeColIndex);
      } else {
        console.warn("В CSV файле не найдена колонка 'функциональная принадлежность'");
        console.warn("Будет выполнена попытка извлечь тип из названия круга");
      }
    }
    
    const circles = parseCircleRows(lines, delimiter, circleNameColumnIndex, functionalTypeColIndex);
    
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
    
    // Используем последнюю колонку для функционального типа
    let functionalType = "";
    if (values.length > 0) {
      // Берем последнюю колонку
      functionalType = values[values.length - 1].trim();
      console.log(`Круг "${name}": найден тип в последней колонке: "${functionalType}"`);
    }
    
    // Если функциональный тип не указан, используем значение по умолчанию
    if (!functionalType) {
      functionalType = 'Не указано';
    }
    
    circles.push({
      name,
      functionalType
    });
  }
  
  console.log(`Успешно распознано ${circles.length} записей о кругах и их типах`);
  
  return circles;
}
