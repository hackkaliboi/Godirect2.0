
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProfile from "@/components/dashboard/admin/AdminProfile";
import AdminProperties from "@/components/dashboard/admin/AdminProperties";
import AdminAgents from "@/components/dashboard/admin/AdminAgents";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";
import AdminSales from "@/components/dashboard/admin/AdminSales";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard,
  Home,
  Users,
  UserCheck,
  Settings,
  BarChart,
  FileText,
  Bell
} from "lucide-react";

const AdminDashboard = () => {
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin-dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Properties",
      href: "/admin-dashboard/properties",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Agents",
      href: "/admin-dashboard/agents",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin-dashboard/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Sales Analytics",
      href: "/admin-dashboard/sales",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/admin-dashboard/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin-dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin-dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | HomePulse Realty</title>
      </Helmet>
      <DashboardLayout navItems={navItems} userRole="admin">
        <Routes>
          <Route path="/" element={<AdminProfile />} />
          <Route path="/properties" element={<AdminProperties />} />
          <Route path="/agents" element={<AdminAgents />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/sales" element={<AdminSales />} />
          <Route path="/reports" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Reports</h2>
              <p>Generate and view detailed reports about property sales, user activity, and more.</p>
            </div>
          } />
          <Route path="/notifications" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
              <p>Manage system notifications and alerts for users and agents.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
