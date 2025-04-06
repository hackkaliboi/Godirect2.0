
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Settings,
  Wrench,
  Database,
  Server,
  Globe,
  Shield,
  Save,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw
} from "lucide-react";

// Sample email templates
const emailTemplates = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to GODIRECT",
    description: "Sent to new users after sign up",
    lastEdited: "2023-03-15"
  },
  {
    id: "password-reset",
    name: "Password Reset",
    subject: "Reset Your GODIRECT Password",
    description: "Sent when user requests password reset",
    lastEdited: "2023-02-20"
  },
  {
    id: "property-alert",
    name: "Property Alert",
    subject: "New Properties Matching Your Criteria",
    description: "Sent when new properties match user's saved searches",
    lastEdited: "2023-04-01"
  },
  {
    id: "listing-approved",
    name: "Listing Approved",
    subject: "Your Property Listing Has Been Approved",
    description: "Sent to agents when their listing is approved",
    lastEdited: "2023-03-25"
  },
  {
    id: "inquiry-notification",
    name: "Inquiry Notification",
    subject: "New Inquiry for Your Property",
    description: "Sent to agents when someone inquires about their property",
    lastEdited: "2023-03-28"
  }
];

// Sample platform settings
const platformSettings = {
  general: [
    { id: "site-name", name: "Site Name", value: "GODIRECT", type: "text" },
    { id: "contact-email", name: "Contact Email", value: "support@godirect.com", type: "email" },
    { id: "currency", name: "Default Currency", value: "NGN", type: "select", options: ["NGN", "USD", "EUR", "GBP"] },
    { id: "timezone", name: "Default Timezone", value: "Africa/Lagos", type: "select", options: ["Africa/Lagos", "Africa/Accra", "Europe/London", "America/New_York"] }
  ],
  features: [
    { id: "enable-reviews", name: "Enable Reviews", value: true, type: "boolean" },
    { id: "enable-blog", name: "Enable Blog", value: true, type: "boolean" },
    { id: "enable-chat", name: "Enable Live Chat", value: false, type: "boolean" },
    { id: "enable-analytics", name: "Enable Analytics", value: true, type: "boolean" }
  ],
  security: [
    { id: "two-factor", name: "Two-Factor Authentication", value: true, type: "boolean" },
    { id: "password-expiry", name: "Password Expiry (days)", value: 90, type: "number" },
    { id: "session-timeout", name: "Session Timeout (minutes)", value: 30, type: "number" },
    { id: "login-attempts", name: "Max Login Attempts", value: 5, type: "number" }
  ]
};

// Sample maintenance tasks
const maintenanceTasks = [
  {
    id: "database-backup",
    name: "Database Backup",
    status: "success",
    lastRun: "2023-04-05 03:00 AM",
    nextRun: "2023-04-06 03:00 AM",
    frequency: "Daily"
  },
  {
    id: "cache-clear",
    name: "Clear Cache",
    status: "success",
    lastRun: "2023-04-05 04:30 AM",
    nextRun: "2023-04-06 04:30 AM",
    frequency: "Daily"
  },
  {
    id: "log-rotation",
    name: "Log Rotation",
    status: "success",
    lastRun: "2023-04-01 01:15 AM",
    nextRun: "2023-05-01 01:15 AM",
    frequency: "Monthly"
  },
  {
    id: "temp-file-cleanup",
    name: "Temporary File Cleanup",
    status: "pending",
    lastRun: "2023-03-30 02:45 AM",
    nextRun: "2023-04-06 02:45 AM",
    frequency: "Weekly"
  },
  {
    id: "search-reindex",
    name: "Search Index Rebuild",
    status: "failed",
    lastRun: "2023-04-02 05:30 AM",
    nextRun: "2023-04-09 05:30 AM",
    frequency: "Weekly",
    error: "Timeout during indexing process"
  }
];

interface SystemConfigurationProps {
  initialTab?: "email" | "platform" | "maintenance";
}

export default function SystemConfiguration({ initialTab = "email" }: SystemConfigurationProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0]);
  const [templateContent, setTemplateContent] = useState("<h1>Welcome to GODIRECT!</h1><p>We're excited to have you on board...</p>");
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">
          Configure and maintain the platform settings and functionality
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="platform">
            <Settings className="mr-2 h-4 w-4" />
            Platform Settings
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Email Templates</CardTitle>
                  <Button size="sm" className="h-8">+ New Template</Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search templates..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  {emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border-b cursor-pointer hover:bg-muted transition-colors ${selectedTemplate.id === template.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="font-medium truncate">{template.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{template.subject}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Last edited: {template.lastEdited}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={selectedTemplate.subject} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Email Content</Label>
                  <div className="border rounded-md">
                    <div className="bg-muted px-3 py-2 border-b flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <span className="font-bold">B</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <span className="italic">I</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <span className="underline">U</span>
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Globe className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      id="template" 
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      className="min-h-[300px] border-0 rounded-none focus-visible:ring-0 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button variant="outline">Preview</Button>
                  <div className="space-x-2">
                    <Button variant="outline">Test Send</Button>
                    <Button>Save Template</Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="platform" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure general settings for the GODIRECT platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Settings</h3>
                {platformSettings.general.map((setting) => (
                  <div key={setting.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    <Label htmlFor={setting.id}>{setting.name}</Label>
                    {setting.type === 'select' ? (
                      <Select defaultValue={setting.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {setting.options?.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id={setting.id} type={setting.type} defaultValue={setting.value} />
                    )}
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Feature Settings</h3>
                {platformSettings.features.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <Label htmlFor={setting.id}>{setting.name}</Label>
                    <Switch id={setting.id} checked={setting.value} />
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                {platformSettings.security.map((setting) => (
                  <div key={setting.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    <Label htmlFor={setting.id}>{setting.name}</Label>
                    {setting.type === 'boolean' ? (
                      <Switch id={setting.id} checked={setting.value} />
                    ) : (
                      <Input id={setting.id} type={setting.type} defaultValue={setting.value} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save All Settings
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Scheduled tasks and system maintenance operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Scheduled Tasks</h3>
                  <Button>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run All Tasks
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Task</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Run</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Next Run</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Frequency</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {maintenanceTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />}
                              {task.status === 'pending' && <Clock className="h-4 w-4 text-blue-500 mr-2" />}
                              {task.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
                              <div className="text-sm font-medium">{task.name}</div>
                            </div>
                            {task.error && (
                              <div className="text-xs text-red-500 mt-1">Error: {task.error}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(task.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.lastRun}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.nextRun}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.frequency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">Manual Maintenance Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Database Operations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Optimize Database</span>
                        <Button size="sm">Run</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Repair Database</span>
                        <Button size="sm" variant="outline">Run</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Cache Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Clear All Caches</span>
                        <Button size="sm">Run</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Rebuild Search Index</span>
                        <Button size="sm" variant="outline">Run</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
