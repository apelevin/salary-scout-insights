
import { useState } from "react";

/**
 * Custom hook for managing customized standard salary values
 * 
 * This hook provides state management for custom standard salaries,
 * allowing the application to override the calculated standard salaries
 * for specific roles with user-defined values.
 * 
 * @returns An object containing the custom standard salaries map and functions to modify it
 */
export const useSalaryCustomization = () => {
  // Store custom standard salaries as a Map where the key is the role name
  // and the value is the custom standard salary amount
  const [customStandardSalaries, setCustomStandardSalaries] = useState<Map<string, number>>(new Map());

  /**
   * Update the standard salary for a specific role
   * 
   * @param roleName - The name of the role to update
   * @param newStandardSalary - The new standard salary amount
   */
  const handleStandardSalaryChange = (roleName: string, newStandardSalary: number): void => {
    setCustomStandardSalaries(prev => {
      const updated = new Map(prev);
      updated.set(roleName, newStandardSalary);
      return updated;
    });
  };
  
  /**
   * Clear custom standard salary for a specific role
   * This will revert the role back to using the calculated standard salary
   * 
   * @param roleName - The name of the role to clear the custom salary for
   */
  const clearCustomStandardSalary = (roleName: string): void => {
    setCustomStandardSalaries(prev => {
      const updated = new Map(prev);
      updated.delete(roleName);
      return updated;
    });
  };
  
  /**
   * Reset all custom standard salaries
   * This will clear all customizations and revert to using calculated values
   */
  const resetAllCustomSalaries = (): void => {
    setCustomStandardSalaries(new Map());
  };
  
  /**
   * Check if a role has a custom standard salary
   * 
   * @param roleName - The name of the role to check
   * @returns True if the role has a custom standard salary set, false otherwise
   */
  const hasCustomSalary = (roleName: string): boolean => {
    return customStandardSalaries.has(roleName);
  };

  return {
    customStandardSalaries,
    handleStandardSalaryChange,
    clearCustomStandardSalary,
    resetAllCustomSalaries,
    hasCustomSalary
  };
};
