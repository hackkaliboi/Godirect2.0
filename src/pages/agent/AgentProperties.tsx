import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Search, Filter, Grid, List } from "lucide-react";

export default function AgentProperties() {
  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              All Properties
            </h1>
            <p className="text-muted-foreground">
              Browse and manage all properties on the platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline">
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Properties Available</h3>
          <p className="text-muted-foreground">
            Properties will appear here once they are added to the platform
          </p>
        </div>
      </div>
    </div>
  );
}