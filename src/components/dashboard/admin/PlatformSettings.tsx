import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ArrowLeft, Save, Globe, Palette, Users, Shield, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function PlatformSettings() {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your platform settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Platform Settings"
        subtitle="Configure system-wide platform settings"
        actionLabel="Back to System Config"
        actionIcon={<ArrowLeft className="h-4 w-4" />}
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="GoDirect Real Estate" />
                  <p className="text-xs text-muted-foreground">This name will appear throughout the platform</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" defaultValue="support@godirect.com" type="email" />
                  <p className="text-xs text-muted-foreground">Primary contact email for the platform</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="ngn">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngn">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="usd">US Dollar ($)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="gbp">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Primary currency for transactions</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="africa_lagos">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa_lagos">Africa/Lagos (GMT+1)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (GMT+0/+1)</SelectItem>
                      <SelectItem value="america_new_york">America/New York (GMT-5/-4)</SelectItem>
                      <SelectItem value="asia_dubai">Asia/Dubai (GMT+4)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Default timezone for the platform</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Default language for the platform</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="dd_mm_yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Format for displaying dates</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" defaultValue="+234 123 456 7890" />
                <p className="text-xs text-muted-foreground">Primary contact phone for the platform</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Set your company details for legal documents and invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="GoDirect Nigeria Ltd." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-reg">Registration Number</Label>
                  <Input id="company-reg" defaultValue="RC123456" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-address">Company Address</Label>
                <Input id="company-address" defaultValue="123 Victoria Island, Lagos, Nigeria" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID</Label>
                  <Input id="tax-id" defaultValue="VAT12345678" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input id="company-email" defaultValue="info@godirect.com" type="email" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme Mode</Label>
                <RadioGroup defaultValue="light" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System Default</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input id="primary-color" defaultValue="#0f172a" />
                    <div className="w-10 h-10 rounded-md bg-[#0f172a]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input id="accent-color" defaultValue="#3b82f6" />
                    <div className="w-10 h-10 rounded-md bg-[#3b82f6]" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label>Logo & Branding</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload">Logo</Label>
                    <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center mb-2">
                        <img src="/logo.png" alt="Logo" className="max-w-full max-h-full p-2" />
                      </div>
                      <Button variant="outline" size="sm">Upload New Logo</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favicon-upload">Favicon</Label>
                    <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center mb-2">
                        <img src="/favicon.ico" alt="Favicon" className="max-w-full max-h-full" />
                      </div>
                      <Button variant="outline" size="sm">Upload New Favicon</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="enable-custom-css" className="text-sm">Enable</Label>
                    <Switch id="enable-custom-css" />
                  </div>
                </div>
                <textarea 
                  id="custom-css" 
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="/* Add your custom CSS here */"
                />
                <p className="text-xs text-muted-foreground">Advanced: Add custom CSS to override platform styles</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>
                Configure how content is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Property Map on Listings</Label>
                    <p className="text-xs text-muted-foreground">Display map with property location</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Agent Information</Label>
                    <p className="text-xs text-muted-foreground">Display agent details on property listings</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Dark Mode Toggle</Label>
                    <p className="text-xs text-muted-foreground">Allow users to switch between light and dark mode</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="properties-per-page">Properties Per Page</Label>
                <Select defaultValue="12">
                  <SelectTrigger id="properties-per-page">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Number of properties to display per page</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow users to register accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Agent Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow agents to register accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Property Listings</Label>
                    <p className="text-sm text-muted-foreground">Allow agents to create property listings</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Online Payments</Label>
                    <p className="text-sm text-muted-foreground">Enable online payment processing</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Property Reviews</Label>
                    <p className="text-sm text-muted-foreground">Allow users to leave reviews on properties</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Agent Reviews</Label>
                    <p className="text-sm text-muted-foreground">Allow users to leave reviews for agents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Messaging System</Label>
                    <p className="text-sm text-muted-foreground">Enable in-app messaging between users and agents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
              <CardDescription>
                Configure property-related features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Virtual Tours</Label>
                    <p className="text-sm text-muted-foreground">Enable virtual tour support for properties</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Floor Plans</Label>
                    <p className="text-sm text-muted-foreground">Enable floor plan uploads for properties</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Property Videos</Label>
                    <p className="text-sm text-muted-foreground">Enable video uploads for properties</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Property Comparisons</Label>
                    <p className="text-sm text-muted-foreground">Allow users to compare multiple properties</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure platform security options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Agent Identity Verification</Label>
                    <p className="text-sm text-muted-foreground">Require identity verification for agent accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">CAPTCHA Protection</Label>
                    <p className="text-sm text-muted-foreground">Enable CAPTCHA on forms to prevent spam</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select defaultValue="strong">
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="medium">Medium (8+ chars, letters & numbers)</SelectItem>
                    <SelectItem value="strong">Strong (8+ chars, mixed case, numbers & symbols)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Password requirements for user accounts</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" defaultValue="60" type="number" min="5" max="1440" />
                <p className="text-xs text-muted-foreground">Time before inactive users are logged out</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Configure data privacy options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Cookie Consent</Label>
                    <p className="text-sm text-muted-foreground">Show cookie consent banner to users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">Enable analytics tracking on the platform</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Data Retention</Label>
                    <p className="text-sm text-muted-foreground">Automatically delete inactive user data</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention-period">Data Retention Period (days)</Label>
                <Input id="data-retention-period" defaultValue="365" type="number" min="30" />
                <p className="text-xs text-muted-foreground">Days to retain user data after account deletion</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send important notifications via SMS</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notification Events</Label>
                <div className="space-y-3 border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-new-user" className="cursor-pointer">New User Registration</Label>
                    <Switch id="notify-new-user" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-new-property" className="cursor-pointer">New Property Listing</Label>
                    <Switch id="notify-new-property" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-property-sold" className="cursor-pointer">Property Sold/Rented</Label>
                    <Switch id="notify-property-sold" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-new-inquiry" className="cursor-pointer">New Property Inquiry</Label>
                    <Switch id="notify-new-inquiry" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-payment" className="cursor-pointer">Payment Received</Label>
                    <Switch id="notify-payment" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-system" className="cursor-pointer">System Updates</Label>
                    <Switch id="notify-system" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input id="notification-email" defaultValue="notifications@godirect.com" type="email" />
                <p className="text-xs text-muted-foreground">Email address for sending system notifications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
