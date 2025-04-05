import DashboardLayout from "@/components/layout/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserMessages from "@/components/dashboard/user/UserMessages";
import UserSettings from "@/components/dashboard/user/UserSettings";
import UserPurchases from "@/components/dashboard/user/UserPurchases";
import { Helmet } from "react-helmet-async";
import { Heart, MessageSquare, ShoppingBag, SearchCheck, Bell, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your property search, favorites, and account settings
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Browse Properties
                  </button>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Favorites</CardTitle>
                    <Heart className="h-5 w-5 text-rose-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      Properties saved to your favorites
                    </CardDescription>
                    <div className="mt-4 flex space-x-2 overflow-auto pb-1">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex-shrink-0 w-16 h-16 rounded-md bg-muted overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            IMG
                          </div>
                        </div>
                      ))}
                      <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+5 more</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Messages</CardTitle>
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      Unread messages from agents
                    </CardDescription>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-muted mr-2" />
                        <div className="flex-1 overflow-hidden">
                          <div className="font-medium truncate">John Smith</div>
                          <div className="text-xs text-muted-foreground truncate">
                            Regarding your inquiry about the property...
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-muted mr-2" />
                        <div className="flex-1 overflow-hidden">
                          <div className="font-medium truncate">Sarah Johnson</div>
                          <div className="text-xs text-muted-foreground truncate">
                            I have a new listing that might interest you...
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Purchases</CardTitle>
                    <ShoppingBag className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      Your completed property transactions
                    </CardDescription>
                    <div className="mt-4 p-3 border rounded-md">
                      <div className="text-sm font-medium">123 Maple Street</div>
                      <div className="text-xs text-muted-foreground">Purchased on Jun 15, 2023</div>
                      <div className="mt-2 text-xs flex justify-between">
                        <span className="text-muted-foreground">Value:</span>
                        <span className="font-medium">$425,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Saved Searches</CardTitle>
                    <SearchCheck className="h-5 w-5 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">4</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      Your saved search criteria
                    </CardDescription>
                    <div className="mt-4 space-y-2">
                      <div className="border rounded-md p-2 text-xs">
                        <div className="font-medium">Downtown Apartments</div>
                        <div className="flex justify-between text-muted-foreground mt-1">
                          <span>2+ beds, 1+ baths</span>
                          <span>$1,500-$2,500</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-2 text-xs">
                        <div className="font-medium">Suburban Houses</div>
                        <div className="flex justify-between text-muted-foreground mt-1">
                          <span>3+ beds, 2+ baths</span>
                          <span>$350k-$500k</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Alerts</CardTitle>
                    <Bell className="h-5 w-5 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      New property alerts matching your criteria
                    </CardDescription>
                    <div className="mt-4 space-y-1">
                      <div className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded">
                        2 new properties match "Downtown Apartments"
                      </div>
                      <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Price drop on property in your favorites
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-semibold">Recent Views</CardTitle>
                    <History className="h-5 w-5 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <CardDescription className="text-sm text-muted-foreground">
                      Recently viewed properties
                    </CardDescription>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-16 rounded-md bg-muted overflow-hidden relative">
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                            Property {i}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Recommended Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1,2].map(i => (
                      <div key={i} className="flex border rounded-md overflow-hidden">
                        <div className="w-24 h-24 bg-muted flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">IMG</span>
                        </div>
                        <div className="p-3 flex-1">
                          <div className="font-medium text-sm">Beautiful 3 Bedroom Home</div>
                          <div className="text-xs text-muted-foreground">123 Example Street</div>
                          <div className="mt-1 text-sm font-medium">$399,000</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
