import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Heart, Eye, MessageSquare, Calendar } from "lucide-react";

// Import user dashboard pages
import UserProperties from "../user/UserProperties";
import UserMessages from "../user/UserMessages";
import UserAppointments from "../user/UserAppointments";
import UserSaved from "../user/UserSaved";
import UserHistory from "../user/UserHistory";
import UserApplications from "../user/UserApplications";
import UserProfile from "../user/UserProfile";

// Import new feature components
import NotificationCenter from "@/components/notifications/NotificationCenter";
import SavedSearches from "@/components/searches/SavedSearches";
import PaymentManager from "@/components/payments/PaymentManager";

import { useDashboardStats } from "@/hooks/useDashboardStats";

function UserDashboardHome() {
  const { stats, loading, error } = useDashboardStats();
  // Recent activities will be fetched from Supabase
  const recentActivities: {
    id: string;
    type: "property" | "user" | "transaction" | "message";
    title: string;
    description: string;
    timestamp: Date;
    status?: "pending" | "completed" | "cancelled";
  }[] = [];

  const getStat = (name: string) => {
    const stat = stats?.find(s => s.stat_name === name);
    return {
      value: stat?.stat_value || '0',
      description: stat?.compare_text || 'No change from last month'
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Dashboard</h1>
      </div>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Saved Properties"
          value={getStat('user_saved_properties').value}
          description={getStat('user_saved_properties').description}
          icon={Heart}
          loading={loading}
        />
        <StatCard
          title="Property Views"
          value={getStat('user_property_views').value}
          description={getStat('user_property_views').description}
          icon={Eye}
          loading={loading}
        />
        <StatCard
          title="Inquiries Sent"
          value={getStat('user_inquiries_sent').value}
          description={getStat('user_inquiries_sent').description}
          icon={MessageSquare}
          loading={loading}
        />
        <StatCard
          title="Scheduled Tours"
          value={getStat('user_scheduled_tours').value}
          description={getStat('user_scheduled_tours').description}
          icon={Calendar}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Saved Properties</h3>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Your saved properties will appear here
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}

export function UserDashboard() {
  return (
    <DashboardLayout userRole="user">
      <Routes>
        <Route index element={<UserDashboardHome />} />
        <Route path="properties" element={<UserProperties />} />
        <Route path="messages" element={<UserMessages />} />
        <Route path="appointments" element={<UserAppointments />} />
        <Route path="saved" element={<UserSaved />} />
        <Route path="history" element={<UserHistory />} />
        <Route path="applications" element={<UserApplications />} />
        <Route path="profile" element={<UserProfile />} />
        
        {/* New Feature Routes */}
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="searches" element={<SavedSearches />} />
        <Route path="payments" element={<PaymentManager />} />
      </Routes>
    </DashboardLayout>
  );
}