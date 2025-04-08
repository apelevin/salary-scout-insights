
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleData } from "@/types";
import { Employee } from "@/types";

interface RolesTableProps {
  rolesData: RoleData[];
  isLoading?: boolean;
  employees?: Employee[];
}

const RolesTable = ({ 
  rolesData = [], 
  isLoading = false,
  employees = []
}: RolesTableProps) => {
  // Helper functions first
  const cleanRoleName = (roleName: string): string => {
    return roleName.replace(/["']/g, '').trim();
  };

  const formatSalary = (salary: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Calculate standard salary based on min and max values
  const calculateStandardSalary = (min: number, max: number): number => {
    if (min === max) {
      return max;
    }
    return min + (max - min) * 0.7;
  };

  // Get unique role names and sort them in descending alphabetical order
  const uniqueRoles = [...new Set(rolesData.map((role) => cleanRoleName(role.roleName)))]
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));

  // Function to find all salaries associated with a role
  const findSalariesForRole = (roleName: string): number[] => {
    if (!roleName || !rolesData.length || !employees.length) return [];
    
    const salaries: number[] = [];
    const normalizedRoleName = roleName.toLowerCase();
    
    // Find all employees who have this role
    rolesData.forEach(entry => {
      if (!entry.participantName || !entry.roleName) return;
      
      const cleanedRoleName = cleanRoleName(entry.roleName).toLowerCase();
      
      if (cleanedRoleName === normalizedRoleName) {
        // Find this participant in employees list
        const participantNameParts = entry.participantName
          .replace(/["']/g, '')
          .trim()
          .split(/\s+/)
          .map(part => part.toLowerCase());
        
        if (participantNameParts.length < 2) return;
          
        const lastName = participantNameParts[0];
        const firstName = participantNameParts[1];
        
        employees.forEach(emp => {
          const empNameParts = emp.name
            .replace(/["']/g, '')
            .trim()
            .split(/\s+/)
            .map(part => part.toLowerCase());
          
          if (
            empNameParts.some(part => part === lastName) && 
            empNameParts.some(part => part === firstName)
          ) {
            salaries.push(emp.salary);
          }
        });
      }
    });
    
    return salaries;
  };

  if (isLoading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-500">
          Загрузка данных...
        </div>
      </div>
    );
  }

  if (uniqueRoles.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="text-lg text-gray-500">
          Нет доступных ролей. Загрузите файл с данными о ролях.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Название роли</TableHead>
              <TableHead className="w-1/5">Мин. зарплата</TableHead>
              <TableHead className="w-1/5">Макс. зарплата</TableHead>
              <TableHead className="w-1/4">Стандартный оклад</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueRoles.map((role, index) => {
              const salaries = findSalariesForRole(role);
              const minSalary = salaries.length ? Math.min(...salaries) : 0;
              const maxSalary = salaries.length ? Math.max(...salaries) : 0;
              const standardSalary = salaries.length ? calculateStandardSalary(minSalary, maxSalary) : 0;
              
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{role}</TableCell>
                  <TableCell>
                    {salaries.length ? (
                      formatSalary(minSalary)
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {salaries.length ? (
                      formatSalary(maxSalary)
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {salaries.length ? (
                      formatSalary(standardSalary)
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500 mt-3">
        Всего ролей: {uniqueRoles.length}
      </div>
    </div>
  );
};

export default RolesTable;
