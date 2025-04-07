
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserMessages from "@/components/dashboard/user/UserMessages";
import UserPurchases from "@/components/dashboard/user/UserPurchases";
import UserSettings from "@/components/dashboard/user/UserSettings";
import UserProperties from "@/components/dashboard/user/UserProperties"; // New import
import { Helmet } from "react-helmet-async";

const UserDashboard = () => {
  return (
    <>
      <Helmet>
        <title>User Dashboard | GODIRECT</title>
      </Helmet>
      <DashboardLayout userType="user">
        <Routes>
          <Route index element={<UserProfile />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/favorites" element={<UserFavorites />} />
          <Route path="/messages" element={<UserMessages />} />
          <Route path="/purchases" element={<UserPurchases />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/properties" element={<UserProperties />} /> {/* New route */}
          <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default UserDashboard;
