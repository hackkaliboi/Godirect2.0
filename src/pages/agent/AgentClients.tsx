import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Phone, Mail, Calendar } from "lucide-react";

export default function AgentClients() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Client Management
            </h1>
            <p className="text-muted-foreground">
              Manage your client relationships and track interactions
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Clients Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your client base by adding your first client
          </p>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add First Client
          </Button>
        </div>
      </div>
  );
}