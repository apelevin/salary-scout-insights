
import { Employee } from "@/types";
import { formatName } from "@/utils/formatUtils";

/**
 * Calculate actual income for an employee based on their salary and FTE
 * This is different from standard income which is based on standard salary
 */
export const calculateActualIncome = (
  employee: Employee | undefined, 
  fte: number
): number => {
  if (!employee || !employee.salary || fte <= 0) {
    return 0;
  }
  
  return employee.salary * fte;
};

/**
 * Format actual income for display with currency symbol
 */
export const formatActualIncome = (
  employee: Employee | undefined, 
  fte: number
): string => {
  const actualIncome = calculateActualIncome(employee, fte);
  
  if (actualIncome <= 0) {
    return "";
  }
  
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(actualIncome);
};

/**
 * Parse numeric value from a formatted currency string
 */
export const parseActualIncome = (formattedIncome: string): number => {
  if (!formattedIncome) {
    return 0;
  }
  
  // Remove currency symbol, spaces, and other non-numeric characters
  const numericValue = parseFloat(formattedIncome.replace(/[^0-9.-]+/g, ""));
  return isNaN(numericValue) ? 0 : numericValue;
};
