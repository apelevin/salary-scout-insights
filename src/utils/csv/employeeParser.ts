
import { Employee } from "@/types";
import { 
  normalizeCSVContent, 
  detectDelimiter, 
  findColumnIndex 
} from "./helpers";
import {
  NAME_COLUMN_ALIASES,
  SALARY_COLUMN_ALIASES
} from "./constants";

/**
 * Parse employees data from CSV content
 */
export const parseEmployeesCSV = (csvContent: string): Employee[] => {
  try {
    const normalizedContent = normalizeCSVContent(csvContent);
    const lines = normalizedContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.error("CSV файл не содержит данных");
      return [];
    }

    const delimiter = detectDelimiter(lines[0]);
    const headers = lines[0].split(delimiter).map(header => header.trim().toLowerCase());
    
    // Find required column indices
    const nameColumnIndex = findColumnIndex(headers, NAME_COLUMN_ALIASES);
    const salaryColumnIndex = findColumnIndex(headers, SALARY_COLUMN_ALIASES);
    
    if (nameColumnIndex === -1 || salaryColumnIndex === -1) {
      console.error("CSV файл должен содержать колонки с именем и зарплатой");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    // Создаем кэш для обработанных строк для повышения производительности
    const employeeBatch: Employee[] = [];
    const batchSize = 500;
    
    // Обработка строк пакетами для улучшения производительности
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map(value => value.trim());
      
      // Skip empty rows
      if (values.every(v => v === '')) {
        continue;
      }
      
      // Skip rows with insufficient values
      if (values.length < Math.max(nameColumnIndex, salaryColumnIndex) + 1) {
        continue;
      }
      
      const employee = createEmployeeFromValues(values, headers, nameColumnIndex, salaryColumnIndex, i);
      employeeBatch.push(employee);
    }
    
    return employeeBatch;
    
  } catch (error) {
    console.error("Ошибка при парсинге CSV:", error);
    return [];
  }
};

/**
 * Create an employee object from CSV values
 */
function createEmployeeFromValues(
  values: string[], 
  headers: string[], 
  nameColumnIndex: number, 
  salaryColumnIndex: number,
  index: number
): Employee {
  // Parse salary value
  const salaryValue = values[salaryColumnIndex]
    .replace(/[^0-9.,]/g, '')  // Remove all except numbers, dots and commas
    .replace(',', '.');         // Replace comma with dot for correct parsing
  
  const salary = parseFloat(salaryValue);
  
  const employee: Employee = {
    id: `emp-${index}`, // Добавляем уникальный ID для оптимизации рендера списков
    name: values[nameColumnIndex] || 'Без имени',
    salary: isNaN(salary) ? 0 : salary,
  };
  
  // Add remaining fields from CSV - оптимизированный вариант
  for (let i = 0; i < headers.length; i++) {
    if (i !== nameColumnIndex && i !== salaryColumnIndex && values[i]) {
      employee[headers[i]] = values[i];
    }
  }
  
  return employee;
}
