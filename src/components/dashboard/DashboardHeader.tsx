import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  userRole: "admin" | "agent" | "user";
}

export function DashboardHeader({ userRole }: DashboardHeaderProps) {
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
    <header className="h-16 bg-card border-b border-dashboard-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger />
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties, clients, or transactions..."
            className="pl-10 w-64 md:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="icon" className="relative hidden sm:flex">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            0
          </span>
        </Button>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Welcome Back</p>
            <p className="text-xs text-muted-foreground">{getRoleDisplay()}</p>
          </div>
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {userRole.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
            <LogOut className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}