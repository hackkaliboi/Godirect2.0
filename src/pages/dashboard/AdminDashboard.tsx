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
import AdminSettings from "../admin/AdminSettings";
import AdminTransactions from "../admin/AdminTransactions";
import AdminReports from "../admin/AdminReports";
import AdminSystem from "../admin/AdminSystem";

function AdminDashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,234"
          description="+20.1% from last month"
          icon={Users}
        />
        <StatCard
          title="Total Properties"
          value="567"
          description="+15.3% from last month"
          icon={Building}
        />
        <StatCard
          title="Active Agents"
          value="89"
          description="+5.2% from last month"
          icon={UserCheck}
        />
        <StatCard
          title="Revenue"
          value="$45,231"
          description="+12.5% from last month"
          icon={DollarSign}
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
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </DashboardLayout>
  );
}