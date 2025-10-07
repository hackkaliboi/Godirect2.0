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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  RefreshCw,
  Server,
  HardDrive,
  Zap,
  AlertTriangle
} from "lucide-react";

interface SystemSettings {
  platform_name: string;
  platform_url: string;
  platform_description: string;
  user_registration_enabled: boolean;
  agent_applications_enabled: boolean;
  property_auto_approval: boolean;
  smtp_host: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  email_welcome_enabled: boolean;
  email_property_notifications: boolean;
  security_2fa_required: boolean;
  email_verification_required: boolean;
  login_rate_limiting: boolean;
  api_key: string;
  notifications_new_users: boolean;
  notifications_property_submissions: boolean;
  notifications_system_alerts: boolean;
  theme: string;
  primary_color: string;
  font_size: string;
  compact_mode: boolean;
  animations_enabled: boolean;
  logo_url: string;
  favicon_url: string;
  brand_name: string;
}

export default function AdminSettings() {
  const { currentCurrency } = useCurrency();
  const [settings, setSettings] = useState<SystemSettings>({
    platform_name: "RealEstate Platform",
    platform_url: "https://yourdomain.com",
    platform_description: "Your comprehensive real estate solution",
    user_registration_enabled: true,
    agent_applications_enabled: true,
    property_auto_approval: false,
    smtp_host: "",
    smtp_port: "587",
    smtp_username: "",
    smtp_password: "",
    email_welcome_enabled: true,
    email_property_notifications: true,
    security_2fa_required: false,
    email_verification_required: true,
    login_rate_limiting: true,
    api_key: "",
    notifications_new_users: true,
    notifications_property_submissions: true,
    notifications_system_alerts: true,
    theme: "system",
    primary_color: "blue",
    font_size: "medium",
    compact_mode: false,
    animations_enabled: true,
    logo_url: "",
    favicon_url: "",
    brand_name: "RealEstate Platform"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Load settings from database
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      // Load all settings from the database
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');

      if (error) throw error;

      // Convert the data to a settings object
      const loadedSettings: any = { ...settings };
      if (data) {
        data.forEach(item => {
          // Convert JSONB values to appropriate types
          const key = item.key as keyof SystemSettings;
          if (key in settings) {
            // Handle JSONB values - they might be stored as strings or objects
            let parsedValue = item.value;

            // If it's a string that looks like JSON, parse it
            if (typeof item.value === 'string') {
              try {
                parsedValue = JSON.parse(item.value);
              } catch (e) {
                // If parsing fails, use the value as is
                parsedValue = item.value;
              }
            }

            if (typeof settings[key] === 'boolean') {
              loadedSettings[key] = parsedValue === 'true' || parsedValue === true;
            } else if (typeof settings[key] === 'number') {
              loadedSettings[key] = Number(parsedValue);
            } else {
              loadedSettings[key] = parsedValue;
            }
          }
        });
      }

      setSettings(loadedSettings as SystemSettings);

      // Removed theme application since appearance settings are now in the profile page
      // applyTheme(loadedSettings.theme);
      // applyPrimaryColor(loadedSettings.primary_color);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      // Save each setting individually
      const promises = Object.entries(settings).map(([key, value]) => {
        return supabase
          .from('system_settings')
          .insert({
            key,
            value: typeof value === 'boolean' ? value.toString() : value,
            description: `System setting for ${key}`,
            updated_at: new Date().toISOString()
          })
          .select();
      });

      await Promise.all(promises);

      // Removed theme application since appearance settings are now in the profile page
      // applyTheme(settings.theme);
      // applyPrimaryColor(settings.primary_color);

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <Button onClick={saveSettings} disabled={saving} size="sm" className="self-start sm:self-center">
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger value="general" className="text-xs sm:text-sm px-2 sm:px-4">General</TabsTrigger>
            <TabsTrigger value="currency" className="text-xs sm:text-sm px-2 sm:px-4">Currency</TabsTrigger>
            <TabsTrigger value="email" className="text-xs sm:text-sm px-2 sm:px-4">Email</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm px-2 sm:px-4">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm px-2 sm:px-4">Notifications</TabsTrigger>
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
                    <Input
                      id="platform-name"
                      value={settings.platform_name}
                      onChange={(e) => handleSettingChange('platform_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-url">Platform URL</Label>
                    <Input
                      id="platform-url"
                      value={settings.platform_url}
                      onChange={(e) => handleSettingChange('platform_url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Input
                    id="platform-description"
                    value={settings.platform_description}
                    onChange={(e) => handleSettingChange('platform_description', e.target.value)}
                  />
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
                      <Switch
                        checked={settings.user_registration_enabled}
                        onCheckedChange={(checked) => handleSettingChange('user_registration_enabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Agent Applications</Label>
                        <p className="text-sm text-muted-foreground">Accept agent applications</p>
                      </div>
                      <Switch
                        checked={settings.agent_applications_enabled}
                        onCheckedChange={(checked) => handleSettingChange('agent_applications_enabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Property Auto-Approval</Label>
                        <p className="text-sm text-muted-foreground">Automatically approve property listings</p>
                      </div>
                      <Switch
                        checked={settings.property_auto_approval}
                        onCheckedChange={(checked) => handleSettingChange('property_auto_approval', checked)}
                      />
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
                    <Input
                      id="smtp-host"
                      placeholder="smtp.yourdomain.com"
                      value={settings.smtp_host}
                      onChange={(e) => handleSettingChange('smtp_host', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      placeholder="587"
                      value={settings.smtp_port}
                      onChange={(e) => handleSettingChange('smtp_port', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input
                      id="smtp-username"
                      placeholder="noreply@yourdomain.com"
                      value={settings.smtp_username}
                      onChange={(e) => handleSettingChange('smtp_username', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      placeholder="••••••••"
                      value={settings.smtp_password}
                      onChange={(e) => handleSettingChange('smtp_password', e.target.value)}
                    />
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
                      <Switch
                        checked={settings.email_welcome_enabled}
                        onCheckedChange={(checked) => handleSettingChange('email_welcome_enabled', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Property Notifications</Label>
                        <p className="text-sm text-muted-foreground">Email updates about saved properties</p>
                      </div>
                      <Switch
                        checked={settings.email_property_notifications}
                        onCheckedChange={(checked) => handleSettingChange('email_property_notifications', checked)}
                      />
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
                    <Switch
                      checked={settings.security_2fa_required}
                      onCheckedChange={(checked) => handleSettingChange('security_2fa_required', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Verification</Label>
                      <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                    </div>
                    <Switch
                      checked={settings.email_verification_required}
                      onCheckedChange={(checked) => handleSettingChange('email_verification_required', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">Limit failed login attempts</p>
                    </div>
                    <Switch
                      checked={settings.login_rate_limiting}
                      onCheckedChange={(checked) => handleSettingChange('login_rate_limiting', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        value={settings.api_key}
                        onChange={(e) => handleSettingChange('api_key', e.target.value)}
                        readOnly
                      />
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

          <TabsContent value="notifications" className="space-y-6">
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
                      <Switch
                        checked={settings.notifications_new_users}
                        onCheckedChange={(checked) => handleSettingChange('notifications_new_users', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Property Submissions</Label>
                        <p className="text-sm text-muted-foreground">Notify about new property listings</p>
                      </div>
                      <Switch
                        checked={settings.notifications_property_submissions}
                        onCheckedChange={(checked) => handleSettingChange('notifications_property_submissions', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Critical system notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications_system_alerts}
                        onCheckedChange={(checked) => handleSettingChange('notifications_system_alerts', checked)}
                      />
                    </div>
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