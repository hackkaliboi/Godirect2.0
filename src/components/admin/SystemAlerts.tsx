import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Clock, Users, Building2, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  category: "system" | "user" | "property" | "financial";
}

// Empty data - will be populated with real system alerts
const alerts: SystemAlert[] = [];

export function SystemAlerts() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangle;
      case "error":
        return AlertTriangle;
      case "success":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-warning text-warning-foreground";
      case "error":
        return "bg-destructive text-destructive-foreground";
      case "success":
        return "bg-success text-success-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "user":
        return Users;
      case "property":
        return Building2;
      case "financial":
        return DollarSign;
      default:
        return Bell;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Systems Operating Normally</h3>
            <p className="text-muted-foreground mb-4">
              No active alerts or issues detected
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>User Activity: Normal</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Property System: Online</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Response Time: Optimal</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>Database: Healthy</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              const CategoryIcon = getCategoryIcon(alert.category);
              
              return (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <AlertIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <Badge className={getAlertColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CategoryIcon className="h-3 w-3" />
                        <span>{alert.category}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {alert.resolved && (
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}