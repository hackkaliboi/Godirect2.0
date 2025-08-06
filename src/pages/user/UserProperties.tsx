import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Search, Filter, Heart, MapPin } from "lucide-react";

export default function UserProperties() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Browse Properties
            </h1>
            <p className="text-muted-foreground">
              Find your perfect home from available listings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary-glow">
              <Search className="mr-2 h-4 w-4" />
              Advanced Search
            </Button>
          </div>
        </div>

        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Properties Available</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to discover amazing properties when they become available
          </p>
          <Button variant="outline">
            <Heart className="mr-2 h-4 w-4" />
            Set Search Alerts
          </Button>
        </div>
      </div>
  );
}