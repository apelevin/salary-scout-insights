
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";

interface LeadershipTableRowProps {
  leadershipType: string;
  circleSalaries: Map<string, number>;
  circleCounts: string[];
  formatSalary: (salary: number) => string;
  onSalaryChange: (leadershipType: string, circleCount: string, newSalary: number) => void;
}

const LeadershipTableRow = ({ 
  leadershipType,
  circleSalaries,
  circleCounts,
  formatSalary,
  onSalaryChange
}: LeadershipTableRowProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const startEditing = (circleCount: string, currentValue: number) => {
    setEditingCell(`${leadershipType}-${circleCount}`);
    setEditValue(currentValue.toString());
  };

  const handleSave = (circleCount: string) => {
    const numValue = parseFloat(editValue.replace(/[^\d.-]/g, ''));
    
    if (!isNaN(numValue)) {
      onSalaryChange(leadershipType, circleCount, numValue);
    }
    
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, circleCount: string) => {
    if (e.key === "Enter") {
      handleSave(circleCount);
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{leadershipType}</TableCell>
      {circleCounts.map((count, index) => (
        <TableCell 
          key={index} 
          className="text-center relative group"
        >
          {editingCell === `${leadershipType}-${count}` ? (
            <Input
              className="h-8 w-full p-1 text-right"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave(count)}
              onKeyDown={(e) => handleKeyDown(e, count)}
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-center">
              {circleSalaries.has(count) ? (
                <div 
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => startEditing(count, circleSalaries.get(count) || 0)}
                >
                  <span>{formatSalary(circleSalaries.get(count) || 0)}</span>
                  <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default LeadershipTableRow;
