
import { Employee } from "@/types";

// Список возможных названий для колонки с именем
const NAME_COLUMN_ALIASES = [
  'name', 'имя', 'employee name', 'полное имя', 'фио', 
  'ф.и.о.', 'ф. и. о.', 'full name', 'employee', 'сотрудник'
];

// Список возможных названий для колонки с зарплатой
const SALARY_COLUMN_ALIASES = [
  'salary', 'зарплата', 'current salary', 'текущая зарплата',
  'оклад', 'заработная плата', 'зп', 'з/п', 'з.п.', 'з. п.',
  'wage', 'pay', 'payment'
];

// Список возможных названий для колонки с участником роли
const ROLE_PARTICIPANT_ALIASES = [
  'участник роли', 'участник', 'employee', 'сотрудник', 
  'исполнитель роли', 'исполнитель', 'role participant'
];

// Список возможных названий для колонки с названием роли
const ROLE_NAME_ALIASES = [
  'название роли', 'роль', 'role', 'role name', 'наименование роли'
];

// Список возможных названий для колонки с FTE
const FTE_COLUMN_ALIASES = [
  'fte сотрудника', 'fte', 'объем fte', 'доля ставки', 'загрузка',
  'загрузка сотрудника', 'полная занятость', 'workload'
];

export const parseCSV = (csvContent: string): Employee[] => {
  try {
    // Нормализуем символы конца строки и разделители
    const normalizedContent = csvContent
      .replace(/\r\n|\r/g, '\n')
      .trim();
    
    const lines = normalizedContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.error("CSV файл не содержит данных");
      return [];
    }

    // Поддержка разных разделителей (запятая, точка с запятой, табуляция)
    let delimiter = ',';
    const firstLine = lines[0];
    if (firstLine.includes(';') && !firstLine.includes(',')) {
      delimiter = ';';
    } else if (firstLine.includes('\t') && !firstLine.includes(',')) {
      delimiter = '\t';
    }

    const headers = lines[0].split(delimiter).map(header => header.trim().toLowerCase());
    console.log("Обнаруженные заголовки:", headers);
    
    // Поиск индексов колонки имени и зарплаты
    let nameColumnIndex = -1;
    let salaryColumnIndex = -1;

    // Проверяем все возможные варианты названий колонок
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i].toLowerCase();
      
      if (nameColumnIndex === -1 && NAME_COLUMN_ALIASES.some(alias => header.includes(alias))) {
        nameColumnIndex = i;
      }
      
      if (salaryColumnIndex === -1 && SALARY_COLUMN_ALIASES.some(alias => header.includes(alias))) {
        salaryColumnIndex = i;
      }
    }
    
    console.log("Индекс колонки с именем:", nameColumnIndex);
    console.log("Индекс колонки с зарплатой:", salaryColumnIndex);
    
    if (nameColumnIndex === -1 || salaryColumnIndex === -1) {
      console.error("CSV файл должен содержать колонки с именем и зарплатой");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    const employees: Employee[] = [];
    
    // Начинаем с 1, чтобы пропустить заголовки
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map(value => value.trim());
      
      // Пропускаем пустые строки
      if (values.every(v => v === '')) {
        continue;
      }
      
      // Обработка несоответствия количества значений заголовкам
      if (values.length < Math.max(nameColumnIndex, salaryColumnIndex) + 1) {
        console.warn(`Строка ${i + 1} имеет недостаточно значений. Пропускаем.`);
        continue;
      }
      
      // Очищаем значение зарплаты от символов валюты и пробелов, заменяем запятые на точки
      const salaryValue = values[salaryColumnIndex]
        .replace(/[^0-9.,]/g, '')  // Удаляем все, кроме цифр, точек и запятых
        .replace(',', '.');         // Заменяем запятую на точку для корректного парсинга
      
      const salary = parseFloat(salaryValue);
      
      if (isNaN(salary)) {
        console.warn(`Некорректное значение зарплаты в строке ${i + 1}. Устанавливаем значение 0.`);
      }
      
      const employee: Employee = {
        name: values[nameColumnIndex] || 'Без имени',
        salary: isNaN(salary) ? 0 : salary,
      };
      
      // Добавляем остальные поля из CSV
      headers.forEach((header, index) => {
        if (index !== nameColumnIndex && index !== salaryColumnIndex && values[index]) {
          employee[header] = values[index];
        }
      });
      
      employees.push(employee);
    }
    
    console.log(`Успешно распознано ${employees.length} сотрудников`);
    return employees;
  } catch (error) {
    console.error("Ошибка при парсинге CSV:", error);
    return [];
  }
};

