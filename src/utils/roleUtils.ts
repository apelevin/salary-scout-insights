
export const cleanRoleName = (roleName: string): string => {
  return roleName.replace(/["']/g, '').trim();
};

export const formatSalary = (salary: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(salary);
};

export const calculateStandardSalary = (min: number, max: number): number => {
  if (min === max) {
    return max;
  }
  return min + (max - min) * 0.25;
};
