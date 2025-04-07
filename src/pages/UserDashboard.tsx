
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserMessages from "@/components/dashboard/user/UserMessages";
import UserPurchases from "@/components/dashboard/user/UserPurchases";
import UserSettings from "@/components/dashboard/user/UserSettings";
import UserProperties from "@/components/dashboard/user/UserProperties";
import UserPropertyDetail from "@/components/dashboard/user/UserPropertyDetail";
import UserPropertyForm from "@/components/dashboard/user/UserPropertyForm";
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

// Main Dashboard component
const UserDashboardHome = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">User Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">My Properties</h3>
        <p className="text-muted-foreground mb-4">Manage your property purchases and listings</p>
        <Navigate to="/user-dashboard/properties" replace />
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Favorites</h3>
        <p className="text-muted-foreground mb-4">Properties you've saved for later</p>
        <Navigate to="/user-dashboard/favorites" replace />
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Messages</h3>
        <p className="text-muted-foreground mb-4">Your communications with agents and sellers</p>
        <Navigate to="/user-dashboard/messages" replace />
      </div>
    </div>
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
          <Route index element={<UserDashboardHome />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/favorites" element={<UserFavorites />} />
          <Route path="/messages" element={<UserMessages />} />
          <Route path="/purchases" element={<UserPurchases />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/properties" element={<UserProperties />} />
          <Route path="/properties/new" element={<UserPropertyForm />} />
          <Route path="/properties/:id" element={<UserPropertyDetail />} />
          <Route path="/properties/edit/:id" element={<UserPropertyForm />} />
          
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
