
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
    console.log("Обнаруженные заголовки:", headers);
    
    // Find required column indices
    const nameColumnIndex = findColumnIndex(headers, NAME_COLUMN_ALIASES);
    const salaryColumnIndex = findColumnIndex(headers, SALARY_COLUMN_ALIASES);
    
    console.log("Индекс колонки с именем:", nameColumnIndex);
    console.log("Индекс колонки с зарплатой:", salaryColumnIndex);
    
    if (nameColumnIndex === -1 || salaryColumnIndex === -1) {
      console.error("CSV файл должен содержать колонки с именем и зарплатой");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    return parseEmployeeRows(lines, headers, delimiter, nameColumnIndex, salaryColumnIndex);
    
  } catch (error) {
    console.error("Ошибка при парсинге CSV:", error);
    return [];
  }
};

/**
 * Parse employee rows from CSV lines
 */
function parseEmployeeRows(
  lines: string[], 
  headers: string[], 
  delimiter: string, 
  nameColumnIndex: number, 
  salaryColumnIndex: number
): Employee[] {
  const employees: Employee[] = [];
  
  // Start at 1 to skip headers
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(value => value.trim());
    
    // Skip empty rows
    if (values.every(v => v === '')) {
      continue;
    }
    
    // Skip rows with insufficient values
    if (values.length < Math.max(nameColumnIndex, salaryColumnIndex) + 1) {
      console.warn(`Строка ${i + 1} имеет недостаточно значений. Пропускаем.`);
      continue;
    }
    
    const employee = createEmployeeFromValues(values, headers, nameColumnIndex, salaryColumnIndex);
    employees.push(employee);
  }
  
  console.log(`Успешно распознано ${employees.length} сотрудников`);
  return employees;
}

/**
 * Create an employee object from CSV values
 */
function createEmployeeFromValues(
  values: string[], 
  headers: string[], 
  nameColumnIndex: number, 
  salaryColumnIndex: number
): Employee {
  // Parse salary value
  const salaryValue = values[salaryColumnIndex]
    .replace(/[^0-9.,]/g, '')  // Remove all except numbers, dots and commas
    .replace(',', '.');         // Replace comma with dot for correct parsing
  
  const salary = parseFloat(salaryValue);
  
  if (isNaN(salary)) {
    console.warn(`Некорректное значение зарплаты. Устанавливаем значение 0.`);
  }
  
  const employee: Employee = {
    name: values[nameColumnIndex] || 'Без имени',
    salary: isNaN(salary) ? 0 : salary,
  };
  
  // Add remaining fields from CSV
  headers.forEach((header, index) => {
    if (index !== nameColumnIndex && index !== salaryColumnIndex && values[index]) {
      employee[header] = values[index];
    }
  });
  
  return employee;
}
