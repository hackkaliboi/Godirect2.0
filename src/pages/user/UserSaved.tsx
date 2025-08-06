import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MapPin, DollarSign } from "lucide-react";

export default function UserSaved() {
  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-destructive" />
              Saved Properties
            </h1>
            <p className="text-muted-foreground">
              Properties you've saved for later viewing
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Eye className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </div>

        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
          <p className="text-muted-foreground mb-4">
            Start browsing properties and save your favorites to view them here
          </p>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Start Browsing
          </Button>
        </div>
      </div>
    </div>
  );
}