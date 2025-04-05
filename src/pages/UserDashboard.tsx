
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserMessages from "@/components/dashboard/user/UserMessages";
import UserSettings from "@/components/dashboard/user/UserSettings";
import UserPurchases from "@/components/dashboard/user/UserPurchases";
import { Helmet } from "react-helmet-async";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Settings,
  ShoppingCart,
  Search,
  Home,
  History
} from "lucide-react";

const UserDashboard = () => {
  return (
    <>
      <Helmet>
        <title>User Dashboard | HomePulse Realty</title>
      </Helmet>
      <DashboardLayout userType="user">
        <Routes>
          <Route path="/" element={<UserProfile />} />
          <Route path="/favorites" element={<UserFavorites />} />
          <Route path="/messages" element={<UserMessages />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/purchases" element={<UserPurchases />} />
          <Route path="/saved-searches" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Saved Searches</h2>
              <p>Keep track of your property search criteria.</p>
            </div>
          } />
          <Route path="/property-alerts" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Property Alerts</h2>
              <p>Get notified when new properties match your criteria.</p>
            </div>
          } />
          <Route path="/viewing-history" element={
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Viewing History</h2>
              <p>View properties you've recently viewed.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default UserDashboard;
