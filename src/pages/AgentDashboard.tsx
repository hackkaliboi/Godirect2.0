
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AgentProfile from "@/components/dashboard/agent/AgentProfile";
import AgentListings from "@/components/dashboard/agent/AgentListings";
import AgentClients from "@/components/dashboard/agent/AgentClients";
import AgentSettings from "@/components/dashboard/agent/AgentSettings";
import AgentCommissions from "@/components/dashboard/agent/AgentCommissions";
import AgentLeads from "@/components/dashboard/agent/AgentLeads";
import { Helmet } from "react-helmet-async";

const AgentDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Agent Dashboard | GODIRECT</title>
      </Helmet>
      <DashboardLayout userType="agent">
        <Routes>
          <Route index element={
            <div className="p-6 space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your listings, clients, and performance
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">My Listings</h3>
                  <p className="text-muted-foreground mb-4">Your active property listings</p>
                  <div className="text-3xl font-bold">14</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Clients</h3>
                  <p className="text-muted-foreground mb-4">Your active client relationships</p>
                  <div className="text-3xl font-bold">26</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Leads</h3>
                  <p className="text-muted-foreground mb-4">New potential clients</p>
                  <div className="text-3xl font-bold">9</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Commissions</h3>
                  <p className="text-muted-foreground mb-4">Your earnings this month</p>
                  <div className="text-3xl font-bold">$12,850</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Performance</h3>
                  <p className="text-muted-foreground mb-4">Your sales performance</p>
                  <div className="text-3xl font-bold">94%</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Upcoming</h3>
                  <p className="text-muted-foreground mb-4">Calendar events this week</p>
                  <div className="text-3xl font-bold">7</div>
                </div>
              </div>
            </div>
          } />
          <Route path="/profile" element={<AgentProfile />} />
          <Route path="/listings" element={<AgentListings />} />
          <Route path="/clients" element={<AgentClients />} />
          <Route path="/settings" element={<AgentSettings />} />
          <Route path="/leads" element={<AgentLeads />} />
          <Route path="/commissions" element={<AgentCommissions />} />
          <Route path="/performance" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Performance Analytics</h2>
              <p>View your sales performance, targets, and comparison to other agents.</p>
            </div>
          } />
          <Route path="/calendar" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
              <p>Manage your appointments, viewings, and other scheduled events.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/agent-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default AgentDashboard;
