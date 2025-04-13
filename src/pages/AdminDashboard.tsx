
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminAgents } from "@/components/dashboard/admin/AdminAgents";
import { AdminProperties } from "@/components/dashboard/admin/AdminProperties";
import { AdminSales } from "@/components/dashboard/admin/AdminSales";
import { AdminUsers } from "@/components/dashboard/admin/AdminUsers";
import { AdminSettings } from "@/components/dashboard/admin/AdminSettings";
import { AdminProfile } from "@/components/dashboard/admin/AdminProfile";
import { AnalyticsPanel } from "@/components/dashboard/analytics/AnalyticsPanel";
import { FinancialManagement } from "@/components/dashboard/financial/FinancialManagement";
import { PaymentProcessing } from "@/components/dashboard/admin/PaymentProcessing";
import { PaymentConfiguration } from "@/components/dashboard/admin/PaymentConfiguration";
import { LegalCompliance } from "@/components/dashboard/legal/LegalCompliance";
import { SupportCenter } from "@/components/dashboard/admin/SupportCenter";
import { SystemConfiguration } from "@/components/dashboard/admin/SystemConfiguration";
import { NotFound } from "@/pages/NotFound";

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

  // Navigation items for the dashboard
  const navItems = [
    {
      title: "Dashboard",
      links: [
        { title: "Analytics", href: "/admin?section=analytics", icon: "BarChart2" },
      ],
    },
    {
      title: "Management",
      links: [
        { title: "Properties", href: "/admin?section=properties", icon: "Home" },
        { title: "Users", href: "/admin?section=users", icon: "Users" },
        { title: "Agents", href: "/admin?section=agents", icon: "UserCheck" },
        { title: "Sales", href: "/admin?section=sales", icon: "TrendingUp" },
      ],
    },
    {
      title: "Finance",
      links: [
        { title: "Financial Management", href: "/admin?section=financial", icon: "DollarSign" },
        { title: "Payment Processing", href: "/admin?section=payments", icon: "CreditCard" },
        { title: "Payment Configuration", href: "/admin?section=payment-config", icon: "Settings" },
        { title: "Legal & Compliance", href: "/admin?section=legal", icon: "Shield" },
      ],
    },
    {
      title: "Settings",
      links: [
        { title: "Site Settings", href: "/admin?section=settings", icon: "Settings" },
        { title: "Profile", href: "/admin?section=profile", icon: "User" },
        { title: "Support Center", href: "/admin?section=support", icon: "HelpCircle" },
        { title: "System Config", href: "/admin?section=system", icon: "Server" },
      ],
    },
  ];

  const currentSection = sectionParam in sections ? sectionParam : "analytics";

  return (
    <DashboardLayout
      navItems={navItems}
      userType="admin"
      dashboardType="admin"
    >
      {sections[currentSection] || <NotFound />}
    </DashboardLayout>
  );
}
