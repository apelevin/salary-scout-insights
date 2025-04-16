
import { useState } from "react";

export const useStandardSalary = () => {
  const [customStandardSalaries, setCustomStandardSalaries] = useState<Map<string, number>>(new Map());

  const handleStandardSalaryChange = (roleName: string, newStandardSalary: number) => {
    setCustomStandardSalaries(prev => {
      const newMap = new Map(prev);
      newMap.set(roleName, newStandardSalary);
      return newMap;
    });
  };

  // Устанавливает стандартные оклады из базы данных или другого источника
  const setStandardSalaries = (salaries: Map<string, number>) => {
    setCustomStandardSalaries(new Map(salaries));
  };

  return {
    customStandardSalaries,
    handleStandardSalaryChange,
    setStandardSalaries
  };
};
