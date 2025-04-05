
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserMessages from "@/components/dashboard/user/UserMessages";
import UserSettings from "@/components/dashboard/user/UserSettings";
import UserPurchases from "@/components/dashboard/user/UserPurchases";
import { Helmet } from "react-helmet-async";

const UserDashboard = () => {
  return (
    <>
      <Helmet>
        <title>User Dashboard | GODIRECT</title>
      </Helmet>
      <DashboardLayout userType="user">
        <Routes>
          <Route index element={
            <div className="p-6 space-y-6">
              <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your property search, favorites, and account settings
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Favorites</h3>
                  <p className="text-muted-foreground mb-4">Your saved properties</p>
                  <div className="text-3xl font-bold">8</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Messages</h3>
                  <p className="text-muted-foreground mb-4">Unread messages</p>
                  <div className="text-3xl font-bold">3</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Purchases</h3>
                  <p className="text-muted-foreground mb-4">Your property transactions</p>
                  <div className="text-3xl font-bold">1</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Saved Searches</h3>
                  <p className="text-muted-foreground mb-4">Your saved search criteria</p>
                  <div className="text-3xl font-bold">4</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Alerts</h3>
                  <p className="text-muted-foreground mb-4">New property alerts</p>
                  <div className="text-3xl font-bold">2</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Recent Views</h3>
                  <p className="text-muted-foreground mb-4">Recently viewed properties</p>
                  <div className="text-3xl font-bold">12</div>
                </div>
              </div>
            </div>
          } />
          <Route path="/profile" element={<UserProfile />} />
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
