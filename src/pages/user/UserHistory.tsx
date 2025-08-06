import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Clock, MapPin, Filter } from "lucide-react";

export default function UserHistory() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="h-8 w-8 text-accent" />
              Search History
            </h1>
            <p className="text-muted-foreground">
              Review your previous property searches and preferences
            </p>
          </div>
          <Button className="bg-gradient-to-r from-accent to-warning">
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