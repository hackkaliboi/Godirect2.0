import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, LogOut, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  userRole: "admin" | "agent" | "user";
}

export function DashboardHeader({ userRole }: DashboardHeaderProps) {
  const { signOut } = useContext(AuthContext);
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{ avatar_url?: string; full_name?: string }>({});

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile data:', error);
        }

        if (data) {
          console.log('Profile data fetched:', data);
          setProfileData(data);
        }
      }
    };

    fetchProfileData();
  }, [user?.id]);

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

  const getUserInitials = () => {
    if (profileData.full_name) {
      return profileData.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return userRole.charAt(0).toUpperCase();
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
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Site
            </Link>
          </Button>
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium">Welcome Back</p>
            <p className="text-xs text-muted-foreground">{getRoleDisplay()}</p>
          </div>
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
            <AvatarImage src={profileData.avatar_url} onError={() => console.log('Avatar image failed to load:', profileData.avatar_url)} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
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