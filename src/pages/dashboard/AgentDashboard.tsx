import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Building, Users, DollarSign, Calendar } from "lucide-react";

// Import agent dashboard pages
import AgentListings from "../agent/AgentListings";
import AgentClients from "../agent/AgentClients";
import AgentMessages from "../agent/AgentMessages";
import AgentCalendar from "../agent/AgentCalendar";
import AgentProfile from "../agent/AgentProfile";
import AgentLeads from "../agent/AgentLeads";
import AgentCommission from "../agent/AgentCommission";
import AgentProperties from "../agent/AgentProperties";
import CreateListing from "../agent/CreateListing";

import { useDashboardStats } from "@/hooks/useDashboardStats";

function AgentDashboardHome() {
  const { stats, loading, error } = useDashboardStats();
  const recentActivities: {
    id: string;
    type: "property" | "user" | "transaction" | "message";
    title: string;
    description: string;
    timestamp: Date;
    status?: "pending" | "completed" | "cancelled";
  }[] = [];

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
        <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Listings"
          value={getStat('agent_active_listings').value}
          description={getStat('agent_active_listings').description}
          icon={Building}
          loading={loading}
        />
        <StatCard
          title="Active Clients"
          value={getStat('agent_active_clients').value}
          description={getStat('agent_active_clients').description}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="This Month's Commission"
          value={getStat('agent_monthly_commission').value}
          description={getStat('agent_monthly_commission').description}
          icon={DollarSign}
          loading={loading}
        />
        <StatCard
          title="Scheduled Appointments"
          value={getStat('agent_scheduled_appointments').value}
          description={getStat('agent_scheduled_appointments').description}
          icon={Calendar}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Listings</h3>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Your recent property listings will appear here
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-3">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}

export function AgentDashboard() {
  return (
    <DashboardLayout userRole="agent">
      <Routes>
        <Route index element={<AgentDashboardHome />} />
        <Route path="properties" element={<AgentProperties />} />
        <Route path="listings" element={<AgentListings />} />
        <Route path="listings/create" element={<CreateListing />} />
        <Route path="create-listing" element={<CreateListing />} />
        <Route path="clients" element={<AgentClients />} />
        <Route path="leads" element={<AgentLeads />} />
        <Route path="calendar" element={<AgentCalendar />} />
        <Route path="messages" element={<AgentMessages />} />
        <Route path="commission" element={<AgentCommission />} />
        <Route path="profile" element={<AgentProfile />} />
      </Routes>
    </DashboardLayout>
  );
}