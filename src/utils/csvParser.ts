
import { Employee } from "@/types";

export const parseCSV = (csvContent: string): Employee[] => {
  try {
    const lines = csvContent.split(/\r\n|\n/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return [];
    }

    const headers = lines[0].split(',').map(header => header.trim());
    
    // Проверяем, что в CSV файле есть необходимые колонки
    const nameColumnIndex = headers.findIndex(h => 
      h.toLowerCase() === 'name' || 
      h.toLowerCase() === 'имя' || 
      h.toLowerCase() === 'employee name' ||
      h.toLowerCase() === 'полное имя'
    );
    
    const salaryColumnIndex = headers.findIndex(h => 
      h.toLowerCase() === 'salary' || 
      h.toLowerCase() === 'зарплата' ||
      h.toLowerCase() === 'current salary' ||
      h.toLowerCase() === 'текущая зарплата'
    );
    
    if (nameColumnIndex === -1 || salaryColumnIndex === -1) {
      console.error("CSV файл должен содержать колонки с именем и зарплатой");
      return [];
    }
    
    const employees: Employee[] = [];
    
    // Начинаем с 1, чтобы пропустить заголовки
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      
      if (values.length !== headers.length) {
        console.warn(`Строка ${i + 1} имеет неверное количество значений. Пропускаем.`);
        continue;
      }
      
      const employee: Employee = {
        name: values[nameColumnIndex],
        salary: parseFloat(values[salaryColumnIndex]) || 0,
      };
      
      // Добавляем остальные поля из CSV
      headers.forEach((header, index) => {
        if (index !== nameColumnIndex && index !== salaryColumnIndex) {
          employee[header] = values[index];
        }
      });
      
      employees.push(employee);
    }
    
    return employees;
  } catch (error) {
    console.error("Ошибка при парсинге CSV:", error);
    return [];
  }
};
