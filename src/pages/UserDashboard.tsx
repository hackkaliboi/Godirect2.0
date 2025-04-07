
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserMessages from "@/components/dashboard/user/UserMessages";
import UserPurchases from "@/components/dashboard/user/UserPurchases";
import UserSettings from "@/components/dashboard/user/UserSettings";
import UserProperties from "@/components/dashboard/user/UserProperties";
import { Helmet } from "react-helmet-async";

// Additional imports for routes mentioned in useNavItems but not implemented yet
const UserSavedSearches = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Saved Searches</h2>
    <p>View and manage your saved property searches.</p>
  </div>
);

const UserPropertyAlerts = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Property Alerts</h2>
    <p>Configure alerts for properties matching your criteria.</p>
  </div>
);

const UserViewingHistory = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Viewing History</h2>
    <p>See your history of property views and interactions.</p>
  </div>
);

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
          <Route path="/properties" element={<UserProperties />} />
          {/* Additional routes from useNavItems */}
          <Route path="/saved-searches" element={<UserSavedSearches />} />
          <Route path="/property-alerts" element={<UserPropertyAlerts />} />
          <Route path="/viewing-history" element={<UserViewingHistory />} />
          <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default UserDashboard;
