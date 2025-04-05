
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AgentProfile from "@/components/dashboard/agent/AgentProfile";
import AgentListings from "@/components/dashboard/agent/AgentListings";
import AgentClients from "@/components/dashboard/agent/AgentClients";
import AgentSettings from "@/components/dashboard/agent/AgentSettings";
import AgentCommissions from "@/components/dashboard/agent/AgentCommissions";
import AgentLeads from "@/components/dashboard/agent/AgentLeads";
import { Helmet } from "react-helmet-async";
import { 
  Home, 
  Users2, 
  UserPlus, 
  DollarSign, 
  BarChart, 
  Calendar, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Clock 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const AgentDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Agent Dashboard | GODIRECT</title>
      </Helmet>
      <DashboardLayout userType="agent">
        <Routes>
          <Route index element={
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your listings, clients, and performance
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>April 2025</span>
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Add New Listing
                  </Button>
                </div>
              </div>
              
              {/* Performance Overview */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Total Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">14</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        16%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs last month
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Active Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">26</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        24%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs last month
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">$12,850</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        24%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs last month
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">New Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">9</div>
                      <div className="flex items-center text-red-500 text-sm font-medium">
                        <ArrowDown className="mr-1 h-4 w-4" />
                        5%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs last month
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="upcoming">Schedule</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xl font-semibold">My Listings</CardTitle>
                        <Home className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">14</div>
                        <CardDescription className="text-sm text-muted-foreground">
                          3 under contract, 11 active
                        </CardDescription>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                          <div className="flex flex-col items-center justify-center bg-muted p-2 rounded">
                            <span className="font-medium">8</span>
                            <span className="text-muted-foreground">For Sale</span>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-muted p-2 rounded">
                            <span className="font-medium">3</span>
                            <span className="text-muted-foreground">For Rent</span>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-muted p-2 rounded">
                            <span className="font-medium">3</span>
                            <span className="text-muted-foreground">Pending</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xl font-semibold">Clients</CardTitle>
                        <Users2 className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">26</div>
                        <CardDescription className="text-sm text-muted-foreground">
                          12 buyers, 14 sellers
                        </CardDescription>
                        <div className="mt-4 flex items-center">
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[46%]" />
                          </div>
                          <span className="ml-2 text-xs text-muted-foreground">46% buyers</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xl font-semibold">Leads</CardTitle>
                        <UserPlus className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">9</div>
                        <CardDescription className="text-sm text-muted-foreground">
                          4 new leads this week
                        </CardDescription>
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span>New</span>
                            <span className="text-muted-foreground">4</span>
                          </div>
                          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[40%]" />
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span>In Progress</span>
                            <span className="text-muted-foreground">5</span>
                          </div>
                          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[60%]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xl font-semibold">Commissions</CardTitle>
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">$12,850</div>
                        <CardDescription className="text-sm text-muted-foreground">
                          +24% from last month
                        </CardDescription>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground">YTD</div>
                            <div className="font-medium">$87,400</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground">Pending</div>
                            <div className="font-medium">$34,200</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xl font-semibold">Performance</CardTitle>
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">94%</div>
                        <CardDescription className="text-sm text-muted-foreground">
                          Avg. closing ratio
                        </CardDescription>
                        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg. days on market:</span>
                            <span className="font-medium">32</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Listings closed:</span>
                            <span className="font-medium">7</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xl font-semibold">Upcoming</CardTitle>
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">7</div>
                        <CardDescription className="text-sm text-muted-foreground">
                          Events scheduled this week
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-xs">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Property viewings (4)</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span>Client meetings (2)</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span>Contract signings (1)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="performance">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>Sales Performance</CardTitle>
                        <CardDescription>Tracking your sales metrics over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[240px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                          <BarChart className="h-10 w-10 text-muted" />
                          <span className="ml-2 text-muted-foreground">Performance chart</span>
                        </div>
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-muted/30 rounded-md p-3">
                              <div className="text-xs text-muted-foreground">Conversion Rate</div>
                              <div className="text-lg font-semibold mt-1">68%</div>
                            </div>
                            <div className="bg-muted/30 rounded-md p-3">
                              <div className="text-xs text-muted-foreground">Avg Sale Price</div>
                              <div className="text-lg font-semibold mt-1">$385k</div>
                            </div>
                            <div className="bg-muted/30 rounded-md p-3">
                              <div className="text-xs text-muted-foreground">Time to Close</div>
                              <div className="text-lg font-semibold mt-1">32 days</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>Performance Goals</CardTitle>
                        <CardDescription>Track your progress against targets</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Monthly Sales</span>
                            <span>$45,000 / $60,000</span>
                          </div>
                          <Progress value={75} className="h-2" />
                          <div className="text-xs text-muted-foreground">75% of monthly target</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>New Clients</span>
                            <span>8 / 10</span>
                          </div>
                          <Progress value={80} className="h-2" />
                          <div className="text-xs text-muted-foreground">80% of monthly target</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Properties Listed</span>
                            <span>4 / 6</span>
                          </div>
                          <Progress value={67} className="h-2" />
                          <div className="text-xs text-muted-foreground">67% of monthly target</div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Detailed Analytics</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Upcoming Schedule</CardTitle>
                      <CardDescription>Your appointments for the next 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { 
                            title: "Property Viewing - 425 Park Avenue", 
                            time: "Today, 2:00 PM", 
                            client: "John Anderson",
                            status: "confirmed",
                            icon: <Check className="h-4 w-4 text-green-500" />
                          },
                          { 
                            title: "Client Meeting - Mortgage Discussion", 
                            time: "Tomorrow, 10:00 AM", 
                            client: "Sarah Williams",
                            status: "confirmed",
                            icon: <Check className="h-4 w-4 text-green-500" />
                          },
                          { 
                            title: "Contract Signing - 78 Blueberry Lane", 
                            time: "Apr 07, 3:30 PM", 
                            client: "Michael Chen",
                            status: "pending",
                            icon: <Clock className="h-4 w-4 text-amber-500" />
                          },
                          { 
                            title: "Property Viewing - 15 Oakwood Drive", 
                            time: "Apr 08, 1:00 PM", 
                            client: "Jennifer Smith",
                            status: "confirmed",
                            icon: <Check className="h-4 w-4 text-green-500" />
                          },
                        ].map((appointment, index) => (
                          <div key={index} className="flex border rounded-md p-3">
                            <div className="mr-4">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                {appointment.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{appointment.title}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                With {appointment.client}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="text-xs text-muted-foreground">{appointment.time}</div>
                                <Badge variant={appointment.status === "confirmed" ? "success" : "warning"}>
                                  {appointment.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Calendar</Button>
                      <Button>Add Appointment</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[240px] overflow-auto">
                    <ul className="space-y-3">
                      {[
                        { title: "New inquiry for 425 Park Avenue", time: "30 min ago" },
                        { title: "Property viewing scheduled for tomorrow", time: "2 hours ago" },
                        { title: "Offer accepted for 78 Blueberry Lane", time: "Yesterday" },
                        { title: "New lead assigned to you", time: "Yesterday" },
                        { title: "Commission payment processed", time: "3 days ago" }
                      ].map((item, i) => (
                        <li key={i} className="flex justify-between border-b pb-2 last:border-0">
                          <span>{item.title}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{item.time}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Top Performing Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        { address: "425 Park Avenue", views: 128, inquiries: 8 },
                        { address: "78 Blueberry Lane", views: 106, inquiries: 6 },
                        { address: "15 Oakwood Drive", views: 93, inquiries: 5 }
                      ].map((listing, i) => (
                        <li key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                              <span className="text-xs font-medium">{i+1}</span>
                            </div>
                            <span>{listing.address}</span>
                          </div>
                          <div className="text-xs text-right">
                            <div><span className="text-muted-foreground">Views:</span> {listing.views}</div>
                            <div><span className="text-muted-foreground">Inquiries:</span> {listing.inquiries}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          } />
          <Route path="/profile" element={<AgentProfile />} />
          <Route path="/listings" element={<AgentListings />} />
          <Route path="/clients" element={<AgentClients />} />
          <Route path="/settings" element={<AgentSettings />} />
          <Route path="/leads" element={<AgentLeads />} />
          <Route path="/commissions" element={<AgentCommissions />} />
          <Route path="/performance" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Performance Analytics</h2>
              <p>View your sales performance, targets, and comparison to other agents.</p>
            </div>
          } />
          <Route path="/calendar" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
              <p>Manage your appointments, viewings, and other scheduled events.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/agent-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default AgentDashboard;