// Parse roles from a CSV file
export const parseRolesCSV = (csvContent: string): { participantName: string; roleName: string; fte?: number }[] => {
  try {
    // Нормализуем символы конца строки и разделители
    const normalizedContent = csvContent
      .replace(/\r\n|\r/g, '\n')
      .trim();
    
    const lines = normalizedContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      console.error("CSV файл с ролями не содержит данных");
      return [];
    }

    // Поддержка разных разделителей (запятая, точка с запятой, табуляция)
    let delimiter = ',';
    const firstLine = lines[0];
    if (firstLine.includes(';') && !firstLine.includes(',')) {
      delimiter = ';';
    } else if (firstLine.includes('\t') && !firstLine.includes(',')) {
      delimiter = '\t';
    }

    const headers = lines[0].split(delimiter).map(header => header.trim().toLowerCase());
    console.log("Обнаруженные заголовки ролей:", headers);
    
    // Find indices of participant and role name columns
    let participantColumnIndex = -1;
    let roleNameColumnIndex = -1;
    let fteColumnIndex = -1;

    // Check all possible column name variants
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i].toLowerCase();
      
      if (participantColumnIndex === -1 && 
          ROLE_PARTICIPANT_ALIASES.some(alias => header.includes(alias))) {
        participantColumnIndex = i;
      }
      
      if (roleNameColumnIndex === -1 && 
          ROLE_NAME_ALIASES.some(alias => header.includes(alias))) {
        roleNameColumnIndex = i;
      }
      
      if (fteColumnIndex === -1 && 
          FTE_COLUMN_ALIASES.some(alias => header.includes(alias))) {
        fteColumnIndex = i;
      }
    }
    
    console.log("Индекс колонки с участником роли:", participantColumnIndex);
    console.log("Индекс колонки с названием роли:", roleNameColumnIndex);
    console.log("Индекс колонки с FTE:", fteColumnIndex);
    
    if (participantColumnIndex === -1 || roleNameColumnIndex === -1) {
      console.error("CSV файл с ролями должен содержать колонки 'участник роли' и 'название роли'");
      console.error("Доступные заголовки:", headers);
      return [];
    }
    
    const roles: { participantName: string; roleName: string; fte?: number }[] = [];
    
    // Start at 1 to skip headers
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map(value => value.trim());
      
      // Skip empty lines
      if (values.every(v => v === '')) {
        continue;
      }
      
      // Handle cases where line doesn't have enough values
      if (values.length < Math.max(participantColumnIndex, roleNameColumnIndex) + 1) {
        console.warn(`Строка ${i + 1} в файле ролей имеет недостаточно значений. Пропускаем.`);
        continue;
      }
      
      const participantName = values[participantColumnIndex];
      const roleName = values[roleNameColumnIndex];
      
      if (participantName && roleName) {
        const role: { participantName: string; roleName: string; fte?: number } = {
          participantName,
          roleName
        };
        
        // Add FTE if column exists and has a valid value
        if (fteColumnIndex !== -1 && values[fteColumnIndex]) {
          // Fix FTE parsing by properly handling comma as decimal separator
          const fteString = values[fteColumnIndex].trim();
          // Convert comma to dot for proper parsing
          const normalizedFte = fteString.replace(',', '.');
          const fteValue = parseFloat(normalizedFte);
          
          if (!isNaN(fteValue)) {
            role.fte = fteValue;
            console.log(`Parsed FTE for ${participantName}: ${fteString} -> ${fteValue}`);
          } else {
            console.warn(`Invalid FTE value for ${participantName}: ${fteString}`);
          }
        }
        
        roles.push(role);
      }
    }
    
    console.log(`Успешно распознано ${roles.length} записей о ролях`);
    return roles;
  } catch (error) {
    console.error("Ошибка при парсинге CSV с ролями:", error);
    return [];
  }
};
