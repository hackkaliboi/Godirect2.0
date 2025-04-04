
import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, DollarSign, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Helmet } from "react-helmet-async";
import AgentProfile from "@/components/dashboard/agent/AgentProfile";
import AgentSettings from "@/components/dashboard/agent/AgentSettings";
import AgentListings from "@/components/dashboard/agent/AgentListings";
import AgentClients from "@/components/dashboard/agent/AgentClients";
import { DashboardProvider } from "@/hooks/use-dashboard";

export default function AgentDashboard() {
  return (
    <DashboardProvider>
      <DashboardLayout userType="agent">
        <Helmet>
          <title>Agent Dashboard | HomePulse Realty</title>
        </Helmet>
        
        <Routes>
          <Route index element={<AgentDashboardMain />} />
          <Route path="profile" element={<AgentProfile />} />
          <Route path="settings" element={<AgentSettings />} />
          <Route path="listings" element={<AgentListings />} />
          <Route path="clients" element={<AgentClients />} />
        </Routes>
      </DashboardLayout>
    </DashboardProvider>
  );
}

function AgentDashboardMain() {
  // Sample data for agent stats
  const agentStats = [
    { title: "Active Listings", value: "8", icon: Building, color: "text-blue-500" },
    { title: "Total Clients", value: "24", icon: Users, color: "text-emerald-500" },
    { title: "Revenue (MTD)", value: "$32,450", icon: DollarSign, color: "text-violet-500" },
    { title: "Pending Deals", value: "3", icon: Clock, color: "text-amber-500" },
  ];

  // Sample data for recent activities
  const recentActivities = [
    { type: "New Inquiry", property: "Modern Downtown Apartment", client: "John Smith", date: "Today, 10:45 AM" },
    { type: "Scheduled Viewing", property: "Suburban Family Home", client: "Emma Johnson", date: "Today, 9:20 AM" },
    { type: "Offer Submitted", property: "Luxury Waterfront Condo", client: "Michael Brown", date: "Yesterday, 4:30 PM" },
    { type: "Price Change", property: "Cozy Studio Apartment", client: "System", date: "Yesterday, 11:15 AM" },
    { type: "New Listing", property: "Elegant Townhouse", client: "You", date: "Jun 12, 2023" },
  ];

  // Sample data for client list
  const clients = [
    { name: "John Smith", status: "Active", properties: 2, lastContact: "Today" },
    { name: "Emma Johnson", status: "Active", properties: 1, lastContact: "Yesterday" },
    { name: "Michael Brown", status: "Active", properties: 3, lastContact: "3 days ago" },
    { name: "Sophia Davis", status: "Inactive", properties: 0, lastContact: "2 weeks ago" },
    { name: "William Wilson", status: "Lead", properties: 0, lastContact: "1 day ago" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your listings, clients, and activities
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {agentStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 ${stat.color.replace('text', 'bg')}/10 rounded-full`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start">
                  <div className="mr-4 mt-1 w-2 h-2 rounded-full bg-primary"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.type}: {activity.property}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.client} • {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your sales and listing metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {/* Chart will be implemented with actual data */}
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Performance chart would render here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Listings</CardTitle>
              <CardDescription>
                Properties you currently have listed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Property listings would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Manage your client relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Last Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          client.status === "Active" ? "bg-emerald-100 text-emerald-800" :
                          client.status === "Lead" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell>{client.properties}</TableCell>
                      <TableCell>{client.lastContact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar & Appointments</CardTitle>
              <CardDescription>
                Your schedule and upcoming appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calendar would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Contracts</CardTitle>
              <CardDescription>
                Manage your sales documents and contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Documents list would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
