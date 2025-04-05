import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProfile from "@/components/dashboard/admin/AdminProfile";
import AdminProperties from "@/components/dashboard/admin/AdminProperties";
import AdminAgents from "@/components/dashboard/admin/AdminAgents";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";
import AdminSales from "@/components/dashboard/admin/AdminSales";
import { Helmet } from "react-helmet-async";
import { BarChart3, Building2, Users, DollarSign, FileText, BellRing, TrendingUp, Calendar, ArrowUp, ArrowDown, BadgePercent, CreditCard, ActivitySquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

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
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="text-sm flex items-center gap-2" size="sm">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">April 2025</span>
                  </Button>
                  <Button variant="outline" className="text-sm flex items-center gap-2" size="sm">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm flex items-center gap-2">
                    <ActivitySquare className="h-4 w-4" />
                    <span>Generate Report</span>
                  </Button>
                </div>
              </div>
              
              {/* Dashboard Summary Stats */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">$37.95M</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        18.2%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      FY 2024-2025
                    </div>
                    <div className="mt-3">
                      <Progress value={82} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Active Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">124</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        10.7%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      12 new properties this month
                    </div>
                    <div className="mt-3">
                      <Progress value={75} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Users & Agents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">1,690</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        24.3%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      1,652 users, 38 agents
                    </div>
                    <div className="mt-3">
                      <Progress value={65} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">3.2%</div>
                      <div className="flex items-center text-red-500 text-sm font-medium">
                        <ArrowDown className="mr-1 h-4 w-4" />
                        0.5%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      From visitor to customer
                    </div>
                    <div className="mt-3">
                      <Progress value={32} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Revenue Report Cards */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Daily Revenue</CardTitle>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$140,000</div>
                    <div className="flex items-center mt-1">
                      <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                      <CardDescription className="text-sm text-green-500">
                        +15% from yesterday
                      </CardDescription>
                    </div>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-green-500 h-full w-3/4 rounded-full" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Sales Count</div>
                        <div className="font-medium">24</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg. Value</div>
                        <div className="font-medium">$5,833</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      View detailed report
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Monthly Revenue</CardTitle>
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$2.8M</div>
                    <div className="flex items-center mt-1">
                      <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                      <CardDescription className="text-sm text-green-500">
                        +12.5% from last month
                      </CardDescription>
                    </div>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-primary h-full w-2/3 rounded-full" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Properties Sold</div>
                        <div className="font-medium">48</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Commission</div>
                        <div className="font-medium">$280K</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      View monthly breakdown
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Yearly Revenue</CardTitle>
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$37.95M</div>
                    <div className="flex items-center mt-1">
                      <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                      <CardDescription className="text-sm text-red-500">
                        -6.1% from last year
                      </CardDescription>
                    </div>
                    <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div className="bg-amber-500 h-full w-1/2 rounded-full" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">YTD Target</div>
                        <div className="font-medium">$40M</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Completion</div>
                        <div className="font-medium">94.9%</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      View annual report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="users">Users & Agents</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          View All Stats
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="properties">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Property Statistics</CardTitle>
                      <CardDescription>Detailed breakdown of property listings and sales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                          <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <div className="text-xl font-bold">124</div>
                          <div className="text-sm text-muted-foreground">Active Listings</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                          <BadgePercent className="h-6 w-6 mx-auto mb-2 text-green-500" />
                          <div className="text-xl font-bold">86%</div>
                          <div className="text-sm text-muted-foreground">Listing Success Rate</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                          <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                          <div className="text-xl font-bold">$398k</div>
                          <div className="text-sm text-muted-foreground">Average Sale Price</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Property Types Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Residential</span>
                            <span>68 (55%)</span>
                          </div>
                          <Progress value={55} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Commercial</span>
                            <span>32 (26%)</span>
                          </div>
                          <Progress value={26} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Land/Plots</span>
                            <span>16 (13%)</span>
                          </div>
                          <Progress value={13} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Industrial</span>
                            <span>8 (6%)</span>
                          </div>
                          <Progress value={6} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View All Properties</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="users">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Overview of users and agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">User Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Total Users</div>
                              <div className="text-2xl font-bold">1,652</div>
                              <div className="text-xs text-green-500">+143 this month</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Active Users</div>
                              <div className="text-2xl font-bold">984</div>
                              <div className="text-xs text-muted-foreground">59.6% of total</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Premium Users</div>
                              <div className="text-2xl font-bold">258</div>
                              <div className="text-xs text-muted-foreground">15.6% of total</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">New Sign-ups</div>
                              <div className="text-2xl font-bold">48</div>
                              <div className="text-xs text-green-500">+12% this week</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Agent Performance</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Total Agents</div>
                              <div className="text-2xl font-bold">38</div>
                              <div className="text-xs text-green-500">+5 this month</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Top Agent</div>
                              <div className="text-lg font-medium truncate">Sarah Johnson</div>
                              <div className="text-xs text-muted-foreground">$1.2M in sales</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Avg. Response Time</div>
                              <div className="text-2xl font-bold">1.4h</div>
                              <div className="text-xs text-green-500">-15min improvement</div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="text-sm text-muted-foreground">Satisfaction</div>
                              <div className="text-2xl font-bold">4.8</div>
                              <div className="text-xs text-muted-foreground">out of 5</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2">
                      <Button className="w-full sm:w-auto" variant="outline">Manage Users</Button>
                      <Button className="w-full sm:w-auto">Manage Agents</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="financials">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Financial Overview</CardTitle>
                      <CardDescription>Detailed breakdown of revenue and expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                          <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
                          <div className="text-xl font-bold">$37.95M</div>
                          <div className="text-sm text-muted-foreground">Total Revenue YTD</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                          <BadgePercent className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <div className="text-xl font-bold">$3.16M</div>
                          <div className="text-sm text-muted-foreground">Commission Revenue</div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                          <div className="text-xl font-bold">28.4%</div>
                          <div className="text-sm text-muted-foreground">Profit Margin</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Revenue Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Property Sales</span>
                            <span>$32.5M (85.6%)</span>
                          </div>
                          <Progress value={85.6} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Property Management</span>
                            <span>$3.8M (10.0%)</span>
                          </div>
                          <Progress value={10} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Premium Subscriptions</span>
                            <span>$1.2M (3.2%)</span>
                          </div>
                          <Progress value={3.2} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Advisory Services</span>
                            <span>$0.45M (1.2%)</span>
                          </div>
                          <Progress value={1.2} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View Detailed Financial Reports</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
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
