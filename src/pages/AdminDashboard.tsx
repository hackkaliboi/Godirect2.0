
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
import { useNavItems } from "@/hooks/useNavItems";

export default function AdminDashboard() {
  // Get section from URL parameters
  const queryParams = new URLSearchParams(window.location.search);
  const sectionParam = queryParams.get("section") || "analytics";

  // Define available sections
  const sections = {
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

  const currentSection = sectionParam in sections ? sectionParam : "analytics";

  return (
    <DashboardLayout
      userType="admin"
      children={sections[currentSection] || <NotFound />}
    />
  );
}
