
import { LeadershipData, LeadershipTableData } from "@/types";

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

export const transformLeadershipData = (leadershipData: LeadershipData[]): LeadershipTableData[] => {
  const leadershipMap = new Map<string, Map<string, number>>();
  
  // Group by leadership type
  leadershipData.forEach(item => {
    if (!item.leadershipType && item.roleName) {
      // Extract leadership type from roleName format: "Type (X кругов)"
      const match = item.roleName.match(/^(.+?)\s+\(\d+/);
      item.leadershipType = match ? match[1] : item.roleName;
      
      // Extract circle count from roleName
      const circleMatch = item.roleName.match(/\((\d+)\s+кругов\)/);
      item.circleCount = circleMatch ? circleMatch[1] : "";
    }
    
    const leadershipType = item.leadershipType || "";
    const circleCount = item.circleCount || "";
    
    if (!leadershipMap.has(leadershipType)) {
      leadershipMap.set(leadershipType, new Map<string, number>());
    }
    
    const typeEntry = leadershipMap.get(leadershipType);
    if (typeEntry && circleCount) {
      typeEntry.set(circleCount, item.standardSalary);
    }
  });
  
  // Convert to array format
  const result: LeadershipTableData[] = [];
  leadershipMap.forEach((circleSalaries, leadershipType) => {
    result.push({
      leadershipType,
      circleSalaries
    });
  });
  
  return result;
};
