
interface RoleNameCellProps {
  roleName: string;
  hasEmployees: boolean;
  onRoleClick?: (roleName: string) => void;
}

const RoleNameCell = ({ roleName, hasEmployees, onRoleClick }: RoleNameCellProps) => {
  if (hasEmployees && onRoleClick) {
    return (
      <button 
        onClick={() => onRoleClick(roleName)}
        className="text-left hover:text-blue-600 hover:underline transition-colors"
      >
        {roleName}
      </button>
    );
  }
  
  return <span>{roleName}</span>;
};

export default RoleNameCell;
