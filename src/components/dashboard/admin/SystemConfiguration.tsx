
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Wrench, 
  Clock, 
  AlertTriangle, 
  Globe, 
  Database, 
  Check, 
  RefreshCw,
  FileText,
  Brush,
  DownloadCloud,
  Code
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SystemConfiguration() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  const [currency, setCurrency] = useState("ngn");
  
  const handleMaintenanceToggle = () => {
    setMaintenanceMode(!maintenanceMode);
    toast({
      title: maintenanceMode ? "Maintenance Mode Disabled" : "Maintenance Mode Enabled",
      description: maintenanceMode 
        ? "Your platform is now accessible to all users." 
        : "Your platform is now in maintenance mode. Only admins can access it.",
    });
  };
  
  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "System backup has been initiated. You'll be notified when it's complete.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">
          Manage all your platform settings, appearance, and system maintenance
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure language, currency, and timezone settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="hausa">Hausa</SelectItem>
                      <SelectItem value="yoruba">Yoruba</SelectItem>
                      <SelectItem value="igbo">Igbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngn">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="usd">US Dollar ($)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="gbp">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="west_africa">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="west_africa">West Africa Standard Time (GMT+1)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="est">Eastern Standard Time (GMT-5)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (GMT-6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_format">Date Format</Label>
                  <Select defaultValue="dd_mm_yyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy_mm_dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Regional Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Virtual Tours</p>
                    <p className="text-sm text-muted-foreground">Allow agents to upload virtual tours for properties</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Online Payments</p>
                    <p className="text-sm text-muted-foreground">Enable direct online payments through the platform</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Property Reviews</p>
                    <p className="text-sm text-muted-foreground">Allow users to leave reviews on properties</p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Agent Profiles</p>
                    <p className="text-sm text-muted-foreground">Make agent profiles visible to non-registered users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Feature Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure your email server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_server">SMTP Server</Label>
                  <Input id="smtp_server" placeholder="smtp.example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input id="smtp_port" placeholder="587" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp_username">SMTP Username</Label>
                  <Input id="smtp_username" placeholder="username@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp_password">SMTP Password</Label>
                  <Input id="smtp_password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from_email">From Email</Label>
                  <Input id="from_email" placeholder="noreply@godirect.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="from_name">From Name</Label>
                  <Input id="from_name" placeholder="GODIRECT Properties" />
                </div>
              </div>
              
              <Button className="mt-2">Save Email Settings</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize email templates sent by the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template_type">Select Template</Label>
                <Select defaultValue="welcome">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="password_reset">Password Reset</SelectItem>
                    <SelectItem value="property_alert">Property Alert</SelectItem>
                    <SelectItem value="booking_confirmation">Viewing Confirmation</SelectItem>
                    <SelectItem value="purchase_receipt">Purchase Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_subject">Email Subject</Label>
                <Input id="email_subject" placeholder="Welcome to GODIRECT Properties!" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_content">Email Content</Label>
                <Textarea 
                  id="email_content" 
                  placeholder="Write your email template here..." 
                  className="min-h-[200px]"
                  defaultValue="Dear {{name}},

Welcome to GODIRECT Properties! We're excited to have you join our platform.

You can now:
- Browse exclusive property listings
- Save your favorite properties
- Get personalized property recommendations
- Connect with our professional agents

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The GODIRECT Team"
                />
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-2">Available Variables:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><code>&#123;&#123;name&#125;&#125;</code> - Recipient's name</div>
                  <div><code>&#123;&#123;email&#125;&#125;</code> - Recipient's email</div>
                  <div><code>&#123;&#123;property_name&#125;&#125;</code> - Property name</div>
                  <div><code>&#123;&#123;agent_name&#125;&#125;</code> - Agent name</div>
                  <div><code>&#123;&#123;date&#125;&#125;</code> - Current date</div>
                  <div><code>&#123;&#123;link&#125;&#125;</code> - Action link</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Preview</Button>
              <Button>Save Template</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Control system maintenance functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Maintenance Mode</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      When enabled, only administrators can access the platform. All other users will see a maintenance message.
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={maintenanceMode} 
                  onCheckedChange={handleMaintenanceToggle}
                  className="data-[state=checked]:bg-yellow-600"
                />
              </div>
              
              {maintenanceMode && (
                <div className="space-y-2">
                  <Label htmlFor="maintenance_message">Maintenance Message</Label>
                  <Textarea 
                    id="maintenance_message" 
                    placeholder="Enter the message users will see during maintenance..." 
                    className="min-h-[100px]"
                    defaultValue="Our platform is currently undergoing scheduled maintenance to improve your experience. We'll be back online shortly. Thank you for your patience."
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Label htmlFor="scheduled_end" className="flex-shrink-0">Scheduled End Time</Label>
                    <Input 
                      id="scheduled_end" 
                      type="datetime-local" 
                    />
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5" /> Database Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Database Backup</p>
                      <p className="text-sm text-muted-foreground">Last backup: 2 days ago</p>
                    </div>
                    <Button onClick={handleBackupNow}>Backup Now</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Backup Schedule</p>
                      <p className="text-sm text-muted-foreground">Automatic backups</p>
                    </div>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Database Optimization</p>
                      <p className="text-sm text-muted-foreground">Optimize database tables</p>
                    </div>
                    <Button variant="outline">Run Optimization</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" /> Cache Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Clear System Cache</p>
                      <p className="text-sm text-muted-foreground">Remove temporary system files</p>
                    </div>
                    <Button variant="outline">Clear Cache</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rebuild Search Index</p>
                      <p className="text-sm text-muted-foreground">Improve search performance</p>
                    </div>
                    <Button variant="outline">Rebuild Index</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" /> System Logs
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Error Logs</p>
                      <p className="text-sm text-muted-foreground">View system error logs</p>
                    </div>
                    <Button variant="outline">View Logs</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Activity Logs</p>
                      <p className="text-sm text-muted-foreground">View user activity logs</p>
                    </div>
                    <Button variant="outline">View Logs</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Log Retention</p>
                      <p className="text-sm text-muted-foreground">How long to keep logs</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="block mb-2">Color Theme</Label>
                <div className="flex flex-wrap gap-3">
                  {["light", "dark", "system"].map((option) => (
                    <Button
                      key={option}
                      variant={theme === option ? "default" : "outline"}
                      onClick={() => setTheme(option)}
                      className="flex items-center gap-2"
                    >
                      {option === "light" && <span className="h-4 w-4 rounded-full bg-background border" />}
                      {option === "dark" && <span className="h-4 w-4 rounded-full bg-slate-900" />}
                      {option === "system" && <span className="h-4 w-4 rounded-full bg-gradient-to-r from-background to-slate-900 border" />}
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Primary Color</Label>
                <div className="flex flex-wrap gap-3">
                  {["default", "red", "green", "blue", "purple", "orange"].map((color) => (
                    <div
                      key={color}
                      className={`h-10 w-10 rounded-full cursor-pointer border-2 ${
                        color === "default" ? "bg-primary border-primary" :
                        color === "red" ? "bg-red-500 border-red-500" :
                        color === "green" ? "bg-green-500 border-green-500" :
                        color === "blue" ? "bg-blue-500 border-blue-500" :
                        color === "purple" ? "bg-purple-500 border-purple-500" :
                        "bg-orange-500 border-orange-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">GD</span>
                    </div>
                    <Button variant="outline" size="sm">Change Logo</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">G</span>
                    </div>
                    <Button variant="outline" size="sm">Change Favicon</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom_css">Custom CSS</Label>
                <Textarea 
                  id="custom_css" 
                  placeholder="Add custom CSS styles..." 
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Appearance Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
