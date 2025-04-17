
import { useState } from "react";

export const useStandardSalary = () => {
  const [customStandardSalaries, setCustomStandardSalaries] = useState<Map<string, number>>(new Map());

  const handleStandardSalaryChange = (roleName: string, newStandardSalary: number) => {
    setCustomStandardSalaries(prev => {
      const updated = new Map(prev);
      updated.set(roleName, newStandardSalary);
      return updated;
    });
  };

  return {
    customStandardSalaries,
    handleStandardSalaryChange
  };
};
