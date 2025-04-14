
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CircleData, RoleData } from "@/types";
import { Users } from "lucide-react";
import { cleanRoleName } from "@/utils/formatUtils";

interface CirclesTableProps {
  circlesData: CircleData[];
  rolesData: RoleData[];
  isLoading: boolean;
}

const CirclesTable: React.FC<CirclesTableProps> = ({ circlesData, rolesData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-sm text-muted-foreground">Загрузка данных...</p>
      </div>
    );
  }

  if (!circlesData || circlesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">Нет данных о кругах</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Загрузите файл с информацией о кругах, чтобы увидеть данные.
        </p>
      </div>
    );
  }

  // Count employees per circle and clean circle names
  const employeesPerCircle = new Map<string, Set<string>>();
  const cleanCirclesData = circlesData.map(circle => ({
    ...circle,
    name: circle.name.replace(/["']/g, '').trim()
  }));
  
  rolesData.forEach(role => {
    const cleanCircleName = role.circleName?.replace(/["']/g, '').trim() || '';
    const cleanParticipantName = role.participantName.replace(/["']/g, '').trim();
    
    if (cleanCircleName) {
      if (!employeesPerCircle.has(cleanCircleName)) {
        employeesPerCircle.set(cleanCircleName, new Set());
      }
      
      employeesPerCircle.get(cleanCircleName)?.add(cleanParticipantName);
    }
  });

  // Remove duplicate circles
  const uniqueCircles = Array.from(new Set(cleanCirclesData.map(circle => circle.name)))
    .map(name => cleanCirclesData.find(circle => circle.name === name)!)
    .filter(Boolean);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Название круга</TableHead>
            <TableHead>Функциональный тип</TableHead>
            <TableHead className="text-right">Количество сотрудников</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueCircles.map((circle, index) => {
            // Get the count of unique employees in this circle
            const employees = employeesPerCircle.get(circle.name) || new Set();
            const employeeCount = employees.size;
            
            return (
              <TableRow key={`${circle.name}-${index}`}>
                <TableCell className="font-medium">{circle.name}</TableCell>
                <TableCell>{circle.functionalType || "—"}</TableCell>
                <TableCell className="text-right">{employeeCount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CirclesTable;
