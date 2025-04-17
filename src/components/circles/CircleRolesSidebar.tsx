
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { RoleData, Employee } from "@/types";
import { cleanRoleName, formatName, formatFTE, formatSalary } from "@/utils/formatUtils";
import { useRolesData } from "@/hooks/useRolesData";
import { useMemo } from "react";
import { findEmployeeByName } from "@/utils/employeeUtils";
import { formatActualIncome } from "../utils/EmployeeUtils";

interface CircleRolesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  circleName: string | null;
  rolesData: RoleData[];
  employees: Employee[];
}

interface RoleParticipant {
  name: string;
  fte: number;
  standardIncome?: number;
  actualIncome?: string;
}

interface RoleWithParticipants {
  roleName: string;
  participants: RoleParticipant[];
  standardSalary: number;
}

const CircleRolesSidebar = ({
  isOpen,
  onClose,
  circleName,
  rolesData,
  employees
}: CircleRolesSidebarProps) => {
  // Get roles data with standard salaries
  const { roles: rolesWithSalaries } = useRolesData(rolesData, employees);

  // Constants for leader role names
  const LEADER_ROLES = useMemo(() => ({
    OPERATIONAL: "лидер операционного круга",
    STRATEGIC: "лидер стратегического круга",
    GENERIC: "лидер"
  }), []);

  // Process circle data using useMemo to avoid recalculations
  const { circleLeader, rolesWithParticipants } = useMemo(() => {
    // Find leader for this circle
    const circleLeader = rolesData.find(role => {
      if (!role.circleName || !role.roleName) return false;
      
      const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
      const normalizedRoleName = role.roleName.toLowerCase();
      const isCurrentCircle = normalizedCircleName === circleName;
      
      return isCurrentCircle && (
        normalizedRoleName.includes(LEADER_ROLES.OPERATIONAL) || 
        normalizedRoleName.includes(LEADER_ROLES.STRATEGIC) ||
        normalizedRoleName === LEADER_ROLES.GENERIC
      );
    });

    // Filter roles that belong to the selected circle
    const circleRoles = rolesData.filter(role => {
      if (!role.circleName || !role.roleName) return false;
      
      const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
      const normalizedRoleName = role.roleName.toLowerCase();
      const isCurrentCircle = normalizedCircleName === circleName;
      
      // Exclude leader roles
      const isLeaderRole = 
        normalizedRoleName.includes(LEADER_ROLES.OPERATIONAL) || 
        normalizedRoleName.includes(LEADER_ROLES.STRATEGIC) ||
        normalizedRoleName === LEADER_ROLES.GENERIC;
      
      return isCurrentCircle && !isLeaderRole;
    });

    // Process roles more efficiently with reduce
    const roleMap = circleRoles.reduce((acc, role) => {
      const cleanedRoleName = cleanRoleName(role.roleName);
      const participantName = formatName(role.participantName);
      const fte = role.fte || 0;
      
      // Find standard salary for this role
      const roleSalaryInfo = rolesWithSalaries.find(r => 
        r.roleName.toLowerCase() === cleanedRoleName.toLowerCase()
      );
      const standardSalary = roleSalaryInfo?.standardSalary || 0;
      
      // Calculate standard income based on FTE and standard salary
      const standardIncome = fte * standardSalary;
      
      // Find the employee to get actual salary information
      const employee = findEmployeeByName(employees, participantName);
      const actualIncome = formatActualIncome(employee, fte);
      
      if (!acc.has(cleanedRoleName)) {
        acc.set(cleanedRoleName, {
          participants: [],
          standardSalary
        });
      }
      
      const roleData = acc.get(cleanedRoleName);
      
      // Check if participant already exists
      const existingParticipantIndex = roleData.participants.findIndex(p => p.name === participantName);
      
      if (existingParticipantIndex >= 0) {
        // Update existing participant's FTE
        roleData.participants[existingParticipantIndex].fte += fte;
        roleData.participants[existingParticipantIndex].standardIncome = 
          roleData.participants[existingParticipantIndex].fte * standardSalary;
          
        // Update actual income
        if (employee) {
          roleData.participants[existingParticipantIndex].actualIncome = 
            formatActualIncome(employee, roleData.participants[existingParticipantIndex].fte);
        }
      } else {
        // Add new participant
        roleData.participants.push({
          name: participantName,
          fte,
          standardIncome,
          actualIncome
        });
      }
      
      return acc;
    }, new Map<string, { participants: RoleParticipant[]; standardSalary: number }>());

    // Convert map to array and sort by role name
    const rolesWithParticipants: RoleWithParticipants[] = Array.from(roleMap.entries())
      .map(([roleName, data]) => ({
        roleName,
        participants: data.participants.sort((a, b) => a.name.localeCompare(b.name, "ru")),
        standardSalary: data.standardSalary
      }))
      .sort((a, b) => a.roleName.localeCompare(b.roleName, "ru"));

    return { 
      circleLeader,
      rolesWithParticipants
    };
  }, [circleName, rolesData, rolesWithSalaries, LEADER_ROLES, employees]);

  // Get leader name and FTE if available
  const leaderName = circleLeader ? formatName(circleLeader.participantName) : null;
  const leaderFte = circleLeader ? circleLeader.fte || 0 : 0;

  // Render circle role participant
  const renderParticipant = (participant, idx) => (
    <li key={idx} className="hover:bg-gray-100 rounded-sm px-1 py-1">
      <div className="flex justify-between items-center">
        <span>{participant.name}</span>
        <span className="text-gray-500 font-mono">
          FTE: {formatFTE(participant.fte)}
        </span>
      </div>
      {participant.standardIncome && participant.standardIncome > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          Стандартный доход: {formatSalary(participant.standardIncome)}
        </div>
      )}
      {participant.actualIncome && (
        <div className="text-xs text-gray-600 mt-1">
          Текущий доход: {participant.actualIncome}
        </div>
      )}
    </li>
  );

  // Render role with all its participants
  const renderRole = (role, index) => (
    <li key={index} className="px-2 py-2 rounded-md border border-gray-100">
      <div className="font-medium">
        {role.roleName}
        {role.standardSalary > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            Стандартный оклад: {formatSalary(role.standardSalary)}
          </div>
        )}
      </div>
      <ul className="pl-4 mt-2 text-sm text-gray-600 space-y-2">
        {role.participants.map(renderParticipant)}
      </ul>
    </li>
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pr-8">
          <SheetTitle className="text-xl">{circleName || ""}</SheetTitle>
          {leaderName && (
            <div className="text-sm text-gray-600">
              Лидер: {leaderName}
              <span className="ml-2 text-gray-500 font-mono">
                FTE: {formatFTE(leaderFte)}
              </span>
            </div>
          )}
          <SheetDescription>
            Роли в этом круге ({rolesWithParticipants.length})
          </SheetDescription>
        </SheetHeader>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть</span>
        </SheetClose>
        
        <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
          <div className="space-y-1 pr-4">
            {rolesWithParticipants.length > 0 ? (
              <ul className="space-y-6">
                {rolesWithParticipants.map(renderRole)}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">В этом круге нет определенных ролей</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CircleRolesSidebar;
