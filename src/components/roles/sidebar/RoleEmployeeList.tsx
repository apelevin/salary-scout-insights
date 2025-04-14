
import { Users } from "lucide-react";
import RoleEmployeeCard from "./RoleEmployeeCard";

interface RoleEmployeeData {
  name: string;
  salary: number;
  fte: number;
  contribution: number;
}

interface RoleEmployeeListProps {
  employeesWithRole: RoleEmployeeData[];
  totalRoleCost: number;
  incognitoMode?: boolean;
}

const RoleEmployeeList = ({ 
  employeesWithRole, 
  totalRoleCost,
  incognitoMode = false 
}: RoleEmployeeListProps) => {
  return (
    <div>
      <div className="flex items-center my-4">
        <Users className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-base font-medium">Сотрудники с ролью ({employeesWithRole.length})</h3>
      </div>
      
      <div className="space-y-3">
        {employeesWithRole.length > 0 ? (
          employeesWithRole.map((employee, index) => (
            <RoleEmployeeCard
              key={`${employee.name}-${index}`}
              name={employee.name}
              salary={employee.salary}
              fte={employee.fte}
              contribution={employee.contribution}
              totalRoleCost={totalRoleCost}
              incognitoMode={incognitoMode}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Нет сотрудников с данной ролью
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleEmployeeList;
