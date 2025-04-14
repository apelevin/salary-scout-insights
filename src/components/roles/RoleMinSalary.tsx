
interface RoleMinSalaryProps {
  minSalary: number;
  hasEmployees: boolean;
  formatSalary: (salary: number) => string;
}

const RoleMinSalary = ({ minSalary, hasEmployees, formatSalary }: RoleMinSalaryProps) => {
  if (!hasEmployees) {
    return <span className="text-gray-400">—</span>;
  }
  
  return <span>{formatSalary(minSalary)}</span>;
};

export default RoleMinSalary;
