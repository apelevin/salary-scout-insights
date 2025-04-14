
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
