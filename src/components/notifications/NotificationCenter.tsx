import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationsApi } from "@/lib/api";
import { Notification } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Eye,
  Filter,
  Home,
  Calendar,
  MessageCircle,
  DollarSign,
  User,
  Clock,
  Mail,
  Phone,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

// Extend the Notification interface to include priority if it's used
interface NotificationWithDetails extends Notification {
  property_title?: string;
  sender_name?: string;
  priority?: string; // Add priority property
}

const NotificationCenter = () => {
  const { user, loading: authLoading } = useAuth();
  const { notifications, unreadCount, loading: notificationsLoading } = useRealtimeNotifications(user?.id || null);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationWithDetails[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<NotificationWithDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  console.log('NotificationCenter rendered with:', { user, authLoading, notificationsLoading });

  const notificationTypes = [
    { 
      value: "property_inquiry", 
      label: "Property Inquiry", 
      icon: Home, 
      color: "bg-blue-500",
      description: "New inquiries about your properties"
    },
    { 
      value: "viewing_request", 
      label: "Viewing Request", 
      icon: Calendar, 
      color: "bg-green-500",
      description: "Property viewing appointments"
    },
    { 
      value: "message", 
      label: "Message", 
      icon: MessageCircle, 
      color: "bg-purple-500",
      description: "Chat messages and communications"
    },
    { 
      value: "payment", 
      label: "Payment", 
      icon: DollarSign, 
      color: "bg-yellow-500",
      description: "Transaction and payment updates"
    },
    { 
      value: "system", 
      label: "System", 
      icon: Info, 
      color: "bg-gray-500",
      description: "System announcements and updates"
    },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "bg-gray-400" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "urgent", label: "Urgent", color: "bg-red-500" },
  ];

  useEffect(() => {
    // Only filter notifications when user is loaded and available
    if (!authLoading && user && !notificationsLoading) {
      filterNotifications();
    } else if (!authLoading && !user) {
      // If auth is done loading but there's no user, stop loading
      setFilteredNotifications([]);
    }
  }, [notifications, filter, user, authLoading, notificationsLoading]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter]);

  const filterNotifications = () => {
    let filtered = notifications as NotificationWithDetails[];

    switch (filter) {
      case "unread":
        filtered = notifications.filter(n => !n.is_read) as NotificationWithDetails[];
        break;
      case "read":
        filtered = notifications.filter(n => n.is_read) as NotificationWithDetails[];
        break;
      case "today":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = notifications.filter(n => new Date(n.created_at) >= today) as NotificationWithDetails[];
        break;
      default:
        filtered = notifications as NotificationWithDetails[];
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      await notificationsApi.markAsUnread(notificationId);
      toast.success("Notification marked as unread");
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      toast.error("Failed to mark notification as unread");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n => notificationsApi.markAsRead(n.id))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationsApi.deleteNotification(notificationId);
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type: string) => {
    const notificationType = notificationTypes.find(t => t.value === type);
    const IconComponent = notificationType?.icon || Bell;
    return <IconComponent className="h-5 w-5" />;
  };

  const getNotificationTypeInfo = (type: string) => {
    return notificationTypes.find(t => t.value === type);
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = priorityLevels.find(p => p.value === priority);
    return (
      <Badge 
        className={cn("text-white text-xs", priorityConfig?.color)}
        variant="secondary"
      >
        {priorityConfig?.label || priority}
      </Badge>
    );
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.is_read).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = notifications.filter(n => new Date(n.created_at) >= today).length;
    
    const byType = notificationTypes.map(type => ({
      ...type,
      count: notifications.filter(n => n.type === type.value).length
    }));

    return { total, unread, todayCount, byType };
  };

  const stats = getNotificationStats();

  // Show loading state while auth is loading or while fetching notifications
  if (authLoading || notificationsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading notifications...</div>
        </div>
      </div>
    );
  }

  // Show message if user is not logged in
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Bell className="h-12 w-12 text-realty-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
              Please log in to view notifications
            </h3>
            <p className="text-realty-600 dark:text-realty-400">
              You need to be logged in to see your notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-heading font-bold text-realty-900 dark:text-white">
              Notifications
            </h1>
            {stats.unread > 0 && (
              <Badge className="bg-red-500 text-white">
                {stats.unread} unread
              </Badge>
            )}
          </div>
          <p className="text-realty-600 dark:text-realty-400">
            Stay updated with your property activities
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={stats.unread === 0}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total
                </p>
                <p className="text-2xl font-bold text-realty-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <Bell className="h-8 w-8 text-realty-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Unread
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.unread}
                </p>
              </div>
              <BellRing className="h-8 w-8 text-red-600" />
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
                <p className="text-2xl font-bold text-blue-600">
                  {stats.todayCount}
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
                  Messages
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.byType.find(t => t.value === 'message')?.count || 0}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-realty-600" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="read">Read Only</SelectItem>
                <SelectItem value="today">Today</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Notifications</TabsTrigger>
          <TabsTrigger value="types">By Type</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-realty-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-realty-600 dark:text-realty-400">
                  {filter === "unread" 
                    ? "You're all caught up! No unread notifications."
                    : filter === "today"
                    ? "No notifications received today."
                    : "You don't have any notifications yet."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const typeInfo = getNotificationTypeInfo(notification.type);
                return (
                  <Card 
                    key={notification.id} 
                    className={cn(
                      "hover:shadow-md transition-all cursor-pointer",
                      !notification.is_read && "border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10"
                    )}
                    onClick={() => {
                      setSelectedNotification(notification);
                      setIsDetailDialogOpen(true);
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={cn(
                            "p-2 rounded-full",
                            typeInfo?.color || "bg-gray-500",
                            "text-white"
                          )}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={cn(
                                "text-sm font-medium truncate",
                                !notification.is_read ? "text-realty-900 dark:text-white" : "text-realty-700 dark:text-realty-300"
                              )}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2 ml-2">
                                {notification.priority && (
                                  getPriorityBadge(notification.priority)
                                )}
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-realty-600 dark:text-realty-400 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-4 text-xs text-realty-500">
                                <span>{typeInfo?.label}</span>
                                {notification.property_title && (
                                  <>
                                    <span>•</span>
                                    <span>{notification.property_title}</span>
                                  </>
                                )}
                                {notification.sender_name && (
                                  <>
                                    <span>•</span>
                                    <span>from {notification.sender_name}</span>
                                  </>
                                )}
                              </div>
                              <span className="text-xs text-realty-500">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notification.is_read) {
                                markAsUnread(notification.id);
                              } else {
                                markAsRead(notification.id);
                              }
                            }}
                            className="text-realty-500 hover:text-realty-700"
                          >
                            {notification.is_read ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {notificationTypes.map((type) => {
            const typeNotifications = notifications.filter(n => n.type === type.value);
            if (typeNotifications.length === 0) return null;

            return (
              <Card key={type.value}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full text-white", type.color)}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.label}</CardTitle>
                      <p className="text-sm text-realty-600 dark:text-realty-400">
                        {type.description} • {typeNotifications.length} notifications
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {typeNotifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer hover:bg-realty-50 dark:hover:bg-realty-800",
                        !notification.is_read && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                      onClick={() => {
                        setSelectedNotification(notification);
                        setIsDetailDialogOpen(true);
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-medium",
                            !notification.is_read ? "text-realty-900 dark:text-white" : "text-realty-700 dark:text-realty-300"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-realty-600 dark:text-realty-400 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  {typeNotifications.length > 3 && (
                    <p className="text-sm text-realty-500 text-center py-2">
                      And {typeNotifications.length - 3} more...
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Notification Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedNotification && (
                <>
                  <div className={cn(
                    "p-2 rounded-full text-white",
                    getNotificationTypeInfo(selectedNotification.type)?.color || "bg-gray-500"
                  )}>
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  {selectedNotification.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Notification details and actions
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getNotificationTypeInfo(selectedNotification.type)?.label}
                  </Badge>
                  {selectedNotification.priority && (
                    getPriorityBadge(selectedNotification.priority)
                  )}
                  {selectedNotification.is_read ? (
                    <Badge variant="secondary">Read</Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-white">Unread</Badge>
                  )}
                </div>
                <span className="text-sm text-realty-500">
                  {format(new Date(selectedNotification.created_at), 'PPP p')}
                </span>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <p className="text-realty-700 dark:text-realty-300 whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.property_title && (
                <div>
                  <h4 className="font-medium mb-2">Related Property</h4>
                  <p className="text-realty-600 dark:text-realty-400">
                    {selectedNotification.property_title}
                  </p>
                </div>
              )}

              {selectedNotification.sender_name && (
                <div>
                  <h4 className="font-medium mb-2">From</h4>
                  <p className="text-realty-600 dark:text-realty-400">
                    {selectedNotification.sender_name}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Close
            </Button>
            {selectedNotification && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedNotification.is_read) {
                      markAsUnread(selectedNotification.id);
                    } else {
                      markAsRead(selectedNotification.id);
                    }
                  }}
                >
                  Mark as {selectedNotification.is_read ? 'Unread' : 'Read'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    setIsDetailDialogOpen(false);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationCenter;