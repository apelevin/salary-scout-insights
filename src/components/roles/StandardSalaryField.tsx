
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Edit2 } from "lucide-react";
import { formatSalary } from "@/utils/formatUtils";
import { toast } from "@/components/ui/use-toast";

interface StandardSalaryFieldProps {
  standardSalary: number;
  roleName: string;
  hasData: boolean;
  onStandardSalaryChange?: (roleName: string, newStandardSalary: number) => void;
}

const StandardSalaryField = ({
  standardSalary,
  roleName,
  hasData,
  onStandardSalaryChange
}: StandardSalaryFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(standardSalary.toString());

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(standardSalary.toString());
  };

  const handleStandardSalaryChange = (value: string) => {
    setEditValue(value);
  };

  const validateAndParseInput = (value: string): { isValid: boolean; parsedValue: number } => {
    const parsedValue = parseFloat(value.replace(/[^\d,.]/g, '').replace(',', '.'));
    const isValid = !isNaN(parsedValue) && parsedValue > 0;
    
    return { isValid, parsedValue };
  };

  const showErrorToast = () => {
    toast({
      title: "Ошибка ввода",
      description: "Пожалуйста, введите корректное положительное число",
      variant: "destructive",
    });
  };

  const showSuccessToast = (value: number) => {
    toast({
      title: "Стандартный оклад обновлен",
      description: `Новый стандартный оклад для роли "${roleName}": ${formatSalary(value)}`,
    });
  };

  const handleSaveClick = () => {
    const { isValid, parsedValue } = validateAndParseInput(editValue);
    
    if (!isValid) {
      showErrorToast();
      return;
    }
    
    setIsEditing(false);
    
    if (onStandardSalaryChange) {
      onStandardSalaryChange(roleName, parsedValue);
      showSuccessToast(parsedValue);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditValue(standardSalary.toString());
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
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
      </div>
    );
  }
  
  if (!hasData) {
    return <span className="text-gray-400">—</span>;
  }
  
  return (
    <div className="flex items-center gap-1">
      <span>{formatSalary(standardSalary)}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleEditClick}
        className="h-8 w-8"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StandardSalaryField;
