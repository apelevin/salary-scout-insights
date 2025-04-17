
export const formatName = (name: string): string => {
  if (!name) return '';
  
  // Удаляем кавычки и трим
  const cleanName = name.replace(/["']/g, '').trim();
  
  // Разделяем имя на части
  const nameParts = cleanName.split(/\s+/);
  
  // Возвращаем только первые две части (фамилия и имя)
  if (nameParts.length >= 2) {
    return `${nameParts[0]} ${nameParts[1]}`;
  }
  
  // Если меньше двух частей, возвращаем как есть
  return cleanName;
};
