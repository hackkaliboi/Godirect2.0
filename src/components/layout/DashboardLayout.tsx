
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Home, User, Users, Building, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardLayoutProps = {
  children: ReactNode;
  userType: "admin" | "agent" | "user";
};

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const location = useLocation();
  
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
        { title: "Users", path: "/admin-dashboard/users", icon: Users },
        { title: "Agents", path: "/admin-dashboard/agents", icon: Users },
        { title: "Properties", path: "/admin-dashboard/properties", icon: Building },
      ];
    }
    
    if (userType === "agent") {
      return [
        ...commonItems,
        { title: "My Listings", path: "/agent-dashboard/listings", icon: Building },
        { title: "Clients", path: "/agent-dashboard/clients", icon: Users },
      ];
    }
    
    // User type
    return [
      ...commonItems,
      { title: "Favorites", path: "/user-dashboard/favorites", icon: Building },
      { title: "Messages", path: "/user-dashboard/messages", icon: Users },
    ];
  };
  
  const navItems = getNavItems();
  
  // Capitalize first letter of user type for display
  const userTypeDisplay = userType.charAt(0).toUpperCase() + userType.slice(1);
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <div className="font-bold text-lg">HomePulse {userTypeDisplay}</div>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.path}
                        tooltip={item.title}
                      >
                        <Link to={item.path}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <LogOut size={16} /> Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
