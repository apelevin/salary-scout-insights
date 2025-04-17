
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatSalary } from "@/utils/formatUtils";
import { RoleParticipant } from "@/hooks/useCircleRoles";
import { parseActualIncome } from "@/utils/employeeIncomeUtils";

interface CircleSummaryCardsProps {
  roles: Array<{
    participants: RoleParticipant[];
  }>;
}

const CircleSummaryCards: React.FC<CircleSummaryCardsProps> = ({ roles }) => {
  // Calculate totals for both standard and actual income
  const calculateTotals = () => {
    let totalStandardIncome = 0;
    let totalActualIncome = 0;

    // Iterate through all roles and their participants
    roles.forEach(role => {
      role.participants.forEach(participant => {
        // Add standard income if available
        if (participant.standardIncome) {
          totalStandardIncome += participant.standardIncome;
        }
        
        // Add actual income if available (need to convert from currency string to number)
        if (participant.actualIncome) {
          // Extract numeric value from currency string (removing currency symbol and spaces)
          const numericValue = parseActualIncome(participant.actualIncome);
          if (!isNaN(numericValue)) {
            totalActualIncome += numericValue;
          }
        }
      });
    });

    return { totalStandardIncome, totalActualIncome };
  };

  const { totalStandardIncome, totalActualIncome } = calculateTotals();

  // Calculate percentage difference
  const calculatePercentageDifference = () => {
    if (totalStandardIncome === 0) return 0;
    
    const difference = ((totalActualIncome - totalStandardIncome) / totalStandardIncome) * 100;
    return Math.round(difference * 100) / 100; // Round to 2 decimal places
  };

  const percentageDifference = calculatePercentageDifference();
  const isPositive = percentageDifference >= 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-muted-foreground">
              Стандартный доход
            </h3>
            <p className="text-lg font-bold">
              {formatSalary(totalStandardIncome)}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-muted-foreground">
              Текущий доход
            </h3>
            <p className="text-lg font-bold">
              {formatSalary(totalActualIncome)}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-muted-foreground">
              Разница
            </h3>
            <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{percentageDifference}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CircleSummaryCards;
