
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CircleData, RoleData } from "@/types";
import { formatFTE } from "@/utils/employeeUtils";

interface CircleEmployee {
  name: string;
  fte: number;
}

interface CircleInfoSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circle: CircleData | null;
  employees: CircleEmployee[];
}

const CircleInfoSidebar = ({
  open,
  onOpenChange,
  circle,
  employees
}: CircleInfoSidebarProps) => {
  if (!circle) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">
            {circle.name}
          </SheetTitle>
          <div className="text-sm text-muted-foreground">
            {circle.functionalType}
          </div>
        </SheetHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Сотрудники круга</h3>
            {employees.length === 0 ? (
              <p className="text-muted-foreground text-sm">Сотрудники не найдены</p>
            ) : (
              <div className="space-y-2">
                {employees.map((employee, index) => (
                  <div 
                    key={`${employee.name}-${index}`}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      FTE: {formatFTE(employee.fte)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CircleInfoSidebar;
