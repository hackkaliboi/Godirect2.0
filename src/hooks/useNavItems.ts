
import { useMemo } from "react";
import { 
  Home, 
  User, 
  Users, 
  Building, 
  Settings, 
  BarChart3,
  DollarSign,
  MessageSquare,
  Heart,
  ShoppingBag,
  SearchCheck,
  Bell,
  History,
  Calendar,
  Activity,
  FileText,
  PieChart,
  Scale,
  Gem,
  LifeBuoy,
  Wrench,
  Mail,
  BellRing,
  Receipt,
  Wallet,
  CreditCard,
  Landmark,
  BuildingBank
} from "lucide-react";

type NavItemWithPath = {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
};

type NavItemWithSubItems = {
  title: string;
  icon: React.ComponentType<any>;
  subItems: { title: string; path: string }[];
};

export type NavItem = NavItemWithPath | NavItemWithSubItems;

export const useNavItems = (userType: "admin" | "agent" | "user"): NavItem[] => {
  const navItems = useMemo(() => {
    const commonItems: NavItem[] = [
      { title: "Dashboard", path: `/${userType}-dashboard`, icon: Home },
      { title: "Profile", path: `/${userType}-dashboard/profile`, icon: User },
      { title: "Settings", path: `/${userType}-dashboard/settings`, icon: Settings },
    ];
    
    if (userType === "admin") {
      return [
        ...commonItems,
        { title: "Analytics", path: "/admin-dashboard/analytics", icon: PieChart },
        { 
          title: "Financial Management", 
          icon: DollarSign, 
          subItems: [
            { title: "Financial Overview", path: "/admin-dashboard/financial" },
            { title: "Sales Reports", path: "/admin-dashboard/sales" },
            { title: "Payment Processing", path: "/admin-dashboard/payments" },
          ]
        },
        { title: "Legal & Compliance", path: "/admin-dashboard/legal", icon: Scale },
        { 
          title: "User Management", 
          icon: Users, 
          subItems: [
            { title: "Users", path: "/admin-dashboard/users" },
            { title: "Agents", path: "/admin-dashboard/agents" },
          ]
        },
        { 
          title: "Properties", 
          path: "/admin-dashboard/properties", 
          icon: Building 
        },
        { 
          title: "Reports", 
          path: "/admin-dashboard/reports", 
          icon: FileText 
        },
        { 
          title: "Notifications", 
          path: "/admin-dashboard/notifications", 
          icon: BellRing 
        },
        {
          title: "System Config",
          icon: Wrench,
          subItems: [
            { title: "Email Templates", path: "/admin-dashboard/email-templates" },
            { title: "Platform Settings", path: "/admin-dashboard/platform-settings" },
            { title: "Maintenance", path: "/admin-dashboard/maintenance" },
          ]
        },
        {
          title: "Support Center",
          icon: LifeBuoy,
          subItems: [
            { title: "Support Tickets", path: "/admin-dashboard/support-tickets" },
            { title: "Knowledge Base", path: "/admin-dashboard/knowledge-base" },
            { title: "Team Chat", path: "/admin-dashboard/team-chat" },
          ]
        },
      ];
    }
    
    if (userType === "agent") {
      return [
        ...commonItems,
        { title: "My Listings", path: "/agent-dashboard/listings", icon: Building },
        { 
          title: "Client Management", 
          icon: Users,
          subItems: [
            { title: "Clients", path: "/agent-dashboard/clients" },
            { title: "Leads", path: "/agent-dashboard/leads" },
          ]
        },
        { title: "Commissions", path: "/agent-dashboard/commissions", icon: DollarSign },
        { title: "Performance", path: "/agent-dashboard/performance", icon: BarChart3 },
        { title: "Calendar", path: "/agent-dashboard/calendar", icon: Calendar },
        { title: "Verifications", path: "/agent-dashboard/verifications", icon: SearchCheck }, // Add the verifications route
      ];
    }
    
    return [
      ...commonItems,
      { title: "Favorites", path: "/user-dashboard/favorites", icon: Heart },
      { title: "Messages", path: "/user-dashboard/messages", icon: MessageSquare },
      { 
        title: "Properties", 
        path: "/user-dashboard/properties", // Direct path to properties
        icon: Building,
      },
      {
        title: "Property Tools",
        icon: SearchCheck,
        subItems: [
          { title: "Saved Searches", path: "/user-dashboard/saved-searches" },
          { title: "Property Alerts", path: "/user-dashboard/property-alerts" },
          { title: "Viewing History", path: "/user-dashboard/viewing-history" },
        ]
      },
      { title: "Purchases", path: "/user-dashboard/purchases", icon: ShoppingBag },
    ];
  }, [userType]);

  return navItems;
};
