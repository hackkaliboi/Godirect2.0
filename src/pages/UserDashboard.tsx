
import { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building, 
  Users, 
  Settings, 
  Menu, 
  LogOut, 
  Heart, 
  Bell,
  MessageSquare,
  PlusSquare,
  Search
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatsCardGrid, StatsCard } from "@/components/dashboard/StatsCard";
import UserProperties from "@/components/dashboard/user/UserProperties";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserInquiries from "@/components/dashboard/user/UserInquiries";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserPropertyDetails from "@/components/dashboard/user/UserPropertyDetails";
import UserNewProperty from "@/components/dashboard/user/UserNewProperty";
import UserEditProperty from "@/components/dashboard/user/UserEditProperty";
import UserInquiryDetails from "@/components/dashboard/user/UserInquiryDetails";
import UserNotFound from "@/components/dashboard/user/UserNotFound";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the main dashboard overview page
  const isRootPath = location.pathname === "/user-dashboard" || location.pathname === "/user-dashboard/";
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm h-16 fixed w-full z-20">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold ml-2 text-realty-800 dark:text-white">
                HomePulse<span className="text-primary">.</span>
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center w-1/3">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-8 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">2</Badge>
            </Button>
            
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex pt-16 h-screen">
        {/* Sidebar */}
        <aside 
          className={`fixed md:relative bg-white dark:bg-gray-800 h-[calc(100vh-4rem)] shadow-sm z-10 transition-all duration-300 ${
            isSidebarOpen ? "w-64 left-0" : "w-64 -left-64 md:left-0"
          }`}
        >
          <div className="h-full flex flex-col justify-between p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground mb-2 px-2">DASHBOARD</p>
              <Link to="/user-dashboard">
                <Button 
                  variant={isRootPath ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Overview
                </Button>
              </Link>
              <Link to="/user-dashboard/properties">
                <Button 
                  variant={location.pathname.includes('/properties') && !location.pathname.includes('/favorites') ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Building className="h-4 w-4 mr-2" />
                  My Properties
                </Button>
              </Link>
              <Link to="/user-dashboard/favorites">
                <Button 
                  variant={location.pathname.includes('/favorites') ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              </Link>
              <Link to="/user-dashboard/inquiries">
                <Button 
                  variant={location.pathname.includes('/inquiries') ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Inquiries
                </Button>
              </Link>
              <Link to="/user-dashboard/profile">
                <Button 
                  variant={location.pathname.includes('/profile') ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
              </Link>
              <Link to="/user-dashboard/settings">
                <Button 
                  variant={location.pathname.includes('/settings') ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
            
            <div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className={`flex-1 p-0 overflow-auto transition-all duration-300 bg-gray-50 dark:bg-gray-900 ${
            isSidebarOpen ? "md:ml-0" : "md:ml-0"
          }`}
        >
          <Routes>
            <Route index element={<UserDashboardOverview />} />
            <Route path="properties" element={<UserProperties />} />
            <Route path="properties/:id" element={<UserPropertyDetails />} />
            <Route path="properties/new" element={<UserNewProperty />} />
            <Route path="properties/edit/:id" element={<UserEditProperty />} />
            <Route path="favorites" element={<UserFavorites />} />
            <Route path="inquiries" element={<UserInquiries />} />
            <Route path="inquiries/:id" element={<UserInquiryDetails />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="*" element={<UserNotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const UserDashboardOverview = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, John Doe</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your properties today
        </p>
      </div>
      
      <StatsCardGrid>
        <StatsCard
          title="Property Views"
          value="2,874"
          change={12}
          icon={<Building className="h-4 w-4" />}
          trend="positive"
        />
        <StatsCard
          title="New Inquiries"
          value="24"
          change={-5}
          icon={<MessageSquare className="h-4 w-4" />}
          trend="negative"
        />
        <StatsCard
          title="Active Listings"
          value="8"
          change={0}
          icon={<Building className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="Saved Properties"
          value="16"
          change={4}
          icon={<Heart className="h-4 w-4" />}
          trend="positive"
        />
      </StatsCardGrid>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link 
          to="/user-dashboard/properties/new"
          className="group"
        >
          <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 bg-white dark:bg-gray-800 hover:border-primary transition-colors">
            <PlusSquare className="h-10 w-10 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <h3 className="font-medium text-lg">Add New Property</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              List a new property for sale or rent
            </p>
          </div>
        </Link>

        <Link 
          to="/user-dashboard/properties"
          className="group"
        >
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 h-48 hover:border-primary transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-lg">Recent Listings</h3>
              <Badge variant="outline">8 Total</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">Modern Downtown Apartment</p>
                <Badge>Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">Luxury Waterfront Condo</p>
                <Badge>Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">Suburban Family Home</p>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </div>
        </Link>
        
        <Link 
          to="/user-dashboard/inquiries"
          className="group"
        >
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 h-48 hover:border-primary transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-lg">Recent Inquiries</h3>
              <Badge variant="outline">24 Total</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm">Modern Downtown Apartment</p>
                <Badge>New</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">Luxury Waterfront Condo</p>
                <Badge>New</Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">Suburban Family Home</p>
                <Badge variant="secondary">Responded</Badge>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
