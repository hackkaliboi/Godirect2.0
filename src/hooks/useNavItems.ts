
import { useMemo } from "react";
import { 
  Home, 
  User, 
  Users, 
  Building, 
  Settings, 
  BarChart3,
  DollarSign,
  BellRing,
  MessageSquare,
  Heart,
  ShoppingBag,
  SearchCheck,
  Bell,
  History,
  Calendar
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
          title: "Analytics", 
          icon: BarChart3,
          subItems: [
            { title: "Sales", path: "/admin-dashboard/sales" },
            { title: "Reports", path: "/admin-dashboard/reports" },
          ]
        },
        { 
          title: "Notifications", 
          path: "/admin-dashboard/notifications", 
          icon: BellRing 
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
      ];
    }
    
    // User type
    return [
      ...commonItems,
      { title: "Favorites", path: "/user-dashboard/favorites", icon: Heart },
      { title: "Messages", path: "/user-dashboard/messages", icon: MessageSquare },
      { 
        title: "Properties", 
        icon: Building,
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
