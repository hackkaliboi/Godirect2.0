import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { viewingsApi } from "@/lib/api";
import { toast } from "sonner";
import { ViewingWithDetails } from "@/types/database";

export default function UserAppointments() {
  const { user } = useAuth();
  const [viewings, setViewings] = useState<ViewingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadViewings();
    }
  }, [user]);

  const loadViewings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await viewingsApi.getUserViewings(user!.id);
      setViewings(data);
    } catch (err) {
      console.error("Error loading viewings:", err);
      setError(err.message || "Failed to load appointments");
      toast.error("Failed to load appointments: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your appointments</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-success flex-shrink-0" />
              <span className="break-words">Appointments</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your property viewings and meetings
            </p>
          </div>
          <Button className="bg-gradient-to-r from-success to-accent whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Book Viewing
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button onClick={loadViewings}>Retry</Button>
          </div>
        ) : viewings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Appointments Scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Book property viewings and meetings
            </p>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Schedule First Viewing
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {viewings.map((viewing) => (
              <Card key={viewing.id} className="hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{viewing.property?.title || 'Property Viewing'}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(viewing.viewing_date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(viewing.viewing_date)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {/* Use address instead of separate city and state fields */}
                          {viewing.property?.address || 'Location not available'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewing.status === 'scheduled' ? 'bg-warning text-warning-foreground' :
                        viewing.status === 'confirmed' ? 'bg-success text-success-foreground' :
                        viewing.status === 'completed' ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                      </span>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}