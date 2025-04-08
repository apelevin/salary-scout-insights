
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee, RoleData } from "@/types";

interface RolesTableProps {
  rolesData: RoleData[];
  employees?: Employee[];
  isLoading?: boolean;
}

const RolesTable = ({ rolesData = [], employees = [], isLoading = false }: RolesTableProps) => {
  // Get unique role names and sort them in ascending alphabetical order
  const rolesWithSalaries = getRolesWithSalaries(rolesData, employees);
  
  if (isLoading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-500">
          Загрузка данных...
        </div>
      </div>
    );
  }

  if (rolesWithSalaries.length === 0) {
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
              <TableHead>Название роли</TableHead>
              <TableHead className="text-right">Ставка</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rolesWithSalaries.map((role, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell className="text-right">
                  {role.salary ? formatSalary(role.salary) : "Не определена"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500 mt-3">
        Всего ролей: {rolesWithSalaries.length}
      </div>
    </div>
  );
};

// Helper function to find salaries for each role
function getRolesWithSalaries(rolesData: RoleData[], employees: Employee[]) {
  const roleNameToParticipants: Record<string, string[]> = {};
  
  // Collect all participants for each role
  rolesData.forEach(role => {
    const cleanRoleName = role.roleName.replace(/['"]/g, '').trim();
    if (!cleanRoleName) return;
    
    if (!roleNameToParticipants[cleanRoleName]) {
      roleNameToParticipants[cleanRoleName] = [];
    }
    
    const participantName = role.participantName.replace(/['"]/g, '').trim();
    if (participantName) {
      roleNameToParticipants[cleanRoleName].push(participantName);
    }
  });
  
  // Get unique roles and assign salaries
  const uniqueRoles = Object.keys(roleNameToParticipants).sort((a, b) => a.localeCompare(b));
  
  return uniqueRoles.map(roleName => {
    const participants = roleNameToParticipants[roleName];
    let salary = findSalaryForRole(participants, employees);
    
    return {
      name: roleName,
      salary: salary
    };
  });
}

// Find the salary for a role based on its participants
function findSalaryForRole(participants: string[], employees: Employee[]): number | null {
  if (!participants.length || !employees.length) return null;
  
  for (const participant of participants) {
    // Split participant name into components
    const participantParts = participant.toLowerCase().split(/\s+/);
    
    // Try to find a matching employee
    for (const employee of employees) {
      const employeeName = employee.name.replace(/['"]/g, '').trim().toLowerCase();
      const employeeParts = employeeName.split(/\s+/);
      
      // Check if this employee matches the participant
      // We consider a match if any parts of the names match
      const nameMatches = participantParts.some(part => 
        employeeParts.some(empPart => empPart === part && part.length > 1)
      );
      
      if (nameMatches && employee.salary) {
        return employee.salary;
      }
    }
  }
  
  return null;
}

// Format salary as Russian currency
function formatSalary(salary: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(salary);
}

export default RolesTable;
