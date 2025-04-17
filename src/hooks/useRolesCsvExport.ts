
import { toast } from "@/components/ui/use-toast";
import { RoleWithSalaries } from "./useRolesData";

export const useRolesCsvExport = () => {
  const downloadCSV = (roles: RoleWithSalaries[]) => {
    if (roles.length === 0) {
      toast({
        title: "Нет данных для выгрузки",
        description: "Загрузите данные о ролях, прежде чем экспортировать их в CSV.",
        variant: "destructive",
      });
      return;
    }

    // Prepare CSV content
    const headers = ["Название роли", "Стандартный оклад"];
    
    // Convert role data to CSV rows
    const rows = roles.map(role => {
      const salary = role.standardSalary ? 
        role.standardSalary.toString().replace('.', ',') : 
        "0";
      return [role.roleName, salary];
    });
    
    // Combine headers and rows into CSV string
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link attributes
    link.setAttribute('href', url);
    link.setAttribute('download', `roles-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    // Add to document, trigger download and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Экспорт завершен",
      description: `Файл со списком ${roles.length} ролей успешно скачан.`,
    });
  };

  return { downloadCSV };
};
