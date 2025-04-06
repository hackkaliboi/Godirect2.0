
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  compareText?: string;
  progressValue?: number;
  icon?: React.ReactNode;
  trend?: "positive" | "negative" | "neutral" | "warning" | "ai";
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  compareText = "vs previous 30 days",
  progressValue,
  icon,
  trend = "neutral",
  subtitle,
  bgColor,
  textColor
}: StatsCardProps) {
  const isPositiveChange = change !== undefined ? change >= 0 : undefined;
  
  const getTrendIcon = () => {
    switch (trend) {
      case "positive":
        return <ArrowUp className="mr-1 h-4 w-4 text-green-500" />;
      case "negative":
        return <ArrowDown className="mr-1 h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />;
      case "ai":
        return <Sparkles className="mr-1 h-4 w-4 text-purple-500" />;
      default:
        return <TrendingUp className="mr-1 h-4 w-4 text-blue-500" />;
    }
  };
  
  const getTrendClass = () => {
    switch (trend) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "ai":
        return "text-purple-500";
      default:
        return "text-blue-500";
    }
  };
  
  return (
    <Card className={`bg-card ${bgColor || ''} transition-shadow hover:shadow-md`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className={`text-base font-medium ${textColor || ''}`}>{title}</CardTitle>
        {icon && <div className={`h-4 w-4 ${textColor || 'text-muted-foreground'}`}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`text-2xl font-bold ${textColor || ''}`}>{value}</div>
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
          {trend && change === undefined && (
            <div className={`flex items-center text-sm font-medium ${getTrendClass()}`}>
              {getTrendIcon()}
            </div>
          )}
        </div>
        {subtitle && (
          <div className={`text-sm font-medium mt-1 ${textColor || ''}`}>
            {subtitle}
          </div>
        )}
        {compareText && !subtitle && (
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

export function StatsCardGrid({ children, columns = 4 }: { children: React.ReactNode; columns?: 2 | 3 | 4 | 5 }) {
  return (
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} mb-6`}>
      {children}
    </div>
  );
}

// Advanced card variations
export function AnalyticsCard({ 
  title, 
  value, 
  change, 
  icon, 
  chart 
}: { 
  title: string; 
  value: string | number; 
  change?: number; 
  icon?: React.ReactNode;
  chart?: React.ReactNode;
}) {
  const isPositiveChange = change !== undefined ? change >= 0 : undefined;
  
  return (
    <Card className="bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="flex items-center justify-between mb-3">
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
        {chart && <div className="mt-2">{chart}</div>}
      </CardContent>
    </Card>
  );
}
