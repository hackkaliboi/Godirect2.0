
import { ReactNode, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Add a check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
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
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        {/* Mobile menu button - always visible on mobile */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleMenu}
            className="bg-white dark:bg-gray-800 shadow-md"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu - fullscreen overlay for small screens */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background flex flex-col px-4 pt-16 pb-6">
            <div className="overflow-y-auto flex-1">
              <div className="py-6">
                <div className="font-bold text-xl mb-6">GODIRECT {userTypeDisplay}</div>
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link 
                        to={item.path} 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-md ${
                          location.pathname === item.path || 
                          (item.title === "Dashboard" && location.pathname === `/${userType}-dashboard`) ? 
                          "bg-primary/10 text-primary font-medium" : 
                          "text-foreground/70 hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t pt-4">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <LogOut size={16} /> Logout
              </Button>
              <div className="mt-4 text-xs text-center text-muted-foreground">
                GODIRECT - Enugu & Calabar, Nigeria
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop sidebar */}
        <div className={`${isMobile ? 'hidden' : 'block'} md:block`}>
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
                          isActive={location.pathname === item.path || 
                                   (item.title === "Dashboard" && location.pathname === `/${userType}-dashboard`)}
                          tooltip={item.title}
                        >
                          <Link to={item.path}>
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
                <div className="mt-3 text-xs text-center text-muted-foreground">
                  GODIRECT - Enugu & Calabar, Nigeria
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>
        
        {/* Main content area */}
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
