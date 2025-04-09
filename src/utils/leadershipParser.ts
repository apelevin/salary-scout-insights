
import { LeadershipData } from "@/types";

export const parseLeadershipCSV = (csvContent: string): LeadershipData[] => {
  const rows = csvContent.split('\n');
  const headers = rows[0].split(',').map(header => header.trim());
  
  if (headers.length < 2) {
    console.error("Неверный формат файла лидерства: недостаточно колонок");
    return [];
  }
  
  const leadershipData: LeadershipData[] = [];
  
  // Пропускаем заголовок (первую строку)
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const columns = rows[i].split(',').map(col => col.trim());
    
    if (columns.length < 2) continue;
    
    const leadershipType = columns[0]?.replace(/["']/g, '');
    
    if (!leadershipType) continue;
    
    // Обрабатываем каждую колонку с количеством кругов (со второй по последнюю)
    for (let j = 1; j < columns.length; j++) {
      const circleCount = headers[j]?.replace(/["']/g, '');
      const salaryStr = columns[j]?.replace(/[^\d.-]/g, '');
      
      if (!circleCount || !salaryStr || salaryStr === '') continue;
      
      const salary = Number(salaryStr);
      
      if (isNaN(salary)) continue;
      
      leadershipData.push({
        roleName: `${leadershipType} (${circleCount} кругов)`,
        standardSalary: salary,
        description: `Лидерство типа "${leadershipType}" с ${circleCount} кругами`
      });
    }
  }
  
  return leadershipData;
};
