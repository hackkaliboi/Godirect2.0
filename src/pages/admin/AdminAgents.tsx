import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Building2, DollarSign } from "lucide-react";

export default function AdminAgents() {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Agent Management
          </h1>
          <p className="text-muted-foreground">
            Manage real estate agents and their performance
          </p>
        </div>

        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Agents Registered</h3>
          <p className="text-muted-foreground">
            Agent profiles and management tools will appear here when agents register
          </p>
        </div>
      </div>
    </div>
  );
}