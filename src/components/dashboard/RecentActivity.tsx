import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "property" | "user" | "transaction" | "message";
  title: string;
  description: string;
  timestamp: Date;
  status?: "pending" | "completed" | "cancelled";
}

interface RecentActivityProps {
  activities: Activity[];
  title?: string;
}

export function RecentActivity({ activities, title = "Recent Activity" }: RecentActivityProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
            <p className="text-xs">Activity will appear here once you start using the platform</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
              {activity.status && (
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}