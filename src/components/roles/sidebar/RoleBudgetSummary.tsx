
import { formatSalary } from "@/utils/formatUtils";

interface RoleBudgetSummaryProps {
  standardSalary: number;
  totalRoleCost: number;
  employeeCount: number;
  incognitoMode?: boolean;
}

const RoleBudgetSummary = ({
  standardSalary,
  totalRoleCost,
  employeeCount,
  incognitoMode = false
}: RoleBudgetSummaryProps) => {
  // This component now returns an empty fragment since we've removed all the content blocks
  return <></>;
};

export default RoleBudgetSummary;
