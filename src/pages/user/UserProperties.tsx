import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Search, Filter, Heart, MapPin } from "lucide-react";

export default function UserProperties() {
  return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <span className="break-words">Browse Properties</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Find your perfect home from available listings
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="whitespace-nowrap">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary-glow whitespace-nowrap">
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