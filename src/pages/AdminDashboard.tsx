import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProfile from "@/components/dashboard/admin/AdminProfile";
import AdminProperties from "@/components/dashboard/admin/AdminProperties";
import AdminAgents from "@/components/dashboard/admin/AdminAgents";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";
import AdminSales from "@/components/dashboard/admin/AdminSales";
import PaymentProcessing from "@/components/dashboard/admin/PaymentProcessing";
import AnalyticsPanel from "@/components/dashboard/analytics/AnalyticsPanel";
import { FinancialManagement } from "@/components/dashboard/financial/FinancialManagement";
import LegalCompliance from "@/components/dashboard/legal/LegalCompliance";
import SupportCenter from "@/components/dashboard/admin/SupportCenter";
import SystemConfiguration from "@/components/dashboard/admin/SystemConfiguration";
import { Helmet } from "react-helmet-async";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCardGrid, StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  BadgePercent, 
  CreditCard, 
  ActivitySquare,
  BarChart3,
  BellRing,
  FileText,
  Wallet,
  BuildingBank,
  Landmark,
  Receipt,
  CreditCard as CreditCardIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
              <DashboardHeader
                title="Admin Dashboard"
                subtitle="Welcome to the GODIRECT administration panel"
                actionLabel="Generate Report"
                actionIcon={<ActivitySquare className="h-4 w-4" />}
                dateFilter={true}
                exportButton={true}
              />
              
              <StatsCardGrid>
                <StatsCard
                  title="Total Revenue"
                  value="$37.95M"
                  change={18.2}
                  icon={<DollarSign className="h-4 w-4" />}
                  progressValue={82}
                  compareText="FY 2024-2025"
                />
                
                <StatsCard
                  title="Active Listings"
                  value="124"
                  change={10.7}
                  icon={<Building2 className="h-4 w-4" />}
                  progressValue={75}
                  compareText="12 new properties this month"
                />
                
                <StatsCard
                  title="Users & Agents"
                  value="1,690"
                  change={24.3}
                  icon={<Users className="h-4 w-4" />}
                  progressValue={65}
                  compareText="1,652 users, 38 agents"
                />
                
                <StatsCard
                  title="Payment Approvals"
                  value="24"
                  change={15.0}
                  icon={<Receipt className="h-4 w-4" />}
                  progressValue={45}
                  compareText="Pending approval"
                />
              </StatsCardGrid>
              
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
              
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-primary" />
                    Payment Processing Center
                  </CardTitle>
                  <CardDescription>
                    Review and manage property purchase requests and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Pending Approvals</div>
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-xs text-amber-500">Requires review</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Payments to Verify</div>
                      <div className="text-2xl font-bold">18</div>
                      <div className="text-xs text-blue-500">Received, not verified</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Scheduled Viewings</div>
                      <div className="text-2xl font-bold">9</div>
                      <div className="text-xs text-green-500">This week</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Documents Pending</div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-red-500">Requires attention</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium">Payment Methods Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bank Transfers</span>
                        <span>58%</span>
                      </div>
                      <Progress value={58} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>USSD Payments</span>
                        <span>24%</span>
                      </div>
                      <Progress value={24} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Crypto</span>
                        <span>12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Mobile Money</span>
                        <span>6%</span>
                      </div>
                      <Progress value={6} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col sm:flex-row w-full gap-2">
                    <Button className="flex-1" asChild>
                      <a href="/admin-dashboard/payments">
                        <Receipt className="mr-2 h-4 w-4" />
                        Manage Payments
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <BuildingBank className="mr-2 h-4 w-4" />
                      Payment Methods Config
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <DashboardTabs
                variant="default"
                tabs={[
                  {
                    value: "overview",
                    label: "Overview",
                    content: (
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
                    )
                  },
                  {
                    value: "properties",
                    label: "Properties",
                    content: (
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
                    )
                  },
                  {
                    value: "users",
                    label: "Users & Agents",
                    content: (
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
                    )
                  },
                  {
                    value: "financials",
                    label: "Financials",
                    content: (
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
                    )
                  },
                  {
                    value: "payments",
                    label: "Payment Processing",
                    content: (
                      <Card className="shadow-md">
                        <CardHeader>
                          <CardTitle>Payment Processing Overview</CardTitle>
                          <CardDescription>Manage property purchase requests and payment processing</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-muted/30 p-3 rounded-lg flex flex-col items-center">
                              <CreditCardIcon className="h-8 w-8 mb-2 text-primary" />
                              <div className="text-lg font-medium">Bank Transfers</div>
                              <div className="text-sm text-muted-foreground">Manage bank transfers</div>
                              <Button variant="outline" size="sm" className="mt-2 w-full">Configure</Button>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg flex flex-col items-center">
                              <Landmark className="h-8 w-8 mb-2 text-amber-500" />
                              <div className="text-lg font-medium">USSD Payments</div>
                              <div className="text-sm text-muted-foreground">Manage USSD payments</div>
                              <Button variant="outline" size="sm" className="mt-2 w-full">Configure</Button>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg flex flex-col items-center">
                              <Wallet className="h-8 w-8 mb-2 text-green-500" />
                              <div className="text-lg font-medium">Crypto</div>
                              <div className="text-sm text-muted-foreground">Manage crypto payments</div>
                              <Button variant="outline" size="sm" className="mt-2 w-full">Configure</Button>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg flex flex-col items-center">
                              <BuildingBank className="h-8 w-8 mb-2 text-blue-500" />
                              <div className="text-lg font-medium">Mobile Money</div>
                              <div className="text-sm text-muted-foreground">Manage mobile payments</div>
                              <Button variant="outline" size="sm" className="mt-2 w-full">Configure</Button>
                            </div>
                          </div>
                          
                          <Button asChild className="w-full">
                            <a href="/admin-dashboard/payments">Go To Full Payment Center</a>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  },
                ]}
              />
            </div>
          } />
          <Route path="/analytics" element={<AnalyticsPanel />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/properties" element={<AdminProperties />} />
          <Route path="/agents" element={<AdminAgents />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/sales" element={<AdminSales />} />
          <Route path="/payments" element={<PaymentProcessing />} />
          <Route path="/financial" element={<FinancialManagement />} />
          <Route path="/legal" element={<LegalCompliance />} />
          <Route path="/reports" element={
            <div className="p-6">
              <DashboardHeader 
                title="Reports" 
                subtitle="Generate and view detailed reports about property sales, user activity, and more"
                actionLabel="New Report"
                actionIcon={<FileText className="h-4 w-4" />}
              />
              {/* Report content will go here */}
            </div>
          } />
          <Route path="/notifications" element={
            <div className="p-6">
              <DashboardHeader 
                title="Notifications" 
                subtitle="Manage system notifications and alerts for users and agents"
                actionLabel="Send Notification"
                actionIcon={<BellRing className="h-4 w-4" />}
              />
              {/* Notifications content will go here */}
            </div>
          } />
          
          <Route path="/support-tickets" element={<SupportCenter />} />
          <Route path="/knowledge-base" element={<SupportCenter initialTab="knowledge" />} />
          <Route path="/team-chat" element={<SupportCenter initialTab="team" />} />
          
          <Route path="/email-templates" element={<SystemConfiguration initialTab="email" />} />
          <Route path="/platform-settings" element={<SystemConfiguration initialTab="platform" />} />
          <Route path="/maintenance" element={<SystemConfiguration initialTab="maintenance" />} />
          
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
