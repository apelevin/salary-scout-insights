/**
 * Utility functions for formatting data
 */

/**
 * Formats a salary number into a readable string with currency symbol
 */
export const formatSalary = (salary: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(salary);
};

/**
 * Cleans up and formats functional type string
 */
export const cleanFunctionalType = (type: string): string => {
  // First, normalize the string by trimming and converting to lowercase
  const normalizedType = type.trim().toLowerCase();
  
  // Handle "ft" prefix common in functional type notation
  if (normalizedType.startsWith('ft')) {
    return normalizedType.charAt(2).toUpperCase() + normalizedType.slice(3);
  }
  
  // For other notations, just capitalize first letter
  return normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
};
