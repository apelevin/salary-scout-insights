// This component is no longer used as we've moved to a table layout
// Keeping the file for compatibility but it's not actively used

interface RoleEmployeeCardProps {
  name: string;
  salary: number;
  fte: number;
  contribution: number;
  totalRoleCost: number;
  incognitoMode?: boolean;
}

const RoleEmployeeCard = ({
  name,
  salary,
  fte,
  contribution,
  totalRoleCost,
  incognitoMode = false
}: RoleEmployeeCardProps) => {
  return null; // This component is no longer used
};

export default RoleEmployeeCard;
