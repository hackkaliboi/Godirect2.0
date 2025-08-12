import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    positive: boolean;
  };
  description?: string;
  loading?: boolean;
}

export function StatCard({ title, value, icon: Icon, change, description, loading }: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
        <CardTitle className="text-xs sm:text-sm font-medium line-clamp-2">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {loading ? (
          <>
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
          </>
        ) : (
          <>
            <div className="text-xl sm:text-2xl font-bold">{value}</div>
            {change && (
              <p className="text-xs text-muted-foreground">
                <span className={change.positive ? "text-success" : "text-destructive"}>
                  {change.positive ? "+" : ""}{change.value}
                </span>{" "}
                from last month
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
