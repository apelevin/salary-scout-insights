
/**
 * Calculates the difference between standardSalary and current salary
 * @param currentSalary The employee's current salary
 * @param standardSalary The standard salary for the role
 * @returns The difference (standardSalary - currentSalary)
 */
export const calculateSalaryDifference = (currentSalary: number, standardSalary: number): number => {
  return standardSalary - currentSalary;
};

/**
 * Calculates the percentage difference between standardSalary and current salary
 * @param currentSalary The employee's current salary
 * @param standardSalary The standard salary for the role
 * @returns The percentage difference as a number
 */
export const calculateSalaryPercentage = (currentSalary: number, standardSalary: number): number => {
  if (currentSalary === 0) return 0;
  const difference = calculateSalaryDifference(currentSalary, standardSalary);
  return (difference / currentSalary) * 100;
};
