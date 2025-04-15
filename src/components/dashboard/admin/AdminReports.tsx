import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, LineChart, FileSpreadsheet, Download, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminReports() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Reports & Analytics"
        subtitle="Comprehensive reporting and analytics for your real estate business"
      />

      <Card className="border-dashed border-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Coming Soon</CardTitle>
            <CardDescription>
              We're building something amazing for you
            </CardDescription>
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Advanced Reporting & Analytics</h3>
              <p className="text-muted-foreground">
                We're working on a comprehensive reporting system that will provide deep insights into your real estate business.
                This feature will be available in the next update.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">Sales Reports</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Detailed sales analytics with filtering by property type, location, and time period.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">Agent Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Track agent performance metrics including listings, sales, and commission earnings.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">Market Trends</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Market analysis showing property value trends and demand patterns over time.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Preview of Coming Features</h3>
              
              <div className="border rounded-md p-4 bg-card/50">
                <Tabs defaultValue="sales" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="sales">Sales</TabsTrigger>
                      <TabsTrigger value="agents">Agents</TabsTrigger>
                      <TabsTrigger value="properties">Properties</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex gap-2">
                      <Select disabled>
                        <SelectTrigger className="w-[180px]">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Last 30 days</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">Last 7 days</SelectItem>
                          <SelectItem value="30days">Last 30 days</SelectItem>
                          <SelectItem value="90days">Last 90 days</SelectItem>
                          <SelectItem value="year">This year</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="icon" disabled>
                        <Filter className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm" disabled>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      
                      <Button variant="outline" size="icon" disabled>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="sales" className="mt-0">
                    <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Sales analytics visualization coming soon</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="agents" className="mt-0">
                    <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PieChart className="h-10 w-10 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Agent performance metrics coming soon</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="properties" className="mt-0">
                    <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <LineChart className="h-10 w-10 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Property analytics coming soon</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
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
