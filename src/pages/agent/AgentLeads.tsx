import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Phone, Mail } from "lucide-react";

export default function AgentLeads() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Search className="h-8 w-8 text-accent" />
              Lead Management
            </h1>
            <p className="text-muted-foreground">
              Track and convert your property leads into clients
            </p>
          </div>
          <Button className="bg-gradient-to-r from-accent to-warning">
            <TrendingUp className="mr-2 h-4 w-4" />
            Lead Analytics
          </Button>
        </div>

        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Leads Yet</h3>
          <p className="text-muted-foreground mb-4">
            Leads will appear here when potential clients show interest in your properties
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Track lead sources and quality</p>
            <p>• Follow up with interested prospects</p>
            <p>• Convert leads into successful sales</p>
          </div>
        </div>
      </div>
  );
}