
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { StatsCardGrid, StatsCard } from "@/components/dashboard/StatsCard";
import { FeatureCard, MetricGroup } from "@/components/dashboard/FeatureCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, Users, DollarSign, AlertTriangle, Clock, Activity, 
  Bell, Search, ArrowUpRight, Briefcase, Calendar, ChevronRight,
  User, CheckCircle, XCircle, Hourglass, TrendingUp, TrendingDown, RefreshCw
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
  
  // Fetch dashboard stats
  const { 
    data: dashboardStats, 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });

  // Find specific stats by name
  const totalRevenue = findStatByName(dashboardStats, 'total_revenue');
  const activeListings = findStatByName(dashboardStats, 'active_listings');
  const usersAgents = findStatByName(dashboardStats, 'users_agents');
  const paymentApprovals = findStatByName(dashboardStats, 'payment_approvals');
  const propertiesSold = findStatByName(dashboardStats, 'properties_sold');

  // Fetch recent users
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

  // Fetch pending approvals
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

  // Fetch recent activities
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

  // Handle refresh
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

  // Format trend icon component
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Welcome to your administrator dashboard"
        dateFilter={true}
        exportButton={true}
        refreshButton={true}
        onRefresh={handleRefresh}
      />

      {isError && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <p className="text-destructive">Failed to load dashboard data. Please try refreshing.</p>
          </CardContent>
        </Card>
      )}

      {/* Overview Statistics */}
      <StatsCardGrid>
        <StatsCard 
          title="Total Revenue" 
          value={isLoading ? '--' : totalRevenue.stat_value} 
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
        {/* Activity Stream */}
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

        {/* Pending Tasks */}
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

      {/* System Status and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Server and application performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-xs text-muted-foreground">Avg: 125 ms</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Load</span>
                    <span className="text-xs text-muted-foreground">Current: 42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connections</span>
                    <span className="text-xs text-muted-foreground">Active: 18/50</span>
                  </div>
                  <Progress value={36} className="h-2" />
                </div>
              </div>
            )}
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

      {/* Recent Users Table */}
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
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$238.5K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12.3%
              </span> from last month
            </p>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-full w-3/4 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '--' : activeListings.stat_value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`${formatTrendClass(activeListings.stat_change)} inline-flex items-center`}>
                {activeListings.stat_change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {activeListings.stat_change}%
              </span> from previous month
            </p>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-full w-2/3 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.2K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +8.7%
              </span> visits this week
            </p>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-full w-1/2 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 inline-flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" /> -1.2%
              </span> from last week
            </p>
            <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-full w-1/4 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
