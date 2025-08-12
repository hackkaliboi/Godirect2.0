import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { viewingsApi, schedulingApi } from "@/lib/api";
import { PropertyViewing, ScheduleSlot } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Home,
  User,
  Video,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isSameDay, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

interface ViewingWithDetails extends PropertyViewing {
  property_title?: string;
  property_address?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  agent_name?: string;
}

interface ScheduleFormData {
  property_id: string;
  date: Date;
  time: string;
  duration: number;
  viewing_type: "in_person" | "virtual" | "self_guided";
  attendees: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes?: string;
}

const BookingScheduler = () => {
  const { user } = useAuth();
  const [viewings, setViewings] = useState<ViewingWithDetails[]>([]);
  const [filteredViewings, setFilteredViewings] = useState<ViewingWithDetails[]>([]);
  const [availableSlots, setAvailableSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
  const [selectedViewing, setSelectedViewing] = useState<ViewingWithDetails | null>(null);
  const [bookingForm, setBookingForm] = useState<ScheduleFormData>({
    property_id: "",
    date: new Date(),
    time: "",
    duration: 60,
    viewing_type: "in_person",
    attendees: 1,
    client_name: "",
    client_email: "",
    client_phone: "",
    notes: "",
  });

  const viewingStatuses = [
    { value: "scheduled", label: "Scheduled", color: "bg-blue-500", icon: Clock },
    { value: "confirmed", label: "Confirmed", color: "bg-green-500", icon: CheckCircle },
    { value: "in_progress", label: "In Progress", color: "bg-yellow-500", icon: Clock },
    { value: "completed", label: "Completed", color: "bg-green-600", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", color: "bg-red-500", icon: XCircle },
    { value: "no_show", label: "No Show", color: "bg-gray-500", icon: AlertTriangle },
  ];

  const viewingTypes = [
    { value: "in_person", label: "In-Person", icon: Home, description: "Physical property visit" },
    { value: "virtual", label: "Virtual Tour", icon: Video, description: "Online video tour" },
    { value: "self_guided", label: "Self-Guided", icon: User, description: "Independent viewing" },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const durations = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];

  useEffect(() => {
    fetchViewings();
    fetchAvailableSlots();
  }, [user, selectedDate]);

  useEffect(() => {
    filterViewings();
  }, [viewings, filter, searchTerm]);

  const fetchViewings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await viewingsApi.getUserViewings(user.id);
      setViewings(response);
    } catch (error) {
      console.error("Error fetching viewings:", error);
      toast.error("Failed to fetch viewings");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!user) return;

    try {
      const startDate = startOfDay(selectedDate);
      const endDate = endOfDay(selectedDate);
      const response = await schedulingApi.getAvailableSlots(user.id, startDate, endDate);
      setAvailableSlots(response);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const filterViewings = () => {
    let filtered = viewings;

    if (filter !== "all") {
      filtered = filtered.filter(v => v.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredViewings(filtered);
  };

  const scheduleViewing = async () => {
    if (!bookingForm.property_id || !bookingForm.client_name || !bookingForm.client_email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const scheduledDateTime = new Date(bookingForm.date);
      const [hours, minutes] = bookingForm.time.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      const viewingData = {
        property_id: bookingForm.property_id,
        scheduled_date: scheduledDateTime.toISOString(),
        duration: bookingForm.duration,
        type: bookingForm.viewing_type,
        attendees: bookingForm.attendees,
        client_name: bookingForm.client_name,
        client_email: bookingForm.client_email,
        client_phone: bookingForm.client_phone,
        notes: bookingForm.notes || null,
        status: "scheduled",
        agent_id: user?.id,
      };

      await viewingsApi.scheduleViewing(viewingData);
      await fetchViewings();
      await fetchAvailableSlots();
      
      setIsBookingDialogOpen(false);
      resetBookingForm();
      toast.success("Viewing scheduled successfully");
    } catch (error) {
      console.error("Error scheduling viewing:", error);
      toast.error("Failed to schedule viewing");
    }
  };

  const updateViewingStatus = async (viewingId: string, status: string) => {
    try {
      await viewingsApi.updateViewing(viewingId, { status });
      await fetchViewings();
      toast.success("Viewing status updated successfully");
    } catch (error) {
      console.error("Error updating viewing status:", error);
      toast.error("Failed to update viewing status");
    }
  };

  const cancelViewing = async (viewingId: string) => {
    try {
      await viewingsApi.updateViewing(viewingId, { status: "cancelled" });
      await fetchViewings();
      await fetchAvailableSlots();
      toast.success("Viewing cancelled successfully");
    } catch (error) {
      console.error("Error cancelling viewing:", error);
      toast.error("Failed to cancel viewing");
    }
  };

  const rescheduleViewing = async (viewingId: string, newDate: Date, newTime: string) => {
    try {
      const scheduledDateTime = new Date(newDate);
      const [hours, minutes] = newTime.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      await viewingsApi.updateViewing(viewingId, {
        scheduled_date: scheduledDateTime.toISOString(),
      });
      
      await fetchViewings();
      await fetchAvailableSlots();
      toast.success("Viewing rescheduled successfully");
    } catch (error) {
      console.error("Error rescheduling viewing:", error);
      toast.error("Failed to reschedule viewing");
    }
  };

  const resetBookingForm = () => {
    setBookingForm({
      property_id: "",
      date: new Date(),
      time: "",
      duration: 60,
      viewing_type: "in_person",
      attendees: 1,
      client_name: "",
      client_email: "",
      client_phone: "",
      notes: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = viewingStatuses.find(s => s.value === status);
    const IconComponent = statusConfig?.icon || Clock;
    
    return (
      <Badge className={cn("text-white flex items-center gap-1", statusConfig?.color)}>
        <IconComponent className="h-3 w-3" />
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getViewingTypeInfo = (type: string) => {
    return viewingTypes.find(t => t.value === type);
  };

  const getDayViewings = (date: Date) => {
    return viewings.filter(v => 
      isSameDay(parseISO(v.scheduled_date), date)
    );
  };

  const isTimeSlotAvailable = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);

    return availableSlots.some(slot => 
      isSameDay(parseISO(slot.start_time), selectedDate) &&
      parseISO(slot.start_time).getTime() === slotTime.getTime() &&
      slot.is_available
    );
  };

  const getViewingStats = () => {
    const total = viewings.length;
    const scheduled = viewings.filter(v => v.status === "scheduled").length;
    const confirmed = viewings.filter(v => v.status === "confirmed").length;
    const completed = viewings.filter(v => v.status === "completed").length;

    const today = new Date();
    const todayViewings = viewings.filter(v => 
      isSameDay(parseISO(v.scheduled_date), today)
    ).length;

    return { total, scheduled, confirmed, completed, todayViewings };
  };

  const stats = getViewingStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading schedule...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-realty-900 dark:text-white">
            Booking & Scheduling System
          </h1>
          <p className="text-realty-600 dark:text-realty-400">
            Manage property viewings and appointment scheduling
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAvailabilityDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Set Availability
          </Button>
          <Button
            onClick={() => setIsBookingDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Viewing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Viewings
                </p>
                <p className="text-2xl font-bold text-realty-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-realty-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.scheduled}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Confirmed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Today
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.todayViewings}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-realty-400" />
              <Input
                placeholder="Search viewings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {viewingStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    hasViewings: (date) => getDayViewings(date).length > 0
                  }}
                  modifiersStyles={{
                    hasViewings: { 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: 'rgb(59, 130, 246)',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Viewings for {format(selectedDate, "PPP")}</span>
                  <Badge variant="outline">
                    {getDayViewings(selectedDate).length} viewings
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getDayViewings(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-realty-400 mx-auto mb-4" />
                      <p className="text-realty-600 dark:text-realty-400">
                        No viewings scheduled for this date
                      </p>
                    </div>
                  ) : (
                    getDayViewings(selectedDate).map((viewing) => {
                      const typeInfo = getViewingTypeInfo(viewing.type);
                      return (
                        <Card key={viewing.id} className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {typeInfo?.icon && (
                                    <typeInfo.icon className="h-4 w-4 text-realty-600" />
                                  )}
                                  <span className="font-medium">
                                    {format(parseISO(viewing.scheduled_date), "HH:mm")}
                                  </span>
                                </div>
                                <span className="text-sm text-realty-500">
                                  {viewing.duration}min
                                </span>
                              </div>
                              {getStatusBadge(viewing.status)}
                            </div>
                            
                            <h4 className="font-semibold text-realty-900 dark:text-white mb-1">
                              {viewing.property_title}
                            </h4>
                            
                            <div className="flex items-center gap-4 text-sm text-realty-600 dark:text-realty-400">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {viewing.client_name}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {viewing.attendees} attendees
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedViewing(viewing);
                                  setIsDetailsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                              
                              {viewing.status === "scheduled" && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateViewingStatus(viewing.id, "confirmed")}
                                >
                                  Confirm
                                </Button>
                              )}
                              
                              {(viewing.status === "scheduled" || viewing.status === "confirmed") && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => cancelViewing(viewing.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredViewings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-realty-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                  No viewings found
                </h3>
                <p className="text-realty-600 dark:text-realty-400 mb-4">
                  {searchTerm || filter !== "all" 
                    ? "Try adjusting your filters to see more viewings"
                    : "You don't have any viewings scheduled yet"
                  }
                </p>
                {searchTerm === "" && filter === "all" && (
                  <Button onClick={() => setIsBookingDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Your First Viewing
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredViewings.map((viewing) => {
                const typeInfo = getViewingTypeInfo(viewing.type);
                return (
                  <Card key={viewing.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-realty-900 dark:text-white">
                                {viewing.property_title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-realty-600 dark:text-realty-400">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {format(parseISO(viewing.scheduled_date), "PPP")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(parseISO(viewing.scheduled_date), "HH:mm")} ({viewing.duration}min)
                                </div>
                              </div>
                            </div>
                            {getStatusBadge(viewing.status)}
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              {typeInfo?.icon && (
                                <typeInfo.icon className="h-4 w-4 text-realty-600" />
                              )}
                              <span>{typeInfo?.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-realty-600" />
                              <span>{viewing.client_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-realty-600" />
                              <span>{viewing.attendees} attendees</span>
                            </div>
                          </div>

                          {viewing.property_address && (
                            <div className="flex items-center gap-1 text-sm text-realty-600 dark:text-realty-400">
                              <MapPin className="h-4 w-4" />
                              {viewing.property_address}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedViewing(viewing);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>

                          {viewing.status === "scheduled" && (
                            <Button 
                              size="sm"
                              onClick={() => updateViewingStatus(viewing.id, "confirmed")}
                            >
                              Confirm
                            </Button>
                          )}

                          {viewing.status === "confirmed" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateViewingStatus(viewing.id, "in_progress")}
                            >
                              Start
                            </Button>
                          )}

                          {viewing.status === "in_progress" && (
                            <Button 
                              size="sm"
                              onClick={() => updateViewingStatus(viewing.id, "completed")}
                            >
                              Complete
                            </Button>
                          )}

                          {(viewing.status === "scheduled" || viewing.status === "confirmed") && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => cancelViewing(viewing.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <p className="text-sm text-realty-600 dark:text-realty-400">
                Manage your availability for property viewings
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Available Times for {format(selectedDate, "PPP")}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={isTimeSlotAvailable(time) ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "justify-start",
                          isTimeSlotAvailable(time) ? "bg-green-500 hover:bg-green-600" : ""
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Available Slot
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Block Time
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Set Recurring Availability
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Viewing Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Schedule Property Viewing
            </DialogTitle>
            <DialogDescription>
              Create a new property viewing appointment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property ID *</Label>
                <Input
                  placeholder="Enter property ID"
                  value={bookingForm.property_id}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, property_id: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Viewing Type</Label>
                <Select
                  value={bookingForm.viewing_type}
                  onValueChange={(value: any) => setBookingForm(prev => ({ ...prev, viewing_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {viewingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{type.label}</p>
                            <p className="text-xs text-realty-500">{type.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingForm.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingForm.date ? (
                        format(bookingForm.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingForm.date}
                      onSelect={(date) => date && setBookingForm(prev => ({ ...prev, date }))}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time *</Label>
                <Select
                  value={bookingForm.time}
                  onValueChange={(value) => setBookingForm(prev => ({ ...prev, time: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select
                  value={bookingForm.duration.toString()}
                  onValueChange={(value) => setBookingForm(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  placeholder="Enter client name"
                  value={bookingForm.client_name}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, client_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Client Email *</Label>
                <Input
                  type="email"
                  placeholder="Enter client email"
                  value={bookingForm.client_email}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, client_email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Phone</Label>
                <Input
                  placeholder="Enter client phone"
                  value={bookingForm.client_phone}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, client_phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Number of Attendees</Label>
                <Select
                  value={bookingForm.attendees.toString()}
                  onValueChange={(value) => setBookingForm(prev => ({ ...prev, attendees: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "person" : "people"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any special notes or requirements..."
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsBookingDialogOpen(false);
                resetBookingForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={scheduleViewing}>
              Schedule Viewing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Viewing Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Viewing Details</DialogTitle>
            <DialogDescription>
              Complete information about the scheduled viewing
            </DialogDescription>
          </DialogHeader>

          {selectedViewing && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedViewing.property_title}
                  </h3>
                  <p className="text-realty-600 dark:text-realty-400">
                    {selectedViewing.property_address}
                  </p>
                </div>
                {getStatusBadge(selectedViewing.status)}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-realty-600">Date & Time</Label>
                    <p className="font-medium">
                      {format(parseISO(selectedViewing.scheduled_date), "PPP p")}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm text-realty-600">Duration</Label>
                    <p>{selectedViewing.duration} minutes</p>
                  </div>

                  <div>
                    <Label className="text-sm text-realty-600">Viewing Type</Label>
                    <div className="flex items-center gap-2">
                      {getViewingTypeInfo(selectedViewing.type)?.icon && (
                        <getViewingTypeInfo(selectedViewing.type)!.icon className="h-4 w-4" />
                      )}
                      <span>{getViewingTypeInfo(selectedViewing.type)?.label}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-realty-600">Client Name</Label>
                    <p className="font-medium">{selectedViewing.client_name}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-realty-600">Contact</Label>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {selectedViewing.client_email}
                      </div>
                      {selectedViewing.client_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {selectedViewing.client_phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-realty-600">Attendees</Label>
                    <p>{selectedViewing.attendees} people</p>
                  </div>
                </div>
              </div>

              {selectedViewing.notes && (
                <div>
                  <Label className="text-sm text-realty-600">Notes</Label>
                  <p className="text-realty-700 dark:text-realty-300 whitespace-pre-wrap">
                    {selectedViewing.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedViewing && (selectedViewing.status === "scheduled" || selectedViewing.status === "confirmed") && (
              <Button
                variant="outline"
                onClick={() => cancelViewing(selectedViewing.id)}
                className="text-red-600 hover:text-red-700"
              >
                Cancel Viewing
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingScheduler;
