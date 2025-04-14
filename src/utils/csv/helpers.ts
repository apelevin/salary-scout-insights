
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
