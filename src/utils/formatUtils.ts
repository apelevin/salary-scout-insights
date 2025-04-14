
import { Employee } from "@/types";

export const formatSalary = (salary: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(salary);
};

export const formatName = (name: string): string => {
  const cleanName = name.replace(/["']/g, '').trim();
  
  if (cleanName === "") {
    return "Без имени";
  }
  
  const nameParts = cleanName.split(/\s+/);
  
  if (nameParts.length >= 2) {
    // Return first two parts of the name (usually last name and first name in Russian naming convention)
    return `${nameParts[0]} ${nameParts[1]}`;
  }
  
  return cleanName;
};

export const formatFTE = (fte: number): string => {
  return fte.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const cleanRoleName = (roleName: string): string => {
  return roleName.replace(/["']/g, '').trim();
};

// New utility function to clean functional type
export const cleanFunctionalType = (type: string | undefined): string => {
  if (!type) return '';
  return type.replace(/["']/g, '').trim();
};

// New utility function for incognito mode name display
export const formatNameIncognito = (name: string, incognitoMode: boolean): string => {
  if (incognitoMode) {
    return '░░░░░ ░░░░░';
  }
  return formatName(name);
};
