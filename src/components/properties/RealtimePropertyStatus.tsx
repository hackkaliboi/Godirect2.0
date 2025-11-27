import { useState, useEffect } from "react";
import { useRealtimeProperty } from "@/hooks/useRealtimeProperties";
import { Property } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RealtimePropertyStatusProps {
  propertyId: string;
}

const RealtimePropertyStatus = ({ propertyId }: RealtimePropertyStatusProps) => {
  const { property, loading } = useRealtimeProperty(propertyId);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  // Track status changes for notifications
  useEffect(() => {
    if (property && previousStatus && previousStatus !== property.status) {
      // Show a notification when status changes
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Property Status Updated', {
            body: `Property "${property.title}" status changed from ${previousStatus} to ${property.status}`,
            icon: property.images?.[0] || '/favicon.ico'
          });
        }
      }
    }
    
    if (property) {
      setPreviousStatus(property.status);
    }
  }, [property, previousStatus]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <p>Loading property status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!property) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <p>Property not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'available': { label: 'Available', color: 'bg-green-500', icon: CheckCircle },
      'pending': { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
      'sold': { label: 'Sold', color: 'bg-blue-500', icon: CheckCircle },
      'rented': { label: 'Rented', color: 'bg-purple-500', icon: CheckCircle },
      'withdrawn': { label: 'Withdrawn', color: 'bg-gray-500', icon: XCircle },
      'rejected': { label: 'Rejected', color: 'bg-red-500', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      color: 'bg-gray-500', 
      icon: AlertCircle 
    };
    
    const IconComponent = config.icon;
    
    return (
      <Badge className={cn("text-white gap-1", config.color)}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Status
          </CardTitle>
          {getStatusBadge(property.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-lg mb-1">{property.title}</h3>
          <p className="text-realty-600 dark:text-realty-400 text-sm">
            {property.street}, {property.city}, {property.state} {property.zip_code}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-realty-600" />
            <span className="font-medium">{formatPrice(property.price)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-realty-600" />
            <span>{property.bedrooms || 0} beds</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-realty-600" />
            <span>{property.bathrooms || 0} baths</span>
          </div>
          
          {property.square_feet && (
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-realty-600" />
              <span>{property.square_feet.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-realty-600 dark:text-realty-400">Last updated</span>
            <span>{format(new Date(property.updated_at), 'MMM d, yyyy h:mm a')}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-realty-600 dark:text-realty-400">Listed on</span>
            <span>{format(new Date(property.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" className="w-full" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Property Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimePropertyStatus;