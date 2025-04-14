
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface RoleEditButtonProps {
  hasEmployees: boolean;
  onClick: () => void;
}

const RoleEditButton = ({ hasEmployees, onClick }: RoleEditButtonProps) => {
  if (!hasEmployees) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onClick}
      className="h-8 w-8"
    >
      <Edit2 className="h-4 w-4" />
    </Button>
  );
};

export default RoleEditButton;
