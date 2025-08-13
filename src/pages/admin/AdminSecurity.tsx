import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SecurityCompliance } from "@/components/security/SecurityCompliance";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Activity,
  Clock,
  Users,
  Globe,
  Key,
  Ban,
  UserX,
  AlertCircle
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

interface SecurityAlert {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'data_breach' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  resolved: boolean;
}

export default function AdminSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  // Mock data for demonstration
  const auditLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:15',
      action: 'User Login',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Successful admin login'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:42',
      action: 'Failed Login',
      user: 'unknown@suspicious.com',
      ip: '203.0.113.45',
      status: 'error',
      details: 'Multiple failed login attempts detected'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:18',
      action: 'Property Update',
      user: 'agent@example.com',
      ip: '192.168.1.105',
      status: 'success',
      details: 'Property listing updated - ID: 12345'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:33',
      action: 'User Registration',
      user: 'newuser@example.com',
      ip: '192.168.1.110',
      status: 'success',
      details: 'New user account created'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:27',
      action: 'Data Export',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      status: 'warning',
      details: 'Large data export initiated'
    }
  ];

  const securityAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: 'failed_login',
      severity: 'high',
      timestamp: '2024-01-15 14:25:42',
      description: 'Multiple failed login attempts from IP: 203.0.113.45',
      resolved: false
    },
    {
      id: '2',
      type: 'suspicious_activity',
      severity: 'medium',
      timestamp: '2024-01-15 12:15:20',
      description: 'Unusual access pattern detected for user: agent@example.com',
      resolved: true
    },
    {
      id: '3',
      type: 'policy_violation',
      severity: 'low',
      timestamp: '2024-01-15 10:30:15',
      description: 'Password policy violation attempt',
      resolved: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'failed_login':
        return <UserX className="h-4 w-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4" />;
      case 'data_breach':
        return <Shield className="h-4 w-4" />;
      case 'policy_violation':
        return <Ban className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Security Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage platform security settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4">Overview</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm px-2 sm:px-4">Settings</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs sm:text-sm px-2 sm:px-4">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs sm:text-sm px-2 sm:px-4">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Status Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                    <p className="text-2xl font-bold text-green-600">98%</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">All systems secure</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                    <p className="text-2xl font-bold text-red-600">3</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">2FA Coverage</p>
                    <p className="text-2xl font-bold text-blue-600">87%</p>
                  </div>
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Users enabled</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.resolved ? (
                        <Badge variant="success">Resolved</Badge>
                      ) : (
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Authentication Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <Switch 
                      checked={twoFactorEnabled} 
                      onCheckedChange={setTwoFactorEnabled} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict admin access to specific IPs
                      </p>
                    </div>
                    <Switch 
                      checked={ipWhitelistEnabled} 
                      onCheckedChange={setIpWhitelistEnabled} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Max Login Attempts</Label>
                    <Input
                      id="max-attempts"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(e.target.value)}
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Timestamp</th>
                        <th className="text-left p-2">Action</th>
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">IP Address</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-mono text-xs">{log.timestamp}</td>
                          <td className="p-2">{log.action}</td>
                          <td className="p-2">{log.user}</td>
                          <td className="p-2 font-mono">{log.ip}</td>
                          <td className="p-2">
                            <Badge variant={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-muted-foreground">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <SecurityCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
