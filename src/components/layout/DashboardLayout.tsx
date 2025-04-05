
import { ReactNode, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Home, User, Users, Building, Settings, LogOut, Menu, X } from "lucide-react";

type DashboardLayoutProps = {
  children: ReactNode;
  userType: "admin" | "agent" | "user";
};

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Define navigation items by user type
  const getNavItems = () => {
    const commonItems = [
      { title: "Dashboard", path: `/${userType}-dashboard`, icon: Home },
      { title: "Profile", path: `/${userType}-dashboard`, icon: User },
      { title: "Settings", path: `/${userType}-dashboard/settings`, icon: Settings },
    ];
    
    if (userType === "admin") {
      return [
        ...commonItems,
        { title: "Users", path: "/admin-dashboard/users", icon: Users },
        { title: "Agents", path: "/admin-dashboard/agents", icon: Users },
        { title: "Properties", path: "/admin-dashboard/properties", icon: Building },
        { title: "Sales", path: "/admin-dashboard/sales", icon: Building },
        { title: "Reports", path: "/admin-dashboard/reports", icon: Building },
        { title: "Notifications", path: "/admin-dashboard/notifications", icon: Building },
      ];
    }
    
    if (userType === "agent") {
      return [
        ...commonItems,
        { title: "My Listings", path: "/agent-dashboard/listings", icon: Building },
        { title: "Clients", path: "/agent-dashboard/clients", icon: Users },
        { title: "Leads", path: "/agent-dashboard/leads", icon: Users },
        { title: "Commissions", path: "/agent-dashboard/commissions", icon: Building },
        { title: "Performance", path: "/agent-dashboard/performance", icon: Building },
        { title: "Calendar", path: "/agent-dashboard/calendar", icon: Building },
      ];
    }
    
    // User type
    return [
      ...commonItems,
      { title: "Favorites", path: "/user-dashboard/favorites", icon: Building },
      { title: "Messages", path: "/user-dashboard/messages", icon: Users },
      { title: "Purchases", path: "/user-dashboard/purchases", icon: Building },
      { title: "Saved Searches", path: "/user-dashboard/saved-searches", icon: Building },
      { title: "Property Alerts", path: "/user-dashboard/property-alerts", icon: Building },
      { title: "Viewing History", path: "/user-dashboard/viewing-history", icon: Building },
    ];
  };
  
  const navItems = getNavItems();
  
  // Capitalize first letter of user type for display
  const userTypeDisplay = userType.charAt(0).toUpperCase() + userType.slice(1);
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {/* Mobile menu button - visible only on mobile */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-white dark:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu - overlay for small screens */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}
        
        {/* Sidebar - shown based on screen size and menu state */}
        <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 transition-transform duration-300 ease-in-out`}>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between p-2">
                <div className="font-bold text-lg">GODIRECT {userTypeDisplay}</div>
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
                          <Link to={item.path} onClick={() => setMobileMenuOpen(false)}>
                            <item.icon className="h-4 w-4" />
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
        </div>
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 max-w-full">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
