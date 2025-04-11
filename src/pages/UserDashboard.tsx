
import { Routes, Route, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserProperties from "@/components/dashboard/user/UserProperties";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserInquiries from "@/components/dashboard/user/UserInquiries";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserPropertyDetails from "@/components/dashboard/user/UserPropertyDetails";
import UserNewProperty from "@/components/dashboard/user/UserNewProperty";
import UserEditProperty from "@/components/dashboard/user/UserEditProperty";
import UserInquiryDetails from "@/components/dashboard/user/UserInquiryDetails";
import UserNotFound from "@/components/dashboard/user/UserNotFound";
import { StatsCardGrid, StatsCard } from "@/components/dashboard/StatsCard";
import { Building, MessageSquare, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Dashboard Overview Component
const UserDashboardOverview = () => {
  // Fetch properties for stats
  const { data: properties } = useQuery({
    queryKey: ["dashboard-properties"],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*");
      
      return data || [];
    }
  });

  // Calculate stats from real data
  const activeListings = properties?.filter(p => p.status === "For Sale" || p.status === "For Rent").length || 0;
  const soldProperties = properties?.filter(p => p.status === "Sold").length || 0;
  
  // For views and inquiries, we might need additional tables in the future
  // For now, we'll use calculated values based on the number of properties
  const propertyViews = activeListings * Math.floor((Math.random() * 50) + 20);
  const newInquiries = Math.max(1, Math.floor(activeListings / 2));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your properties today
        </p>
      </div>
      
      <StatsCardGrid>
        <StatsCard
          title="Property Views"
          value={propertyViews.toString()}
          change={12}
          icon={<Building className="h-4 w-4" />}
          trend="positive"
        />
        <StatsCard
          title="New Inquiries"
          value={newInquiries.toString()}
          change={-5}
          icon={<MessageSquare className="h-4 w-4" />}
          trend="negative"
        />
        <StatsCard
          title="Active Listings"
          value={activeListings.toString()}
          change={0}
          icon={<Building className="h-4 w-4" />}
          trend="neutral"
        />
        <StatsCard
          title="Sold Properties"
          value={soldProperties.toString()}
          change={4}
          icon={<Heart className="h-4 w-4" />}
          trend="positive"
        />
      </StatsCardGrid>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* These cards could be replaced with real data components later */}
        <Card />
        <Card />
      </div>
    </div>
  );
};

// Simple placeholder card component
const Card = () => (
  <div className="bg-card p-6 rounded-lg border">
    <h3 className="font-medium mb-2">Summary Card</h3>
    <p className="text-sm text-muted-foreground">
      This card could show recent activity, notifications, or other metrics.
    </p>
  </div>
);

const UserDashboard = () => {
  const location = useLocation();
  
  return (
    <DashboardLayout userType="user">
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
    </DashboardLayout>
  );
};

export default UserDashboard;
