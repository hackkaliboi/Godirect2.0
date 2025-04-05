
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup,
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider, 
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  Users, 
  Building, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  BarChart3,
  DollarSign,
  FileText,
  BellRing,
  MessageSquare,
  Heart,
  ShoppingBag,
  SearchCheck,
  Bell,
  History,
  Calendar
} from "lucide-react";
import DashboardTopBar from "./DashboardTopBar";
import { ScrollArea } from "@/components/ui/scroll-area";

type DashboardLayoutProps = {
  children: ReactNode;
  userType: "admin" | "agent" | "user";
};

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Define navigation items by user type
  const getNavItems = () => {
    const commonItems = [
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
  };
  
  const navItems = getNavItems();
  
  const handleLogout = () => {
    // In a real app, you would clear auth state here
    navigate("/");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-muted/10">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b pb-2">
            <div className="flex items-center justify-between px-4">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">GD</span>
                </div>
                <span>GODIRECT</span>
              </Link>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item, index) => (
                      <SidebarMenuItem key={index}>
                        {!item.subItems ? (
                          <SidebarMenuButton 
                            asChild
                            isActive={location.pathname === item.path || 
                                    (item.title === "Dashboard" && location.pathname === `/${userType}-dashboard`)}
                            tooltip={item.title}
                          >
                            <Link to={item.path}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        ) : (
                          <>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                            <SidebarMenuSub>
                              {item.subItems.map((subItem, subIndex) => (
                                <SidebarMenuSubItem key={subIndex}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={location.pathname === subItem.path}
                                  >
                                    <Link to={subItem.path}>{subItem.title}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </ScrollArea>
          </SidebarContent>
          
          <SidebarFooter className="border-t">
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </Button>
              <div className="mt-3 text-xs text-center text-muted-foreground">
                GODIRECT - Enugu & Calabar, Nigeria
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardTopBar userType={userType} />
          
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 max-w-full">
              <div className="bg-background rounded-lg shadow-sm">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
