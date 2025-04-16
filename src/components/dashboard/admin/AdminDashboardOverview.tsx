import React from "react";
import { useQuery } from "@tanstack/react-query";
import { StatsCardGrid, StatsCard } from "@/components/dashboard/StatsCard";
import { FeatureCard, MetricGroup } from "@/components/dashboard/FeatureCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, Users, DollarSign, Home, MapPin, Clock, Activity, AlertTriangle,
  Bell, Search, ArrowUpRight, Briefcase, Calendar, ChevronRight,
  User, CheckCircle, XCircle, Hourglass, TrendingUp, TrendingDown, RefreshCw,
  LineChart, BarChart, PieChart, PercentCircle, Landmark, BedDouble, Bath, Ruler
} from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { fetchDashboardStats, findStatByName, formatTrendClass } from "@/utils/dashboardUtils";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboardOverview = () => {
  const { toast } = useToast();
  
  const { 
    data: dashboardStats, 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });

  const totalRevenue = findStatByName(dashboardStats, 'total_revenue');
  const activeListings = findStatByName(dashboardStats, 'active_listings');
  const usersAgents = findStatByName(dashboardStats, 'users_agents');
  const paymentApprovals = findStatByName(dashboardStats, 'payment_approvals');
  const propertiesSold = findStatByName(dashboardStats, 'properties_sold');

  const { data: recentUsers } = useQuery({
    queryKey: ['recentUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching recent users:", error);
        return [];
      }
      
      return data || [];
    }
  });

  const { data: pendingApprovals } = useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, properties(title)')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching pending approvals:", error);
        return [];
      }
      
      return data || [];
    }
  });

  const { data: recentActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching recent activities:", error);
        return [];
      }
      
      return data || [];
    }
  });
  
  // Fetch top performing locations
  const { data: topLocations } = useQuery({
    queryKey: ['topLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('city, count(*)')
        .order('count', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching top locations:", error);
        return [];
      }
      
      return data || [];
    }
  });
  
  // Fetch property type distribution
  const { data: propertyTypes } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('property_type, count(*)')
        .order('count', { ascending: false });
      
      if (error) {
        console.error("Error fetching property types:", error);
        return [];
      }
      
      return data || [];
    }
  });

  const handleRefresh = async () => {
    try {
      toast({ 
        title: "Refreshing dashboard data...",
        description: "Please wait while we fetch the latest stats."
      });
      
      const { error } = await supabase.functions.invoke('calculate-dashboard-stats');
      
      if (error) {
        toast({
          title: "Error refreshing data",
          description: "Failed to refresh dashboard statistics",
          variant: "destructive"
        });
        return;
      }
      
      await refetch();
      
      toast({
        title: "Dashboard refreshed",
        description: "Latest statistics have been loaded"
      });
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);
      toast({
        title: "Error occurred",
        description: "Something went wrong while refreshing the dashboard",
        variant: "destructive"
      });
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Monitor and manage your real estate platform"
        actionLabel="Refresh Data"
        actionIcon={<RefreshCw className="h-4 w-4" />}
        onAction={handleRefresh}
      />
      
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1" onClick={() => window.location.href = '/admin-dashboard/add-property'}>
          <Building2 className="h-5 w-5 text-primary" />
          <span>Add Property</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1" onClick={() => window.location.href = '/admin-dashboard/agents'}>
          <Users className="h-5 w-5 text-primary" />
          <span>Manage Agents</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1" onClick={() => window.location.href = '/admin-dashboard/payments'}>
          <DollarSign className="h-5 w-5 text-primary" />
          <span>Process Payments</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1" onClick={() => window.location.href = '/admin-dashboard/support'}>
          <Bell className="h-5 w-5 text-primary" />
          <span>Support Center</span>
        </Button>
      </div>

      {isError && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <p className="text-destructive">Failed to load dashboard data. Please try refreshing.</p>
          </CardContent>
        </Card>
      )}

      <StatsCardGrid>
        <StatsCard 
          title="Total Revenue" 
          value={isLoading ? '--' : `₦${totalRevenue.stat_value.toLocaleString()}`} 
          change={isLoading ? undefined : totalRevenue.stat_change}
          trend={totalRevenue.stat_change > 0 ? "positive" : totalRevenue.stat_change < 0 ? "negative" : "neutral"}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard 
          title="Active Properties" 
          value={isLoading ? '--' : activeListings.stat_value} 
          change={isLoading ? undefined : activeListings.stat_change}
          trend={activeListings.stat_change > 0 ? "positive" : activeListings.stat_change < 0 ? "negative" : "neutral"}
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatsCard 
          title="Users & Agents" 
          value={isLoading ? '--' : usersAgents.stat_value} 
          change={isLoading ? undefined : usersAgents.stat_change}
          trend={usersAgents.stat_change > 0 ? "positive" : usersAgents.stat_change < 0 ? "negative" : "neutral"}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard 
          title="Payment Approvals" 
          value={isLoading ? '--' : paymentApprovals.stat_value} 
          change={isLoading ? undefined : paymentApprovals.stat_change}
          trend={paymentApprovals.stat_change > 0 ? "positive" : paymentApprovals.stat_change < 0 ? "negative" : "neutral"}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </StatsCardGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.activity_type}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activities to display</p>
                <p className="text-sm">Activities will appear here as users interact with the platform</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Payments requiring your review</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : pendingApprovals && pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {pendingApprovals.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Hourglass className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium">
                          ${Number(payment.amount).toLocaleString()} - {payment.properties?.title || 'Property Payment'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on: {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="default">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending approvals</p>
                <p className="text-sm">You're all caught up! Payments requiring approval will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Real Estate Market Insights</CardTitle>
            <CardDescription>Key metrics and trends in your property portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Landmark className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Avg. Property Price</p>
                    <p className="text-xs text-muted-foreground">₦45,200,000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Avg. Days on Market</p>
                    <p className="text-xs text-muted-foreground">32 days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hottest Location</p>
                    <p className="text-xs text-muted-foreground">Lekki, Lagos</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Property Type Distribution</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Apartments</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2 bg-blue-100">
                      <div className="h-full bg-blue-500 rounded-full"></div>
                    </Progress>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Houses</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2 bg-green-100">
                      <div className="h-full bg-green-500 rounded-full"></div>
                    </Progress>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Land</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <Progress value={18} className="h-2 bg-amber-100">
                      <div className="h-full bg-amber-500 rounded-full"></div>
                    </Progress>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Commercial</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2 bg-purple-100">
                      <div className="h-full bg-purple-500 rounded-full"></div>
                    </Progress>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Property Features in Demand</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">3+ Bedrooms (78%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">2+ Bathrooms (65%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">150m²+ Area (52%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.pathname = '/admin-dashboard/users'}>
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.pathname = '/admin-dashboard/properties'}>
                <Building2 className="mr-2 h-4 w-4" />
                Manage Properties
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.pathname = '/admin-dashboard/payment-config'}>
                <DollarSign className="mr-2 h-4 w-4" />
                Payment Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recently Registered Users</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => window.location.pathname = '/admin-dashboard/users'}
            >
              <span>View All</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : recentUsers && recentUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.user_type === 'admin' ? "default" : user.user_type === 'agent' ? "outline" : "secondary"}>
                        {user.user_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent user registrations</p>
              <p className="text-sm">New users will appear here when they register</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lekki, Lagos</p>
                    <p className="text-xs text-muted-foreground">32 properties</p>
                  </div>
                </div>
                <Badge variant="outline">₦65M avg</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ikeja, Lagos</p>
                    <p className="text-xs text-muted-foreground">28 properties</p>
                  </div>
                </div>
                <Badge variant="outline">₦48M avg</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Calabar, Cross River</p>
                    <p className="text-xs text-muted-foreground">24 properties</p>
                  </div>
                </div>
                <Badge variant="outline">₦32M avg</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Enugu, Enugu</p>
                    <p className="text-xs text-muted-foreground">18 properties</p>
                  </div>
                </div>
                <Badge variant="outline">₦28M avg</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">12 properties sold</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">₦148M</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Michael Okonkwo</p>
                    <p className="text-xs text-muted-foreground">10 properties sold</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">₦132M</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Chioma Eze</p>
                    <p className="text-xs text-muted-foreground">8 properties sold</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">₦98M</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">David Adeyemi</p>
                    <p className="text-xs text-muted-foreground">7 properties sold</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">₦85M</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
