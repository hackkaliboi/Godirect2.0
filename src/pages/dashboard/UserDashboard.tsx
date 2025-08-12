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

function UserDashboardHome() {
  // Recent activities will be fetched from Supabase
  const recentActivities: {
    id: string;
    type: "property" | "user" | "transaction" | "message";
    title: string;
    description: string;
    timestamp: Date;
    status?: "pending" | "completed" | "cancelled";
  }[] = [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Dashboard</h1>
      </div>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Saved Properties"
          value="12"
          description="Properties in your watchlist"
          icon={Heart}
        />
        <StatCard
          title="Property Views"
          value="45"
          description="Properties you've viewed"
          icon={Eye}
        />
        <StatCard
          title="Inquiries Sent"
          value="8"
          description="Messages to agents"
          icon={MessageSquare}
        />
        <StatCard
          title="Scheduled Tours"
          value="3"
          description="Upcoming property tours"
          icon={Calendar}
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
      </Routes>
    </DashboardLayout>
  );
}