import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin } from "lucide-react";

export default function UserAppointments() {
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
              Manage your property viewings and agent meetings
            </p>
          </div>
          <Button className="bg-gradient-to-r from-success to-accent whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Book Viewing
          </Button>
        </div>

        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Appointments Scheduled</h3>
          <p className="text-muted-foreground mb-4">
            Book property viewings and meetings with agents
          </p>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Schedule First Viewing
          </Button>
        </div>
      </div>
    </div>
  );
}