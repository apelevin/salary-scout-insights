
import { X } from "lucide-react";
import { EmployeeWithRoles } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface EmployeeSidebarProps {
  employee: EmployeeWithRoles | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeSidebar = ({ employee, isOpen, onClose }: EmployeeSidebarProps) => {
  if (!employee) return null;

  const formatSalary = (salary: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">{employee.name}</SheetTitle>
          <SheetDescription>
            Информация о сотруднике
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Зарплата</h3>
            <p className="mt-1 text-lg font-semibold">{formatSalary(employee.salary)}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Роли</h3>
            {employee.roles.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {employee.roles.map((role, index) => (
                  <li 
                    key={index} 
                    className="px-3 py-1.5 bg-primary/10 rounded-md text-sm"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-gray-500">Роли не назначены</p>
            )}
          </div>
        </div>

        <SheetClose className="absolute right-4 top-4">
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть</span>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeSidebar;
