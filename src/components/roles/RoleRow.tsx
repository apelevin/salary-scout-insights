
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Calculate salary difference percentage
  const salaryDifferencePercentage = minSalary > 0 ? ((maxSalary - minSalary) / minSalary) * 100 : 0;
  const needsDecomposition = salaryDifferencePercentage > 30;

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

  const renderSalaryValue = () => {
    if (salaries.length === 0) {
      return <span className="text-gray-400">—</span>;
    }
    return formatSalary(minSalary);
  };

  const renderMaxSalaryValue = () => {
    if (salaries.length === 0) {
      return <span className="text-gray-400">—</span>;
    }
    
    return (
      <div className="flex items-center gap-2">
        {formatSalary(maxSalary)}
        {needsDecomposition && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle size={16} className="text-[#F97316]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Роль требует декомпозиции</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  const renderStandardSalaryField = () => {
    if (isEditing) {
      return (
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
      );
    }
    
    if (salaries.length) {
      return formatSalary(standardSalary);
    }
    
    return <span className="text-gray-400">—</span>;
  };

  const renderActionButtons = () => {
    if (salaries.length === 0) {
      return null;
    }

    if (isEditing) {
      return (
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
      );
    }

    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleEditClick}
        className="h-8 w-8"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{roleName}</TableCell>
      <TableCell>{renderSalaryValue()}</TableCell>
      <TableCell>{renderMaxSalaryValue()}</TableCell>
      <TableCell>{renderStandardSalaryField()}</TableCell>
      <TableCell>{renderActionButtons()}</TableCell>
    </TableRow>
  );
};

export default RoleRow;
