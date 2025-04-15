import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellRing, Settings, Users, Home, CheckCircle2, Clock, AlertCircle, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminNotifications() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Notifications"
        subtitle="Manage system notifications and alerts"
        actionLabel="Settings"
        actionIcon={<Settings className="h-4 w-4" />}
      />

      <Card className="border-dashed border-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Coming Soon</CardTitle>
            <CardDescription>
              We're building a comprehensive notification system
            </CardDescription>
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <BellRing className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Advanced Notification System</h3>
              <p className="text-muted-foreground">
                We're developing a powerful notification system that will keep you informed about all important activities in your real estate business.
                This feature will be available in the next update.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">User Notifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Get notified about new user registrations, profile updates, and account activities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">Property Alerts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts for new property listings, updates, and when properties are sold or rented.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Stay informed about system updates, maintenance schedules, and security alerts.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Preview of Coming Features</h3>
              
              <div className="border rounded-md p-4 bg-card/50">
                <Tabs defaultValue="all" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">Unread</TabsTrigger>
                      <TabsTrigger value="important">Important</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex gap-2">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search notifications..." className="pl-8" disabled />
                      </div>
                      
                      <Button variant="outline" size="icon" disabled>
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="all" className="mt-0">
                    <div className="space-y-4">
                      {[
                        { 
                          icon: <Users className="h-8 w-8 text-blue-500" />, 
                          title: "New Agent Registration", 
                          description: "Sarah Johnson has registered as a new agent and is awaiting approval.",
                          time: "2 hours ago",
                          status: "unread",
                          priority: "high"
                        },
                        { 
                          icon: <Home className="h-8 w-8 text-green-500" />, 
                          title: "Property Sold", 
                          description: "Luxury Apartment in Lagos has been marked as sold for ₦75,000,000.",
                          time: "Yesterday",
                          status: "read",
                          priority: "medium"
                        },
                        { 
                          icon: <AlertCircle className="h-8 w-8 text-amber-500" />, 
                          title: "System Maintenance", 
                          description: "Scheduled maintenance will occur on April 20, 2025 from 2:00 AM to 4:00 AM.",
                          time: "3 days ago",
                          status: "read",
                          priority: "low"
                        },
                      ].map((notification, index) => (
                        <div key={index} className={`flex gap-4 p-4 rounded-lg border ${notification.status === 'unread' ? 'bg-primary/5' : ''}`}>
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            {notification.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{notification.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  notification.priority === 'high' ? 'destructive' : 
                                  notification.priority === 'medium' ? 'default' : 'outline'
                                }>
                                  {notification.priority}
                                </Badge>
                                {notification.status === 'unread' && (
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {notification.time}
                              </span>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-7 px-2" disabled>
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark as read
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="unread" className="mt-0">
                    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <BellRing className="h-10 w-10 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Unread notifications will appear here</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="important" className="mt-0">
                    <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Important notifications will appear here</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch id="email-notifications" disabled />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications in the browser</p>
                      </div>
                      <Switch id="push-notifications" disabled />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important notifications via SMS</p>
                      </div>
                      <Switch id="sms-notifications" disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center">
              <Button disabled>Notify Me When Available</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
