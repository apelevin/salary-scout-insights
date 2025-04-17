
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const VariablesTable = () => {
  // Определяем переменные проекта, которые нужно показать
  const projectVariables = [
    {
      name: "Сотрудник",
      properties: [
        { property: "employee.name", description: "Фамилия Имя сотрудника" },
        { property: "formatName(employee.name)", description: "Отформатированное имя сотрудника" }
      ]
    },
    {
      name: "Роли",
      properties: [
        { property: "(employee as EmployeeWithRoles).roles", description: "Роли конкретного сотрудника" },
        { property: "(employee as EmployeeWithRoles).normalizedRolesFTE", description: "Распределение FTE по ролям" }
      ]
    },
    {
      name: "Оклады",
      properties: [
        { property: "employee.salary", description: "Текущий оклад сотрудника" },
        { property: "(employee as EmployeeWithRoles).standardSalary", description: "Расчетный стандартный оклад сотрудника" },
        { property: "role.standardSalary", description: "Стандартный оклад для роли" }
      ]
    },
    {
      name: "Круги",
      properties: [
        { property: "(employee as EmployeeWithRoles).operationalCircleType", description: "Тип операционного круга сотрудника" },
        { property: "(employee as EmployeeWithRoles).operationalCircleCount", description: "Количество операционных кругов сотрудника" },
        { property: "circle.name", description: "Название круга" },
        { property: "circle.functionalType", description: "Функциональный тип круга" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">Переменные проекта</div>
      <p className="text-muted-foreground mb-4">
        Список основных переменных, используемых в проекте для работы с данными.
      </p>
      
      {projectVariables.map((category) => (
        <Card key={category.name} className="mb-6">
          <div className="p-4 border-b">
            <h3 className="font-medium">{category.name}</h3>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Переменная</TableHead>
                  <TableHead>Описание</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.properties.map((item) => (
                  <TableRow key={item.property}>
                    <TableCell className="font-mono text-sm">{item.property}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VariablesTable;
