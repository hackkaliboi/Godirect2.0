import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Database,
    Server,
    Wifi,
    HardDrive,
    Clock,
    CheckCircle2,
    AlertTriangle,
    XCircle
} from "lucide-react";

export function PlatformHealthCard() {
    const healthMetrics = [
        {
            name: "Database",
            status: "operational",
            value: "99.9% uptime",
            icon: Database,
            lastCheck: "2 minutes ago"
        },
        {
            name: "API Server",
            status: "operational",
            value: "99.8% uptime",
            icon: Server,
            lastCheck: "5 minutes ago"
        },
        {
            name: "Storage",
            status: "degraded",
            value: "85% capacity",
            icon: HardDrive,
            lastCheck: "10 minutes ago"
        },
        {
            name: "Network",
            status: "operational",
            value: "No issues",
            icon: Wifi,
            lastCheck: "1 minute ago"
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "operational":
                return CheckCircle2;
            case "degraded":
                return AlertTriangle;
            case "down":
                return XCircle;
            default:
                return Clock;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational":
                return "bg-success";
            case "degraded":
                return "bg-warning";
            case "down":
                return "bg-destructive";
            default:
                return "bg-muted";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {healthMetrics.map((metric, index) => {
                        const StatusIcon = getStatusIcon(metric.status);
                        return (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${getStatusColor(metric.status)} text-white`}>
                                        <metric.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{metric.name}</div>
                                        <div className="text-sm text-muted-foreground">{metric.value}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={metric.status === "operational" ? "secondary" : metric.status === "degraded" ? "destructive" : "outline"}>
                                        {metric.status}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground">
                                        {metric.lastCheck}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Overall Status</div>
                        <Badge className="bg-warning text-warning-foreground">Partially Degraded</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                        Platform is operational with minor issues. Storage capacity is at 85%.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}