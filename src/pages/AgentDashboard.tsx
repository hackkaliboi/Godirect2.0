
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import AgentProfile from "@/components/dashboard/agent/AgentProfile";
import AgentListings from "@/components/dashboard/agent/AgentListings";
import AgentClients from "@/components/dashboard/agent/AgentClients";
import AgentSettings from "@/components/dashboard/agent/AgentSettings";
import AgentCommissions from "@/components/dashboard/agent/AgentCommissions";
import AgentLeads from "@/components/dashboard/agent/AgentLeads";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard,
  Home,
  Users,
  Settings,
  DollarSign,
  Target,
  Calendar,
  BarChart
} from "lucide-react";

const AgentDashboard = () => {
  const navItems = [
    {
      title: "Dashboard",
      href: "/agent-dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "My Listings",
      href: "/agent-dashboard/listings",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "My Clients",
      href: "/agent-dashboard/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Lead Management",
      href: "/agent-dashboard/leads",
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: "Commissions",
      href: "/agent-dashboard/commissions",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Performance",
      href: "/agent-dashboard/performance",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/agent-dashboard/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/agent-dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Agent Dashboard | HomePulse Realty</title>
      </Helmet>
      <DashboardLayout navItems={navItems} userRole="agent">
        <Routes>
          <Route path="/" element={<AgentProfile />} />
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
