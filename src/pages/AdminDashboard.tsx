
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "recharts";
import { Building, ChevronUp, Users, DollarSign } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Helmet } from "react-helmet-async";

// Mock data for statistics
const statsData = [
  { title: "Total Properties", value: "2,834", icon: Building, change: "+12.5%" },
  { title: "Total Users", value: "3,549", icon: Users, change: "+25.2%" },
  { title: "Total Agents", value: "120", icon: Users, change: "+5.4%" },
  { title: "Monthly Revenue", value: "$94,320", icon: DollarSign, change: "+18.2%" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout userType="admin">
      <Helmet>
        <title>Admin Dashboard | HomePulse Realty</title>
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all platform statistics and activities
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <ChevronUp className="h-3 w-3 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Monthly Property Listings</CardTitle>
                  <CardDescription>
                    New properties listed per month
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Chart will be implemented with actual data */}
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">Property chart would render here</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>User Registrations</CardTitle>
                  <CardDescription>
                    New user sign-ups per month
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Chart will be implemented with actual data */}
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">User chart would render here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Properties</CardTitle>
                <CardDescription>
                  Recently listed properties across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Property list would render here</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management table would render here</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Management</CardTitle>
                <CardDescription>
                  Manage all registered real estate agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Agent management table would render here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
