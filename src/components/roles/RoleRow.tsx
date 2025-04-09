
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RoleRowProps {
  roleName: string;
  minSalary: number;
  maxSalary: number;
  standardSalary: number;
  salaries: number[];
  index: number;
  formatSalary: (salary: number) => string;
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
}

const RoleRow = ({ 
  roleName, 
  minSalary, 
  maxSalary, 
  standardSalary, 
  salaries,
  index,
  formatSalary,
  onStandardSalaryChange
}: RoleRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(standardSalary.toString());

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(standardSalary.toString());
  };

  const handleStandardSalaryChange = (value: string) => {
    setEditValue(value);
  };

  const handleSaveClick = () => {
    let newValue = parseFloat(editValue.replace(/[^\d,.]/g, '').replace(',', '.'));
    
    if (isNaN(newValue) || newValue <= 0) {
      toast({
        title: "Ошибка ввода",
        description: "Пожалуйста, введите корректное положительное число",
        variant: "destructive",
      });
      return;
    }
    
    setIsEditing(false);
    
    if (onStandardSalaryChange) {
      onStandardSalaryChange(roleName, newValue);
      
      toast({
        title: "Стандартный оклад обновлен",
        description: `Новый стандартный оклад для роли "${roleName}": ${formatSalary(newValue)}`,
      });
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditValue(standardSalary.toString());
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{roleName}</TableCell>
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
        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => handleStandardSalaryChange(e.target.value)}
            className="max-w-[150px]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveClick();
              } else if (e.key === "Escape") {
                handleCancelClick();
              }
            }}
            autoFocus
          />
        ) : (
          salaries.length ? (
            formatSalary(standardSalary)
          ) : (
            <span className="text-gray-400">—</span>
          )
        )}
      </TableCell>
      <TableCell>
        {salaries.length ? (
          isEditing ? (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSaveClick}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancelClick}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleEditClick}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default RoleRow;
