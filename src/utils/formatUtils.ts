export const cleanFunctionalType = (type: string): string => {
  // Удаляем кавычки и трим
  const normalizedType = type.replace(/["']/g, '').trim().toLowerCase();
  
  // Handle "ft" prefix common in functional type notation
  if (normalizedType.startsWith('ft')) {
    return normalizedType.charAt(2).toUpperCase() + normalizedType.slice(3);
  }
  
  // For other notations, just capitalize first letter
  return normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
};

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
 * Formats a person's name to last name and first name format
 */
export const formatName = (name: string): string => {
  if (!name) return '';
  
  // Remove quotes and trim whitespace
  const cleanName = name.replace(/["']/g, '').trim();
  
  // Split by whitespace
  const nameParts = cleanName.split(/\s+/);
  
  // Return name in "LastName FirstName" format
  // If there's only one part, return it as is
  if (nameParts.length === 1) return nameParts[0];
  
  // Otherwise, return "LastName FirstName"
  return nameParts.join(' ');
};

/**
 * Formats an FTE (Full Time Equivalent) value to a string representation
 */
export const formatFTE = (fte: number): string => {
  return fte.toFixed(2);
};

/**
 * Cleans and formats role names
 */
export const cleanRoleName = (roleName: string): string => {
  if (!roleName) return '';
  
  // Remove quotes, trim whitespace
  let cleanedName = roleName.replace(/["']/g, '').trim();
  
  // Capitalize first letter
  cleanedName = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1).toLowerCase();
  
  return cleanedName;
};
