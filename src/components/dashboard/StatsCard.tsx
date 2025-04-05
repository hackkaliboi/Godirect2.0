
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  compareText?: string;
  progressValue?: number;
  icon?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  change,
  compareText = "vs previous 30 days",
  progressValue,
  icon
}: StatsCardProps) {
  const isPositiveChange = change !== undefined ? change >= 0 : undefined;
  
  return (
    <Card className="bg-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <div className={`flex items-center text-sm font-medium ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveChange ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        {compareText && (
          <div className="text-xs text-muted-foreground mt-1">
            {compareText}
          </div>
        )}
        {progressValue !== undefined && (
          <div className="mt-3">
            <Progress value={progressValue} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {children}
    </div>
  );
}
