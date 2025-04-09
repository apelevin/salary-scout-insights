
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
