
export const formatName = (name: string): string => {
  if (!name) return '';
  
  // Remove quotes and trim whitespace
  const cleanName = name.replace(/["']/g, '').trim();
  
  // Split by whitespace
  const nameParts = cleanName.split(/\s+/);
  
  // If only one or two parts, return as is
  if (nameParts.length <= 2) return cleanName;
  
  // For names with 3 or more parts, return first two parts (Last Name First Name)
  return `${nameParts[0]} ${nameParts[1]}`;
};
