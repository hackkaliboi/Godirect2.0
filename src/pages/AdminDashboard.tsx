
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
import LegalCompliance from "@/components/dashboard/legal/LegalCompliance";
import SupportCenter from "@/components/dashboard/admin/SupportCenter";
import SystemConfiguration from "@/components/dashboard/admin/SystemConfiguration";
import NotFound from "@/pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
    const refreshDashboardStats = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('calculate-dashboard-stats');
        
        if (error) {
          console.error("Error refreshing dashboard stats:", error);
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
        console.error("Failed to invoke edge function:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Refresh dashboard stats when overview or analytics section is loaded
    if (currentSection === "overview" || currentSection === "analytics") {
      refreshDashboardStats();
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
    legal: <LegalCompliance />,
    settings: <AdminSettings />,
    profile: <AdminProfile />,
    support: <SupportCenter />,
    system: <SystemConfiguration />,
  };

  return (
    <DashboardLayout
      userType="admin"
      children={sections[currentSection] || <NotFound />}
    />
  );
}
