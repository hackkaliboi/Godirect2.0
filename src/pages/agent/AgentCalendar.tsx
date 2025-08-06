import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, MapPin } from "lucide-react";

export default function AgentCalendar() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8 text-success" />
              Calendar & Appointments
            </h1>
            <p className="text-muted-foreground">
              Manage your schedule and property viewings
            </p>
          </div>
          <Button className="bg-gradient-to-r from-success to-accent">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>

        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Appointments Scheduled</h3>
          <p className="text-muted-foreground mb-4">
            Your calendar will show property viewings and client meetings
          </p>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>
        </div>
      </div>
  );
}