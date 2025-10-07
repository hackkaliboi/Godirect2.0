import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MapPin, DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserSavedProperties } from "@/utils/supabaseData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function UserSaved() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadSavedProperties();
    }
  }, [user]);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchUserSavedProperties(user!.id);
      setSavedProperties(data);
    } catch (err) {
      console.error("Error loading saved properties:", err);
      setError(err.message || "Failed to load saved properties");
      toast.error("Failed to load saved properties: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your saved properties</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-destructive flex-shrink-0" />
            <span className="break-words">Saved Properties</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Properties you've saved for later viewing
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-primary to-primary-glow whitespace-nowrap"
          onClick={() => navigate("/properties")}
        >
          <Eye className="mr-2 h-4 w-4" />
          Browse Properties
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={loadSavedProperties}>Retry</Button>
        </div>
      ) : savedProperties.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
          <p className="text-muted-foreground mb-4">
            Start browsing properties and save your favorites to view them here
          </p>
          <Button onClick={() => navigate("/properties")}>
            <Eye className="mr-2 h-4 w-4" />
            Start Browsing
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedProperties.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                {item.property?.images?.[0] ? (
                  <img
                    src={item.property.images[0]}
                    alt={item.property.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.property?.title || 'Untitled Property'}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {item.property?.city}, {item.property?.state}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">
                    ₦{item.property?.price?.toLocaleString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/properties/${item.property?.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}