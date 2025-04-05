
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
          <Route index element={<AgentProfile />} />
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
