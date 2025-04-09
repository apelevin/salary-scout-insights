
import { LeadershipData } from "@/types";

export const parseLeadershipCSV = (csvContent: string): LeadershipData[] => {
  const rows = csvContent.split('\n');
  const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
  
  const roleNameIndex = headers.findIndex(h => 
    h.includes('роль') || h.includes('role') || h.includes('название')
  );
  
  const salaryIndex = headers.findIndex(h => 
    h.includes('оклад') || h.includes('зарплата') || h.includes('salary') || h.includes('standard')
  );
  
  const descriptionIndex = headers.findIndex(h => 
    h.includes('описание') || h.includes('description')
  );
  
  if (roleNameIndex === -1 || salaryIndex === -1) {
    console.error("Необходимые колонки не найдены в файле лидерства");
    return [];
  }
  
  const leadershipData: LeadershipData[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const columns = rows[i].split(',').map(col => col.trim());
    const roleName = columns[roleNameIndex]?.replace(/["']/g, '');
    const salaryStr = columns[salaryIndex]?.replace(/[^\d.-]/g, '');
    
    if (!roleName || !salaryStr) continue;
    
    const salary = Number(salaryStr);
    
    if (isNaN(salary)) continue;
    
    const leadershipItem: LeadershipData = {
      roleName,
      standardSalary: salary
    };
    
    if (descriptionIndex !== -1 && columns[descriptionIndex]) {
      leadershipItem.description = columns[descriptionIndex].replace(/["']/g, '');
    }
    
    leadershipData.push(leadershipItem);
  }
  
  return leadershipData;
};
