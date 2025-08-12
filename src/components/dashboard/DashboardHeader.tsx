import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { AuthContext } from "@/types/auth";

interface DashboardHeaderProps {
  userRole: "admin" | "agent" | "user";
}

export function DashboardHeader({ userRole }: DashboardHeaderProps) {
  const { signOut } = useContext(AuthContext);
  
  const getRoleDisplay = () => {
    switch (userRole) {
      case "admin":
        return "Administrator";
      case "agent":
        return "Real Estate Agent";
      case "user":
        return "Property Seeker";
      default:
        return "User";
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-card border-b border-dashboard-border flex items-center justify-between px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <SidebarTrigger />
        <div className="relative hidden md:block flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties, clients, or transactions..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Button variant="outline" size="icon" className="relative hidden sm:flex h-8 w-8 sm:h-9 sm:w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
            0
          </span>
        </Button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium">Welcome Back</p>
            <p className="text-xs text-muted-foreground">{getRoleDisplay()}</p>
          </div>
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
              {userRole.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
            onClick={() => {
              if (signOut) signOut();
            }}
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}