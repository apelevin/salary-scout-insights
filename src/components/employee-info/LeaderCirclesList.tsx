
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { CircleData } from "@/types";
import { cleanFunctionalType } from "@/utils/formatUtils";

interface LeaderCirclesListProps {
  leadCircles: CircleData[];
  incognitoMode?: boolean;
}

export const LeaderCirclesList: React.FC<LeaderCirclesListProps> = ({ 
  leadCircles,
  incognitoMode = false
}) => {
  if (!leadCircles || leadCircles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleAlert className="h-5 w-5 text-blue-500" />
          Управляемые круги
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leadCircles.length > 0 ? (
          <div className="space-y-2">
            {leadCircles.map((circle, idx) => (
              <div key={idx} className="px-3 py-2 bg-blue-50 rounded flex justify-between">
                <span className="font-medium">{circle.name}</span>
                <span className="text-blue-600 text-sm">
                  {cleanFunctionalType(circle.functionalType)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">Нет управляемых кругов</div>
        )}
      </CardContent>
    </Card>
  );
};
