
import React from "react";
import { StatsCardGrid, StatsCard } from "@/components/dashboard/StatsCard";
import { FeatureCard, MetricGroup } from "@/components/dashboard/FeatureCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, Users, DollarSign, AlertTriangle, Clock, Activity, 
  Bell, Search, ArrowUpRight, Briefcase, Calendar, ChevronRight,
  User, CheckCircle, XCircle, Hourglass
} from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const AdminDashboardOverview = () => {
  // In a real application, this data would come from an API call
  // For now, we're using empty placeholder data
  const recentUsers = [];
  const pendingApprovals = [];
  const recentActivities = [];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Welcome to your administrator dashboard"
        dateFilter={true}
        exportButton={true}
        refreshButton={true}
      />

      {/* Overview Statistics */}
      <StatsCardGrid>
        <StatsCard 
          title="Total Properties" 
          value="--" 
          trend="neutral" 
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatsCard 
          title="Active Users" 
          value="--" 
          trend="neutral" 
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard 
          title="Revenue" 
          value="--" 
          trend="neutral" 
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard 
          title="Issues" 
          value="--" 
          trend="neutral" 
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
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Activity item would appear here</p>
                      <p className="text-xs text-muted-foreground">Time would appear here</p>
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
              Pending Tasks
            </CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {pendingApprovals.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Hourglass className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium">Task title would appear here</p>
                        <p className="text-xs text-muted-foreground">Submitted on: Date here</p>
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
                <p>No pending tasks</p>
                <p className="text-sm">You're all caught up! Tasks requiring attention will appear here.</p>
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
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-xs text-muted-foreground">Avg: -- ms</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Server Load</span>
                  <span className="text-xs text-muted-foreground">Current: --%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Connections</span>
                  <span className="text-xs text-muted-foreground">Active: --/--</span>
                </div>
                <Progress value={0} className="h-2" />
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
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Add New Property
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Advanced Search
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
            <Button variant="outline" size="sm" className="h-8">
              <span>View All</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user, idx) => (
                  <TableRow key={idx}>
                    <TableCell>User name would appear here</TableCell>
                    <TableCell>user@example.com</TableCell>
                    <TableCell>Date would appear here</TableCell>
                    <TableCell>
                      <Badge>User</Badge>
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
      
      {/* Calendar and Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
            <p className="text-sm">Events will appear here when scheduled</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
