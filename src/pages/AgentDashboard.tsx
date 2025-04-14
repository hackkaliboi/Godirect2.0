
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AgentListings from "@/components/dashboard/agent/AgentListings";
import AgentClients from "@/components/dashboard/agent/AgentClients";
import AgentCommissions from "@/components/dashboard/agent/AgentCommissions";
import AgentProfile from "@/components/dashboard/agent/AgentProfile";
import AgentVerifications from "@/components/dashboard/agent/AgentVerifications";
import AgentSettings from "@/components/dashboard/agent/AgentSettings";
import AgentLeads from "@/components/dashboard/agent/AgentLeads";
import NotFound from "@/pages/NotFound";

const AgentDashboardOverview = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Agent Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome to your agent dashboard. Manage your listings, clients, and more.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Active Listings" 
          value="12" 
          subtitle="2 pending approval" 
        />
        <DashboardCard 
          title="Total Clients" 
          value="24" 
          subtitle="5 new this month" 
        />
        <DashboardCard 
          title="Total Commissions" 
          value="₦1.2M" 
          subtitle="₦340K this month" 
        />
        <DashboardCard 
          title="Conversion Rate" 
          value="68%" 
          subtitle="Up 5% from last month" 
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Recent Inquiries</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your recent property inquiries will appear here.</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your upcoming property viewings and client meetings will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, subtitle }: { title: string, value: string, subtitle: string }) => (
  <div className="bg-card rounded-lg border p-5">
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
  </div>
);

const AgentDashboard = () => {
  return (
    <DashboardLayout userType="agent">
      <Routes>
        <Route index element={<AgentDashboardOverview />} />
        <Route path="listings" element={<AgentListings />} />
        <Route path="clients" element={<AgentClients />} />
        <Route path="leads" element={<AgentLeads />} />
        <Route path="commissions" element={<AgentCommissions />} />
        <Route path="verifications" element={<AgentVerifications />} />
        <Route path="profile" element={<AgentProfile />} />
        <Route path="settings" element={<AgentSettings />} />
        <Route path="performance" element={<div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Performance Analytics</h1>
            <p className="text-muted-foreground">Track your performance metrics and targets.</p>
          </div>
        } />
        <Route path="calendar" element={<div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Calendar</h1>
            <p className="text-muted-foreground">View and manage your appointments and schedule.</p>
          </div>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AgentDashboard;
