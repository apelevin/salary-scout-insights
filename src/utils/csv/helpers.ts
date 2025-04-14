
/**
 * Helper functions for CSV parsing
 */

/**
 * Normalizes CSV content by standardizing line endings and trimming whitespace
 */
export const normalizeCSVContent = (csvContent: string): string => {
  return csvContent
    .replace(/\r\n|\r/g, '\n')
    .trim();
};

/**
 * Detects the delimiter used in a CSV file
 * Supports comma, semicolon, and tab delimiters
 */
export const detectDelimiter = (firstLine: string): string => {
  if (firstLine.includes(';') && !firstLine.includes(',')) {
    return ';';
  } else if (firstLine.includes('\t') && !firstLine.includes(',')) {
    return '\t';
  }
  return ',';
};

/**
 * Finds column index by checking if header matches any aliases
 */
export const findColumnIndex = (headers: string[], aliases: string[]): number => {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase();
    if (aliases.some(alias => header.includes(alias))) {
      return i;
    }
  }
  return -1;
};

/**
 * Parses FTE value from string, handling different formats
 */
export const parseFTEValue = (fteString: string): number | undefined => {
  if (!fteString.trim()) {
    return undefined;
  }
  
  // Handle both comma and dot as decimal separators
  const normalizedFte = fteString.trim().replace(',', '.');
  
  // Try parsing the normalized string
  const fteValue = parseFloat(normalizedFte);
  
  if (!isNaN(fteValue)) {
    return fteValue;
  } 
  
  // Try handling other formats if parsing fails
  const cleanedFteString = fteString.replace(/[^0-9.,]/g, '').replace(',', '.');
  const cleanedFteValue = parseFloat(cleanedFteString);
  
  return !isNaN(cleanedFteValue) ? cleanedFteValue : undefined;
};

/**
 * Normalizes functional type values to standard values from the 5th column of CSV
 * @param type Raw functional type string from CSV
 * @returns Normalized functional type: "Marketing", "Sales", "Delivery & Discovery", or "The others"
 */
export const normalizeFunctionalType = (type: string): string => {
  if (!type) return 'The others';
  
  const cleanedType = type.trim().replace(/["']/g, '').toLowerCase();
  
  if (cleanedType === '' || cleanedType === 'undefined' || cleanedType === 'null') {
    return 'The others';
  }
  
  // Normalize according to the allowed values from the specification
  if (cleanedType.includes('marketing') || cleanedType === 'acquisition') {
    return 'Marketing';
  } 
  if (cleanedType.includes('sales')) {
    return 'Sales';
  }
  if (cleanedType.includes('delivery') && cleanedType.includes('discovery')) {
    return 'Delivery & Discovery';
  }
  if (cleanedType.includes('discovery') || cleanedType.includes('hub')) {
    return 'Delivery & Discovery';
  }
  if (cleanedType.includes('delivery') || cleanedType.includes('bot.one')) {
    return 'Delivery & Discovery';
  }
  
  // Default case
  return 'The others';
};
