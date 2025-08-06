import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Eye, Edit, MapPin } from "lucide-react";

export default function AgentListings() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              My Listings
            </h1>
            <p className="text-muted-foreground">
              Manage your property listings and track performance
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </div>

        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your first property listing to attract potential buyers
          </p>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Listing
          </Button>
        </div>
      </div>
  );
}