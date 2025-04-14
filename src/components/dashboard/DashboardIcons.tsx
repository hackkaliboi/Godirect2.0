
import React from 'react';
import { TrendingDown, TrendingUp } from "lucide-react";

export const formatTrendIcon = (change: number) => {
  if (change > 0) {
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  }
  if (change < 0) {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return null;
};
