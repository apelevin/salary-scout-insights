
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
    if (aliases.some(alias => header.includes(alias.toLowerCase()))) {
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
 * Normalizes functional type to one of our standard categories
 * Returns empty string if no valid type is found (will display as "na")
 */
export const normalizeFunctionalType = (type: string): string => {
  if (!type || type.trim() === '') return "";
  
  const normalizedType = type.trim().toLowerCase();
  
  // Enhanced detection patterns for each type
  
  // Marketing type detection - expanded patterns
  if (normalizedType.includes("market") || 
      normalizedType.includes("маркет") ||
      normalizedType.includes("growth") ||
      normalizedType.includes("acquisition") ||
      normalizedType.includes("digital") ||
      normalizedType.includes("brand")) {
    return "Marketing";
  }
  
  // Sales type detection - expanded patterns
  if (normalizedType.includes("sale") || 
      normalizedType.includes("продаж") || 
      normalizedType.includes("прод") ||
      normalizedType.includes("revenue") ||
      normalizedType.includes("business") ||
      normalizedType.includes("deal") ||
      normalizedType.includes("client")) {
    return "Sales";
  }
  
  // Delivery & Discovery type detection - expanded patterns
  if (normalizedType.includes("discovery") || 
      normalizedType.includes("delivery") || 
      normalizedType.includes("диск") || 
      normalizedType.includes("делив") ||
      normalizedType.includes("dnd") ||
      normalizedType.includes("process") ||
      normalizedType.includes("product") ||
      normalizedType.includes("hub")) {
    return "Delivery & Discovery";
  }
  
  // Enablement type detection - expanded patterns
  if (normalizedType.includes("enable") || 
      normalizedType.includes("энейбл") ||
      normalizedType.includes("hr") ||
      normalizedType.includes("people") ||
      normalizedType.includes("talent")) {
    return "Enablement";
  }
  
  // Platform type detection - expanded patterns
  if (normalizedType.includes("platform") || 
      normalizedType.includes("платформ") ||
      normalizedType.includes("tech") ||
      normalizedType.includes("engineering") ||
      normalizedType.includes("dev") ||
      normalizedType.includes("infrastructure")) {
    return "Platform";
  }
  
  // If no match found, return empty string (will display as "na")
  return "";
};
