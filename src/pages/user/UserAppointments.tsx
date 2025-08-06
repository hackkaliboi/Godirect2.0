import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin } from "lucide-react";

export default function UserAppointments() {
  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-success" />
              Appointments
            </h1>
            <p className="text-muted-foreground">
              Manage your property viewings and agent meetings
            </p>
          </div>
          <Button className="bg-gradient-to-r from-success to-accent">
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