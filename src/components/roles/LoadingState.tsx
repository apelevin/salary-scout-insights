
import React from "react";

interface LoadingStateProps {
  children: React.ReactNode;
}

const LoadingState = ({ children }: LoadingStateProps) => {
  return (
    <div className="w-full h-60 flex items-center justify-center">
      <div className="animate-pulse text-lg text-gray-500">
        {children || "Загрузка данных..."}
      </div>
    </div>
  );
};

export default LoadingState;
