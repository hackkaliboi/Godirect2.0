
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProfile from "@/components/dashboard/admin/AdminProfile";
import AdminProperties from "@/components/dashboard/admin/AdminProperties";
import AdminAgents from "@/components/dashboard/admin/AdminAgents";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";
import AdminSales from "@/components/dashboard/admin/AdminSales";
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | GODIRECT</title>
      </Helmet>
      <DashboardLayout userType="admin">
        <Routes>
          <Route index element={
            <div className="p-6 space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to the GODIRECT administration panel
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Properties</h3>
                  <p className="text-muted-foreground mb-4">Manage all property listings</p>
                  <div className="text-3xl font-bold">124</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Agents</h3>
                  <p className="text-muted-foreground mb-4">Manage real estate agents</p>
                  <div className="text-3xl font-bold">38</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Users</h3>
                  <p className="text-muted-foreground mb-4">Manage registered users</p>
                  <div className="text-3xl font-bold">1,652</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Sales</h3>
                  <p className="text-muted-foreground mb-4">Track property sales</p>
                  <div className="text-3xl font-bold">$2.4M</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Reports</h3>
                  <p className="text-muted-foreground mb-4">Generate detailed reports</p>
                  <div className="text-3xl font-bold">12</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Notifications</h3>
                  <p className="text-muted-foreground mb-4">System alerts and messages</p>
                  <div className="text-3xl font-bold">24</div>
                </div>
              </div>
            </div>
          } />
          <Route path="/profile" element={<AdminProfile />} />
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
