import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';
import { viewingsApi } from '@/lib/api';
import { ViewingWithDetails, CreateViewingRequest } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format, addHours, isAfter, isBefore, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface ViewingSchedulerProps {
  propertyId: string;
  property: {
    title: string;
    address: string;
    price: number;
    images: string[];
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

interface UserProfile {
  avatar_url: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
}

const ViewingScheduler: React.FC<ViewingSchedulerProps> = ({
  propertyId,
  property
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [viewingType, setViewingType] = useState<'in_person' | 'virtual' | 'group'>('in_person');
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [existingViewings, setExistingViewings] = useState<ViewingWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    avatar_url: null,
    full_name: null,
    phone: null,
    email: null
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, full_name, phone, email')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setUserProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  // Generate time slots (9 AM to 6 PM)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true
      });
      if (hour < 18) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:30`,
          available: true
        });
      }
    }
    return slots;
  };

  // Load existing viewings for the selected date
  const loadExistingViewings = async () => {
    if (selectedDate && user) {
      try {
        setLoading(true);
        // Use getUserViewings since there are no agents
        const viewings = await viewingsApi.getUserViewings(user.id);
        const dateViewings = viewings.filter(viewing => {
          const viewingDate = new Date(viewing.viewing_date);
          return viewingDate.toDateString() === selectedDate.toDateString();
        });

        setExistingViewings(dateViewings);

        // Update available slots based on existing bookings
        const slots = generateTimeSlots();
        const updatedSlots = slots.map(slot => {
          const isBooked = dateViewings.some(viewing => {
            const viewingTime = format(new Date(viewing.viewing_date), 'HH:mm');
            return viewingTime === slot.time;
          });

          return {
            ...slot,
            available: !isBooked,
            booked: isBooked
          };
        });

        setAvailableSlots(updatedSlots);
      } catch (error) {
        console.error('Error loading existing viewings:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadExistingViewings();
    }
  }, [selectedDate]);

  const handleScheduleViewing = async () => {
    if (!user || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create datetime from selected date and time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const viewingDate = new Date(selectedDate);
      viewingDate.setHours(hours, minutes, 0, 0);

      const request: CreateViewingRequest = {
        property_id: propertyId,
        viewing_date: viewingDate.toISOString(),
        viewing_type: viewingType,
        notes,
        attendees_count: attendeesCount
      };

      await viewingsApi.scheduleViewing(request);

      toast.success('Viewing scheduled successfully! You will receive a confirmation email.');

      // Reset form and close dialog
      setSelectedDate(undefined);
      setSelectedTime('');
      setNotes('');
      setIsOpen(false);

      // Reload available slots
      if (selectedDate) {
        loadExistingViewings();
      }

    } catch (error) {
      console.error('Error scheduling viewing:', error);
      toast.error('Failed to schedule viewing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getViewingTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-realty-800 hover:bg-realty-900 text-white">
          <CalendarDays className="w-4 h-4 mr-2" />
          Schedule Viewing
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-realty-800" />
            Schedule Property Viewing
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Property Info */}
          <div className="space-y-6">
            {/* Property Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={property.images[0] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-realty-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                    <p className="text-lg font-bold text-realty-800">
                      ₦{property.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Info (replaces Agent Info) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={userProfile.avatar_url || undefined} />
                    <AvatarFallback>{userProfile.full_name?.charAt(0) || userProfile.email?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{userProfile.full_name || 'Property Owner'}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      {userProfile.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {userProfile.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {userProfile.email}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Viewings for Selected Date */}
            {selectedDate && existingViewings.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Other Viewings on {format(selectedDate, 'MMM dd, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {existingViewings.slice(0, 3).map((viewing) => (
                      <div key={viewing.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getViewingTypeIcon(viewing.viewing_type)}
                          <span className="text-sm font-medium">
                            {format(new Date(viewing.viewing_date), 'HH:mm')}
                          </span>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(viewing.status)}`}>
                          {viewing.status}
                        </Badge>
                      </div>
                    ))}
                    {existingViewings.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{existingViewings.length - 3} more viewings
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Scheduling Form */}
          <div className="space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    isBefore(date, startOfDay(new Date())) || // Past dates
                    date.getDay() === 0 // Sundays
                  }
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Selection */}
            {selectedDate && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Available Times</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-realty-800 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading available times...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`
                            ${selectedTime === slot.time
                              ? 'bg-realty-800 hover:bg-realty-900'
                              : 'hover:bg-realty-50'
                            }
                            ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          {slot.time}
                          {slot.booked && <XCircle className="w-3 h-3 ml-1" />}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Viewing Details */}
            {selectedTime && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Viewing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="viewingType">Viewing Type</Label>
                    <Select value={viewingType} onValueChange={(value: any) => setViewingType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_person">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            In-Person Visit
                          </div>
                        </SelectItem>
                        <SelectItem value="virtual">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Virtual Tour
                          </div>
                        </SelectItem>
                        <SelectItem value="group">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Group Viewing
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="attendees">Number of Attendees</Label>
                    <Select value={attendeesCount.toString()} onValueChange={(value) => setAttendeesCount(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Person' : 'People'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific requirements or questions..."
                      rows={3}
                    />
                  </div>

                  {/* Viewing Summary */}
                  <div className="p-4 bg-realty-50 dark:bg-realty-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Viewing Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">
                          {format(selectedDate, 'EEEE, MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium capitalize">{viewingType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Attendees:</span>
                        <span className="font-medium">{attendeesCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleScheduleViewing}
                      disabled={isSubmitting}
                      className="flex-1 bg-realty-800 hover:bg-realty-900"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Scheduling...
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Viewing
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewingScheduler;