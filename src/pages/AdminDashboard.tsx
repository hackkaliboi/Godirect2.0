
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboardOverview from "@/components/dashboard/admin/AdminDashboardOverview";
import AdminAgents from "@/components/dashboard/admin/AdminAgents";
import AdminProperties from "@/components/dashboard/admin/AdminProperties";
import AdminSales from "@/components/dashboard/admin/AdminSales";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";
import AdminSettings from "@/components/dashboard/admin/AdminSettings";
import AdminProfile from "@/components/dashboard/admin/AdminProfile";
import AnalyticsPanel from "@/components/dashboard/analytics/AnalyticsPanel";
import { FinancialManagement } from "@/components/dashboard/financial/FinancialManagement";
import PaymentProcessing from "@/components/dashboard/admin/PaymentProcessing";
import { PaymentConfiguration } from "@/components/dashboard/admin/PaymentConfiguration";
import PaymentMethodSetup from "@/components/dashboard/admin/PaymentMethodSetup";
import LegalCompliance from "@/components/dashboard/legal/LegalCompliance";
import SupportCenter from "@/components/dashboard/admin/SupportCenter";
import SystemConfiguration from "@/components/dashboard/admin/SystemConfiguration";
import NotFound from "@/pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { refreshDashboardStats } from "@/utils/dashboardUtils";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Extract section from path instead of query parameters
  const pathSegments = location.pathname.split('/');
  let currentSection = pathSegments[pathSegments.length - 1];
  
  // If we're at the root of admin-dashboard, set default section
  if (currentSection === "admin-dashboard") {
    currentSection = "overview";
  }

  useEffect(() => {
    const refreshData = async () => {
      setIsLoading(true);
      try {
        const result = await refreshDashboardStats();
        
        if (!result.success) {
          console.error("Error refreshing dashboard stats:", result.message);
          toast({
            title: "Error refreshing data",
            description: "Failed to fetch the latest dashboard statistics",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Dashboard refreshed",
            description: "Latest statistics have been loaded",
          });
        }
      } catch (err) {
        console.error("Failed to refresh dashboard stats:", err);
        toast({
          title: "Error refreshing data", 
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Refresh dashboard stats when overview or analytics section is loaded
    if (currentSection === "overview" || currentSection === "analytics" || currentSection === "financial") {
      refreshData();
    }
  }, [currentSection, toast]);

  // Define available sections
  const sections = {
    overview: <AdminDashboardOverview />,
    analytics: <AnalyticsPanel />,
    properties: <AdminProperties />,
    users: <AdminUsers />,
    agents: <AdminAgents />,
    sales: <AdminSales />,
    financial: <FinancialManagement />,
    payments: <PaymentProcessing />,
    "payment-config": <PaymentConfiguration />,
    "payment-methods": <PaymentMethodSetup />,
    legal: <LegalCompliance />,
    settings: <AdminSettings />,
    profile: <AdminProfile />,
    support: <SupportCenter />,
    system: <SystemConfiguration />,
    // Add placeholders for previously missing routes
    "email-templates": <div className="p-6"><h1 className="text-3xl font-bold mb-4">Email Templates</h1><p>Email template management interface will be available soon.</p></div>,
    "platform-settings": <div className="p-6"><h1 className="text-3xl font-bold mb-4">Platform Settings</h1><p>Platform configuration settings will be available soon.</p></div>,
    "maintenance": <div className="p-6"><h1 className="text-3xl font-bold mb-4">System Maintenance</h1><p>System maintenance tools will be available soon.</p></div>,
    "support-tickets": <div className="p-6"><h1 className="text-3xl font-bold mb-4">Support Tickets</h1><p>Support ticket management will be available soon.</p></div>,
    "knowledge-base": <div className="p-6"><h1 className="text-3xl font-bold mb-4">Knowledge Base</h1><p>Knowledge base articles will be available soon.</p></div>,
    "team-chat": <div className="p-6"><h1 className="text-3xl font-bold mb-4">Team Chat</h1><p>Team chat interface will be available soon.</p></div>,
    "reports": <div className="p-6"><h1 className="text-3xl font-bold mb-4">Reports</h1><p>Reporting dashboard will be available soon.</p></div>,
    "notifications": <div className="p-6"><h1 className="text-3xl font-bold mb-4">Notifications</h1><p>Notification settings and history will be available soon.</p></div>,
  };

  return (
    <DashboardLayout
      userType="admin"
      children={sections[currentSection as keyof typeof sections] || <NotFound />}
    />
  );
}
