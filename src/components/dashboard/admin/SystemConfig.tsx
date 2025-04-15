import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Mail, Server, Database, Sliders, Shield, Clock, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SystemConfig() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="System Configuration"
        subtitle="Manage system settings and configurations"
      />

      <Card className="border-dashed border-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Coming Soon</CardTitle>
            <CardDescription>
              System configuration tools are under development
            </CardDescription>
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Settings className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">System Configuration Center</h3>
              <p className="text-muted-foreground">
                We're building a comprehensive system configuration center that will allow you to customize and optimize your real estate platform.
                This feature will be available in the next update.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">Email Templates</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Customize email templates for notifications, welcome messages, and transaction confirmations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">Platform Settings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Configure platform-wide settings, appearance options, and feature toggles.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Schedule maintenance, manage backups, and monitor system performance.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Preview of Coming Features</h3>
              
              <div className="border rounded-md p-4 bg-card/50">
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="email">Email Templates</TabsTrigger>
                    <TabsTrigger value="platform">Platform Settings</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email" className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-medium">Email Template Manager</h4>
                      <Button variant="outline" size="sm" disabled>New Template</Button>
                    </div>
                    
                    <div className="border rounded-md divide-y">
                      {[
                        { name: "Welcome Email", type: "User", lastUpdated: "2 weeks ago" },
                        { name: "Property Listing Confirmation", type: "Property", lastUpdated: "1 month ago" },
                        { name: "Payment Receipt", type: "Transaction", lastUpdated: "3 weeks ago" },
                        { name: "Password Reset", type: "Security", lastUpdated: "1 month ago" },
                      ].map((template, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div>
                            <h5 className="font-medium">{template.name}</h5>
                            <p className="text-xs text-muted-foreground">Type: {template.type} • Last updated: {template.lastUpdated}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" disabled>Preview</Button>
                            <Button variant="ghost" size="sm" disabled>Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-muted/20 rounded-md p-4">
                      <p className="text-sm text-muted-foreground text-center">
                        The email template editor will allow you to customize all system emails with a visual editor.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="platform" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-base font-medium">General Settings</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="platform-name">Platform Name</Label>
                              <p className="text-xs text-muted-foreground">Your real estate platform name</p>
                            </div>
                            <div className="w-[180px] bg-muted/20 h-9 rounded-md"></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="currency">Default Currency</Label>
                              <p className="text-xs text-muted-foreground">Primary currency for transactions</p>
                            </div>
                            <div className="w-[180px] bg-muted/20 h-9 rounded-md"></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="timezone">Timezone</Label>
                              <p className="text-xs text-muted-foreground">Default timezone for the platform</p>
                            </div>
                            <div className="w-[180px] bg-muted/20 h-9 rounded-md"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-base font-medium">Feature Toggles</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="user-registration">Public User Registration</Label>
                              <p className="text-xs text-muted-foreground">Allow users to register accounts</p>
                            </div>
                            <Switch id="user-registration" disabled />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="agent-listings">Agent Property Listings</Label>
                              <p className="text-xs text-muted-foreground">Allow agents to create listings</p>
                            </div>
                            <Switch id="agent-listings" disabled />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="online-payments">Online Payments</Label>
                              <p className="text-xs text-muted-foreground">Enable online payment processing</p>
                            </div>
                            <Switch id="online-payments" disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="maintenance" className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">System Status</h4>
                        <p className="text-sm text-muted-foreground">Current system performance and status</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h5 className="font-medium">Database</h5>
                            <p className="text-xs text-muted-foreground">Last backup: 6 hours ago</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h5 className="font-medium">Security</h5>
                            <p className="text-xs text-muted-foreground">Last scan: 12 hours ago</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h5 className="font-medium">Uptime</h5>
                            <p className="text-xs text-muted-foreground">99.9% this month</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-medium">Scheduled Maintenance</h4>
                        <Button variant="outline" size="sm" disabled>Schedule New</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded-md">
                          <div>
                            <h5 className="font-medium text-amber-800">Database Optimization</h5>
                            <p className="text-xs text-amber-700">April 20, 2025 • 02:00 - 04:00 AM</p>
                          </div>
                          <Badge variant="outline" className="text-amber-800 border-amber-300">Scheduled</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-muted/10 border rounded-md">
                          <div>
                            <h5 className="font-medium">System Update</h5>
                            <p className="text-xs text-muted-foreground">May 5, 2025 • 01:00 - 03:00 AM</p>
                          </div>
                          <Badge variant="outline">Planned</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button disabled className="gap-2">
                <RefreshCw className="h-4 w-4" /> Check for Updates
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-center">
          <p className="text-sm text-center text-muted-foreground max-w-md">
            Our system configuration tools are currently under development and will be available in the next update. 
            Thank you for your patience!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
