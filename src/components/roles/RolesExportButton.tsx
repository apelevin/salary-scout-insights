
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RolesExportButtonProps {
  roles: Array<{
    roleName: string;
    standardSalary: number;
  }>;
}

const RolesExportButton = ({ roles }: RolesExportButtonProps) => {
  const downloadCSV = () => {
    if (roles.length === 0) {
      toast({
        title: "Нет данных для выгрузки",
        description: "Загрузите данные о ролях, прежде чем экспортировать их в CSV.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Название роли", "Стандартный оклад"];
    
    const rows = roles.map(role => {
      const salary = role.standardSalary ? 
        role.standardSalary.toString().replace('.', ',') : 
        "0";
      return [role.roleName, salary];
    });
    
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `roles-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Экспорт завершен",
      description: `Файл со списком ${roles.length} ролей успешно скачан.`,
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={downloadCSV}
      className="flex items-center gap-2"
    >
      <Download size={16} /> 
      Скачать CSV
    </Button>
  );
};

export default RolesExportButton;
