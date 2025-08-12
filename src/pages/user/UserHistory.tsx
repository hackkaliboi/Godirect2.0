import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Clock, MapPin, Filter } from "lucide-react";

export default function UserHistory() {
  return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent flex-shrink-0" />
              <span className="break-words">Search History</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Review your previous property searches and preferences
            </p>
          </div>
          <Button className="bg-gradient-to-r from-accent to-warning whitespace-nowrap">
            <Search className="mr-2 h-4 w-4" />
            New Search
          </Button>
        </div>

        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Search History</h3>
          <p className="text-muted-foreground mb-4">
            Your property searches will be saved here for easy access
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Save time by reusing previous searches</p>
            <p>• Track price changes in areas you're interested in</p>
            <p>• Get notifications for new matching properties</p>
          </div>
        </div>
      </div>
  );
}