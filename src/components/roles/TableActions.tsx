
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleWithSalaries } from "@/hooks/useRolesData";
import { useRolesCsvExport } from "@/hooks/useRolesCsvExport";

interface TableActionsProps {
  roles: RoleWithSalaries[];
}

const TableActions = ({ roles }: TableActionsProps) => {
  const { downloadCSV } = useRolesCsvExport();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-gray-500">
        Всего ролей: {roles.length}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => downloadCSV(roles)}
        className="flex items-center gap-2"
      >
        <Download size={16} /> 
        Скачать CSV
      </Button>
    </div>
  );
};

export default TableActions;
