
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProfile from "@/components/dashboard/admin/AdminProfile";
import AdminProperties from "@/components/dashboard/admin/AdminProperties";
import AdminAgents from "@/components/dashboard/admin/AdminAgents";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";
import AdminSales from "@/components/dashboard/admin/AdminSales";
import { Helmet } from "react-helmet-async";
import { BarChart3, Building2, Users, DollarSign, FileText, BellRing } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | GODIRECT</title>
      </Helmet>
      <DashboardLayout userType="admin">
        <Routes>
          <Route index element={
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Welcome to the GODIRECT administration panel
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Properties</CardTitle>
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">124</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      12 new properties this month
                    </CardDescription>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-primary h-full w-3/4 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Agents</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">38</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      5 new agents this month
                    </CardDescription>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-primary h-full w-1/2 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Users</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1,652</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      143 new users this month
                    </CardDescription>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-primary h-full w-4/5 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Sales</CardTitle>
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$2.4M</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      +18% from last month
                    </CardDescription>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-green-500 h-full w-2/3 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Reports</CardTitle>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      3 pending review
                    </CardDescription>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-primary h-full w-1/4 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
                    <BellRing className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      7 require immediate attention
                    </CardDescription>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-amber-500 h-full w-1/3 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {[
                        { title: "New property listing approved", time: "2 hours ago" },
                        { title: "Agent commission structure updated", time: "5 hours ago" },
                        { title: "Monthly financial report generated", time: "Yesterday" },
                        { title: "3 new user accounts verified", time: "Yesterday" },
                        { title: "Property pricing guidelines updated", time: "3 days ago" }
                      ].map((item, i) => (
                        <li key={i} className="flex justify-between border-b pb-2 last:border-0">
                          <span>{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.time}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <div className="text-muted-foreground text-sm">Avg. Response Time</div>
                        <div className="text-xl font-bold mt-1">1.2 hrs</div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="text-muted-foreground text-sm">Property Views</div>
                        <div className="text-xl font-bold mt-1">8.4K</div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="text-muted-foreground text-sm">Support Tickets</div>
                        <div className="text-xl font-bold mt-1">16</div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="text-muted-foreground text-sm">Conversion Rate</div>
                        <div className="text-xl font-bold mt-1">3.2%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          } />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/properties" element={<AdminProperties />} />
          <Route path="/agents" element={<AdminAgents />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/sales" element={<AdminSales />} />
          <Route path="/reports" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Reports</h2>
              <p>Generate and view detailed reports about property sales, user activity, and more.</p>
            </div>
          } />
          <Route path="/notifications" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
              <p>Manage system notifications and alerts for users and agents.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
