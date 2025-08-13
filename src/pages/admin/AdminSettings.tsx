import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencySelector, PriceDisplay } from "@/components/ui/currency-selector";
import { useCurrency } from "@/contexts/CurrencyContext";
import CurrencyManagementComponent from "@/components/admin/CurrencyManagementComponent";
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database, 
  Bell,
  Palette,
  Key,
  Save,
  Sun,
  Moon,
  Monitor,
  Check,
  DollarSign,
  TrendingUp,
  RefreshCw
} from "lucide-react";

export default function AdminSettings() {
  const [theme, setTheme] = useState("system");
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Color options for primary theme
  const colorOptions = [
    { value: "blue", label: "Blue", color: "hsl(221, 83%, 53%)" },
    { value: "green", label: "Green", color: "hsl(142, 76%, 36%)" },
    { value: "purple", label: "Purple", color: "hsl(262, 83%, 58%)" },
    { value: "orange", label: "Orange", color: "hsl(25, 95%, 53%)" },
    { value: "red", label: "Red", color: "hsl(0, 84%, 60%)" },
    { value: "pink", label: "Pink", color: "hsl(336, 75%, 60%)" },
  ];

  const applyTheme = (selectedTheme: string) => {
    const root = document.documentElement;
    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const applyPrimaryColor = (color: string) => {
    const root = document.documentElement;
    const colorMap = {
      blue: "214 88% 27%",
      green: "142 76% 36%", 
      purple: "262 83% 58%",
      orange: "25 95% 53%",
      red: "0 84% 60%",
      pink: "336 75% 60%"
    };
    
    const selectedColor = colorMap[color as keyof typeof colorMap];
    if (selectedColor) {
      root.style.setProperty("--primary", selectedColor);
      root.style.setProperty("--ring", selectedColor);
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyPrimaryColor(primaryColor);
  }, [primaryColor]);

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              System Settings
            </h1>
            <p className="text-muted-foreground">
              Configure platform settings and preferences
            </p>
          </div>
          <Button size="sm" className="self-start sm:self-center">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="general" className="text-xs sm:text-sm px-2 sm:px-4">General</TabsTrigger>
            <TabsTrigger value="currency" className="text-xs sm:text-sm px-2 sm:px-4">Currency</TabsTrigger>
            <TabsTrigger value="email" className="text-xs sm:text-sm px-2 sm:px-4">Email</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm px-2 sm:px-4">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm px-2 sm:px-4">Notifications</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm px-2 sm:px-4">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="RealEstate Platform" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-url">Platform URL</Label>
                    <Input id="platform-url" defaultValue="https://yourdomain.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Input id="platform-description" defaultValue="Your comprehensive real estate solution" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Feature Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>User Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to register</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Agent Applications</Label>
                        <p className="text-sm text-muted-foreground">Accept agent applications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Property Auto-Approval</Label>
                        <p className="text-sm text-muted-foreground">Automatically approve property listings</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="currency" className="space-y-6">
            <CurrencyManagementComponent />
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" placeholder="smtp.yourdomain.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" placeholder="587" />
                  </div>
                </div>
                
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" placeholder="noreply@yourdomain.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Templates</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Welcome Email</Label>
                        <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Property Notifications</Label>
                        <p className="text-sm text-muted-foreground">Email updates about saved properties</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Verification</Label>
                      <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">Limit failed login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input id="api-key" defaultValue="••••••••••••••••••••" readOnly />
                      <Button variant="outline">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Used for integrations and external services
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Admin Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New User Registrations</Label>
                        <p className="text-sm text-muted-foreground">Notify when new users register</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Property Submissions</Label>
                        <p className="text-sm text-muted-foreground">Notify about new property listings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Critical system notifications</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Color Theme</Label>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       <Button
                         variant={theme === "light" ? "default" : "outline"}
                         className="flex flex-col items-center gap-2 h-auto p-3 sm:p-4 bg-card border-border"
                         onClick={() => setTheme("light")}
                       >
                         <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                         <span className="text-xs sm:text-sm">Light</span>
                         {theme === "light" && <Check className="h-3 w-3 sm:h-4 sm:w-4" />}
                       </Button>
                       <Button
                         variant={theme === "dark" ? "default" : "outline"}
                         className="flex flex-col items-center gap-2 h-auto p-3 sm:p-4 bg-card border-border"
                         onClick={() => setTheme("dark")}
                       >
                         <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                         <span className="text-xs sm:text-sm">Dark</span>
                         {theme === "dark" && <Check className="h-3 w-3 sm:h-4 sm:w-4" />}
                       </Button>
                       <Button
                         variant={theme === "system" ? "default" : "outline"}
                         className="flex flex-col items-center gap-2 h-auto p-3 sm:p-4 bg-card border-border"
                         onClick={() => setTheme("system")}
                       >
                         <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
                         <span className="text-xs sm:text-sm">System</span>
                         {theme === "system" && <Check className="h-3 w-3 sm:h-4 sm:w-4" />}
                       </Button>
                     </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                       {colorOptions.map((color) => (
                         <Button
                           key={color.value}
                           variant={primaryColor === color.value ? "default" : "outline"}
                           className="flex items-center gap-2 h-auto p-2 sm:p-3 bg-card border-border"
                           onClick={() => setPrimaryColor(color.value)}
                         >
                           <div 
                             className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-border flex-shrink-0"
                             style={{ backgroundColor: color.color }}
                           />
                           <span className="text-xs sm:text-sm flex-1 text-left">{color.label}</span>
                           {primaryColor === color.value && <Check className="h-3 w-3 sm:h-4 sm:w-4 ml-auto flex-shrink-0" />}
                         </Button>
                       ))}
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Display Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <Input id="logo-url" placeholder="https://yourdomain.com/logo.png" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon-url">Favicon URL</Label>
                    <Input id="favicon-url" placeholder="https://yourdomain.com/favicon.ico" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-name">Brand Name</Label>
                    <Input id="brand-name" defaultValue="RealEstate Platform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
  );
}