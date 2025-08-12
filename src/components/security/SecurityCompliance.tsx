import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { securityApi, auditApi, complianceApi } from "@/lib/api";
import { AuditLog, ComplianceCheck, SecuritySetting } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Key,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Settings,
  Users,
  Activity,
  Download,
  Filter,
  Search,
  RefreshCw,
  Database,
  Globe,
  Smartphone,
  Mail,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, subMonths } from "date-fns";
import { toast } from "sonner";

interface AuditLogWithDetails extends AuditLog {
  user_name?: string;
  user_email?: string;
}

interface SecurityMetrics {
  totalUsers: number;
  activeUsers: number;
  failedLogins: number;
  securityAlerts: number;
  complianceScore: number;
  dataBreaches: number;
}

const SecurityCompliance = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLogWithDetails[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    failedLogins: 0,
    securityAlerts: 0,
    complianceScore: 0,
    dataBreaches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogWithDetails | null>(null);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);

  const complianceFrameworks = [
    { id: "gdpr", name: "GDPR", description: "General Data Protection Regulation" },
    { id: "ccpa", name: "CCPA", description: "California Consumer Privacy Act" },
    { id: "pipeda", name: "PIPEDA", description: "Personal Information Protection and Electronic Documents Act" },
    { id: "iso27001", name: "ISO 27001", description: "Information Security Management" },
    { id: "sox", name: "SOX", description: "Sarbanes-Oxley Act" },
  ];

  const securityLevels = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "critical", label: "Critical", color: "bg-red-500" },
  ];

  const auditActions = [
    "user_login",
    "user_logout", 
    "password_change",
    "profile_update",
    "property_create",
    "property_update",
    "property_delete",
    "payment_process",
    "data_export",
    "settings_change",
  ];

  useEffect(() => {
    fetchSecurityData();
  }, [user, dateRange]);

  const fetchSecurityData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = dateRange === "7d" ? subDays(endDate, 7) :
                       dateRange === "30d" ? subDays(endDate, 30) :
                       dateRange === "90d" ? subDays(endDate, 90) :
                       subMonths(endDate, 12);

      const [logs, checks, settings, metrics] = await Promise.all([
        auditApi.getAuditLogs(startDate, endDate),
        complianceApi.getComplianceChecks(),
        securityApi.getSecuritySettings(),
        securityApi.getSecurityMetrics(startDate, endDate),
      ]);

      setAuditLogs(logs);
      setComplianceChecks(checks);
      setSecuritySettings(settings);
      setSecurityMetrics(metrics);
    } catch (error) {
      console.error("Error fetching security data:", error);
      toast.error("Failed to fetch security data");
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySetting = async (settingId: string, value: any) => {
    try {
      await securityApi.updateSecuritySetting(settingId, value);
      await fetchSecurityData();
      toast.success("Security setting updated");
    } catch (error) {
      console.error("Error updating security setting:", error);
      toast.error("Failed to update security setting");
    }
  };

  const runComplianceCheck = async (framework: string) => {
    try {
      await complianceApi.runComplianceCheck(framework);
      await fetchSecurityData();
      toast.success("Compliance check initiated");
    } catch (error) {
      console.error("Error running compliance check:", error);
      toast.error("Failed to run compliance check");
    }
  };

  const exportAuditLogs = async () => {
    try {
      const exportData = await auditApi.exportAuditLogs(
        filter === "all" ? undefined : filter,
        searchTerm || undefined
      );
      
      // Create download link
      const link = document.createElement("a");
      link.href = exportData.download_url;
      link.download = `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
      
      toast.success("Audit logs exported successfully");
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      toast.error("Failed to export audit logs");
    }
  };

  const getSecurityLevelBadge = (level: string) => {
    const levelConfig = securityLevels.find(l => l.value === level);
    return (
      <Badge className={cn("text-white", levelConfig?.color)}>
        {levelConfig?.label || level}
      </Badge>
    );
  };

  const getComplianceScore = () => {
    if (complianceChecks.length === 0) return 0;
    const passed = complianceChecks.filter(c => c.status === "passed").length;
    return Math.round((passed / complianceChecks.length) * 100);
  };

  const getFilteredLogs = () => {
    let filtered = auditLogs;

    if (filter !== "all") {
      filtered = filtered.filter(log => log.action === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address?.includes(searchTerm)
      );
    }

    return filtered;
  };

  const getSecuritySetting = (key: string) => {
    return securitySettings.find(s => s.key === key);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading security dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-realty-900 dark:text-white">
            Security & Compliance
          </h1>
          <p className="text-realty-600 dark:text-realty-400">
            Monitor security, manage access controls, and ensure compliance
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setIsSettingsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-realty-900 dark:text-white">
                  {securityMetrics.totalUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-realty-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {securityMetrics.activeUsers}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Failed Logins
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {securityMetrics.failedLogins}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Security Alerts
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {securityMetrics.securityAlerts}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Compliance Score
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {getComplianceScore()}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-realty-600 dark:text-realty-400">
                  Data Breaches
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {securityMetrics.dataBreaches}
                </p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {securityMetrics.securityAlerts > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Alerts</AlertTitle>
          <AlertDescription>
            You have {securityMetrics.securityAlerts} active security alerts that require attention.
            Please review the audit logs and take appropriate action.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="privacy">Data Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          {/* Audit Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-realty-400" />
                  <Input
                    placeholder="Search audit logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {auditActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={exportAuditLogs} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs List */}
          <div className="space-y-3">
            {getFilteredLogs().length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 text-realty-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-realty-900 dark:text-white mb-2">
                    No audit logs found
                  </h3>
                  <p className="text-realty-600 dark:text-realty-400">
                    {searchTerm || filter !== "all" 
                      ? "Try adjusting your filters to see more logs"
                      : "No activity has been logged yet"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              getFilteredLogs().map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-realty-600" />
                          <span className="font-medium text-realty-900 dark:text-white">
                            {log.action.replace("_", " ").toUpperCase()}
                          </span>
                          {log.risk_level && getSecurityLevelBadge(log.risk_level)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-realty-600 dark:text-realty-400">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {log.user_email || "System"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {log.ip_address || "Unknown"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(log.created_at), "PPp")}
                          </div>
                        </div>

                        {log.details && (
                          <p className="text-sm text-realty-700 dark:text-realty-300 mt-2">
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAuditLog(log);
                          setIsAuditDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Overall Score</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {getComplianceScore()}%
                    </span>
                  </div>
                  <Progress value={getComplianceScore()} className="w-full" />
                  <p className="text-sm text-realty-600 dark:text-realty-400">
                    {complianceChecks.filter(c => c.status === "passed").length} of {complianceChecks.length} checks passed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {complianceFrameworks.map((framework) => (
                  <div key={framework.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{framework.name}</h4>
                      <p className="text-sm text-realty-600 dark:text-realty-400">
                        {framework.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => runComplianceCheck(framework.id)}
                    >
                      Run Check
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Compliance Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Compliance Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceChecks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-realty-400 mx-auto mb-4" />
                    <p className="text-realty-600 dark:text-realty-400">
                      No compliance checks have been run yet
                    </p>
                  </div>
                ) : (
                  complianceChecks.slice(0, 10).map((check) => (
                    <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {check.status === "passed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : check.status === "failed" ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <h4 className="font-medium">{check.framework}</h4>
                          <p className="text-sm text-realty-600 dark:text-realty-400">
                            {check.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={check.status === "passed" ? "default" : 
                                  check.status === "failed" ? "destructive" : "secondary"}
                        >
                          {check.status}
                        </Badge>
                        <p className="text-xs text-realty-500 mt-1">
                          {format(new Date(check.checked_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("require_2fa")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("require_2fa", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Complexity</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Enforce strong password requirements
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("strong_passwords")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("strong_passwords", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Automatic logout after inactivity
                    </p>
                  </div>
                  <Select
                    value={getSecuritySetting("session_timeout")?.value || "30"}
                    onValueChange={(value) => updateSecuritySetting("session_timeout", value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15min</SelectItem>
                      <SelectItem value="30">30min</SelectItem>
                      <SelectItem value="60">1hr</SelectItem>
                      <SelectItem value="120">2hr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Restrict access to approved IP addresses
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("ip_whitelist")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("ip_whitelist", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Device Tracking</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Track and approve new devices
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("device_tracking")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("device_tracking", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Brute Force Protection</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Lock accounts after failed attempts
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("brute_force_protection")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("brute_force_protection", checked.toString())
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Encryption</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Encrypt sensitive data at rest
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("data_encryption")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("data_encryption", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Backup</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Automated secure backups
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("auto_backup")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("auto_backup", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Retention</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Automatic data deletion policy
                    </p>
                  </div>
                  <Select
                    value={getSecuritySetting("data_retention")?.value || "365"}
                    onValueChange={(value) => updateSecuritySetting("data_retention", value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90d</SelectItem>
                      <SelectItem value="180">180d</SelectItem>
                      <SelectItem value="365">1yr</SelectItem>
                      <SelectItem value="1095">3yr</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeOff className="h-5 w-5" />
                  Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymize Logs</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Remove PII from audit logs
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("anonymize_logs")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("anonymize_logs", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cookie Consent</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Require user consent for cookies
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("cookie_consent")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("cookie_consent", checked.toString())
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Portability</Label>
                    <p className="text-sm text-realty-600 dark:text-realty-400">
                      Allow users to export their data
                    </p>
                  </div>
                  <Switch
                    checked={getSecuritySetting("data_portability")?.value === "true"}
                    onCheckedChange={(checked) => 
                      updateSecuritySetting("data_portability", checked.toString())
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Audit Log Details Dialog */}
      <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about the audit log entry
            </DialogDescription>
          </DialogHeader>

          {selectedAuditLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-realty-600">Action</Label>
                  <p className="font-medium">
                    {selectedAuditLog.action.replace("_", " ").toUpperCase()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-realty-600">Risk Level</Label>
                  <div className="mt-1">
                    {selectedAuditLog.risk_level && getSecurityLevelBadge(selectedAuditLog.risk_level)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-realty-600">User</Label>
                  <p>{selectedAuditLog.user_email || "System"}</p>
                </div>
                <div>
                  <Label className="text-sm text-realty-600">IP Address</Label>
                  <p>{selectedAuditLog.ip_address || "Unknown"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-realty-600">User Agent</Label>
                  <p className="text-sm text-realty-700 dark:text-realty-300">
                    {selectedAuditLog.user_agent || "Unknown"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-realty-600">Timestamp</Label>
                  <p>{format(new Date(selectedAuditLog.created_at), "PPpp")}</p>
                </div>
              </div>

              {selectedAuditLog.details && (
                <div>
                  <Label className="text-sm text-realty-600">Details</Label>
                  <pre className="text-sm bg-realty-50 dark:bg-realty-800 p-3 rounded-lg mt-2 overflow-x-auto">
                    {typeof selectedAuditLog.details === 'string' 
                      ? selectedAuditLog.details 
                      : JSON.stringify(selectedAuditLog.details, null, 2)
                    }
                  </pre>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAuditDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityCompliance;
