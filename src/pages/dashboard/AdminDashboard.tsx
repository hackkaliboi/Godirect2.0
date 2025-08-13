import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { SystemAlerts } from "@/components/admin/SystemAlerts";
import { Building, Users, UserCheck, DollarSign } from "lucide-react";

// Import admin dashboard pages
import AdminAnalytics from "../admin/AdminAnalytics";
import AdminUsers from "../admin/AdminUsers";
import AdminAgents from "../admin/AdminAgents";
import AdminProperties from "../admin/AdminProperties";
import AdminCreateListing from "../admin/AdminCreateListing";
import AdminSettings from "../admin/AdminSettings";
import AdminTransactions from "../admin/AdminTransactions";
import AdminReports from "../admin/AdminReports";
import AdminSystem from "../admin/AdminSystem";

// Import new feature components
import SecurityCompliance from "@/components/security/SecurityCompliance";
import PaymentManager from "@/components/payments/PaymentManager";
import NotificationCenter from "@/components/notifications/NotificationCenter";

import { useDashboardStats } from "@/hooks/useDashboardStats";

function AdminDashboardHome() {
  const { stats, loading, error } = useDashboardStats();

  const getStat = (name: string) => {
    const stat = stats.find(s => s.stat_name === name);
    return {
      value: stat?.stat_value || '0',
      description: stat?.compare_text || 'No change from last month'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={getStat('total_users').value}
          description={getStat('total_users').description}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Total Properties"
          value={getStat('total_properties').value}
          description={getStat('total_properties').description}
          icon={Building}
          loading={loading}
        />
        <StatCard
          title="Active Agents"
          value={getStat('active_agents').value}
          description={getStat('active_agents').description}
          icon={UserCheck}
          loading={loading}
        />
        <StatCard
          title="Revenue"
          value={getStat('total_revenue').value}
          description={getStat('total_revenue').description}
          icon={DollarSign}
          loading={loading}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <AnalyticsCharts />
        </div>
        <div className="col-span-3">
          <RecentActivity activities={[]} />
        </div>
      </div>
      
      <SystemAlerts />
    </div>
  );
}

export function AdminDashboard() {
  return (
    <DashboardLayout userRole="admin">
      <Routes>
        <Route index element={<AdminDashboardHome />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="agents" element={<AdminAgents />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="properties/create" element={<AdminCreateListing />} />
        <Route path="create-listing" element={<AdminCreateListing />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="settings" element={<AdminSettings />} />
        
        {/* New Feature Routes */}
        <Route path="security" element={<SecurityCompliance />} />
        <Route path="payments" element={<PaymentManager />} />
        <Route path="notifications" element={<NotificationCenter />} />
      </Routes>
    </DashboardLayout>
  );
}