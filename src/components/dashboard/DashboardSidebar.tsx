import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Users,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  MapPin,
  Heart,
  Search,
  MessageSquare,
  Shield,
  UserCheck,
  Database,
  TrendingUp,
  Activity,
} from "lucide-react";

interface DashboardSidebarProps {
  userRole: "admin" | "agent" | "user";
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  const getMenuItems = () => {
    const commonItems = [
      { title: "Dashboard", url: `/dashboard/${userRole}`, icon: Home },
      { title: "Properties", url: `/dashboard/${userRole}/properties`, icon: Building2 },
    ];

    switch (userRole) {
      case "admin":
        return [
          ...commonItems,
          { title: "Analytics", url: `/dashboard/admin/analytics`, icon: BarChart3 },
          { title: "Users", url: `/dashboard/admin/users`, icon: Users },
          { title: "Agents", url: `/dashboard/admin/agents`, icon: UserCheck },
          { title: "Transactions", url: `/dashboard/admin/transactions`, icon: DollarSign },
          { title: "Reports", url: `/dashboard/admin/reports`, icon: FileText },
          { title: "System", url: `/dashboard/admin/system`, icon: Database },
          { title: "Settings", url: `/dashboard/admin/settings`, icon: Settings },
        ];

      case "agent":
        return [
          ...commonItems,
          { title: "My Listings", url: `/dashboard/agent/listings`, icon: Building2 },
          { title: "Clients", url: `/dashboard/agent/clients`, icon: Users },
          { title: "Leads", url: `/dashboard/agent/leads`, icon: Search },
          { title: "Calendar", url: `/dashboard/agent/calendar`, icon: Calendar },
          { title: "Messages", url: `/dashboard/agent/messages`, icon: MessageSquare },
          { title: "Commission", url: `/dashboard/agent/commission`, icon: DollarSign },
          { title: "Profile", url: `/dashboard/agent/profile`, icon: Settings },
        ];

      case "user":
        return [
          ...commonItems,
          { title: "Saved Properties", url: `/dashboard/user/saved`, icon: Heart },
          { title: "Search History", url: `/dashboard/user/history`, icon: Search },
          { title: "Appointments", url: `/dashboard/user/appointments`, icon: Calendar },
          { title: "Messages", url: `/dashboard/user/messages`, icon: MessageSquare },
          { title: "My Applications", url: `/dashboard/user/applications`, icon: FileText },
          { title: "Profile", url: `/dashboard/user/profile`, icon: Settings },
        ];

      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar 
      className="border-r bg-card" 
      collapsible="icon"
    >
      <SidebarContent className="bg-card">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg text-foreground">RealEstate</h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
            </div>
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 pb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                          ${active 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-foreground hover:bg-muted/60 hover:text-foreground"
                          }
                        `}
                      >
                        <IconComponent className="h-5 w-5 shrink-0" />
                        <span className="font-medium text-sm truncate">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}