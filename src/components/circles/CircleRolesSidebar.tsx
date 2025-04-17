
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

interface CircleRolesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  circleName: string | null;
  rolesData: RoleData[];
  employees: Employee[];
}

interface RoleWithParticipants {
  roleName: string;
  participants: Array<{
    name: string;
    fte: number;
    standardIncome?: number;
  }>;
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
  const OPERATIONAL_CIRCLE_LEADER = "лидер операционного круга";
  const STRATEGIC_CIRCLE_LEADER = "лидер стратегического круга";
  const GENERIC_LEADER_ROLE = "лидер";

  // Find leader for this circle
  const circleLeader = rolesData.find(role => {
    if (!role.circleName || !role.roleName) return false;
    
    const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
    const normalizedRoleName = role.roleName.toLowerCase();
    const isCurrentCircle = normalizedCircleName === circleName;
    
    return isCurrentCircle && (
      normalizedRoleName.includes(OPERATIONAL_CIRCLE_LEADER) || 
      normalizedRoleName.includes(STRATEGIC_CIRCLE_LEADER) ||
      normalizedRoleName === GENERIC_LEADER_ROLE
    );
  });

  // Get leader name and FTE if available
  const leaderName = circleLeader ? formatName(circleLeader.participantName) : null;
  const leaderFte = circleLeader ? circleLeader.fte || 0 : 0;

  // Filter roles that belong to the selected circle
  const circleRoles = rolesData.filter(role => {
    if (!role.circleName || !role.roleName) return false;
    
    const normalizedCircleName = role.circleName.replace(/["']/g, '').trim();
    const normalizedRoleName = role.roleName.toLowerCase();
    const isCurrentCircle = normalizedCircleName === circleName;
    
    // Exclude leader roles
    const isLeaderRole = 
      normalizedRoleName.includes(OPERATIONAL_CIRCLE_LEADER) || 
      normalizedRoleName.includes(STRATEGIC_CIRCLE_LEADER) ||
      normalizedRoleName === GENERIC_LEADER_ROLE;
    
    return isCurrentCircle && !isLeaderRole;
  });

  // Group roles by name and collect participants with FTE for each role
  const roleMap = new Map<string, Array<{name: string; fte: number; standardIncome?: number}>>();
  const roleStandardSalaries = new Map<string, number>();
  
  circleRoles.forEach(role => {
    const cleanedRoleName = cleanRoleName(role.roleName);
    const participantName = formatName(role.participantName);
    const fte = role.fte || 0;
    
    // Find standard salary for this role
    const roleSalaryInfo = rolesWithSalaries.find(r => 
      r.roleName.toLowerCase() === cleanedRoleName.toLowerCase()
    );
    const standardSalary = roleSalaryInfo?.standardSalary || 0;
    
    // Store standard salary for this role
    roleStandardSalaries.set(cleanedRoleName, standardSalary);
    
    // Calculate standard income based on FTE and standard salary
    const standardIncome = fte * standardSalary;
    
    if (roleMap.has(cleanedRoleName)) {
      const participants = roleMap.get(cleanedRoleName) || [];
      
      // Check if participant already exists
      const existingParticipant = participants.findIndex(p => p.name === participantName);
      
      if (existingParticipant >= 0) {
        // Update existing participant's FTE
        participants[existingParticipant].fte += fte;
        participants[existingParticipant].standardIncome = 
          (participants[existingParticipant].fte * standardSalary);
      } else {
        // Add new participant
        participants.push({
          name: participantName,
          fte,
          standardIncome
        });
      }
      
      roleMap.set(cleanedRoleName, participants);
    } else {
      roleMap.set(cleanedRoleName, [{
        name: participantName,
        fte,
        standardIncome
      }]);
    }
  });

  // Convert map to array and sort by role name
  const rolesWithParticipants: RoleWithParticipants[] = Array.from(roleMap.entries())
    .map(([roleName, participants]) => ({
      roleName,
      participants: participants.sort((a, b) => a.name.localeCompare(b.name, "ru")),
      standardSalary: roleStandardSalaries.get(roleName) || 0
    }))
    .sort((a, b) => a.roleName.localeCompare(b.roleName, "ru"));

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
                {rolesWithParticipants.map((role, index) => (
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
                      {role.participants.map((participant, idx) => (
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
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
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
