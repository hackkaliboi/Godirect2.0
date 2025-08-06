import { SystemAlerts } from "@/components/admin/SystemAlerts";
import { Activity } from "lucide-react";

export default function AdminSystem() {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-warning" />
            System Monitoring
          </h1>
          <p className="text-muted-foreground">
            Monitor system health and performance
          </p>
        </div>

        <SystemAlerts />
      </div>
    </div>
  );
}