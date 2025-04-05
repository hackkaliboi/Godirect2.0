
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserSettings from "@/components/dashboard/user/UserSettings";
import UserFavorites from "@/components/dashboard/user/UserFavorites";
import UserMessages from "@/components/dashboard/user/UserMessages";
import UserPurchases from "@/components/dashboard/user/UserPurchases";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Heart, 
  Search, 
  Building, 
  MessageSquare, 
  Clock,
  Calendar,
  ArrowUpRight,
  Eye,
  MapPin,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  SearchCheck,
  Bell,
  History as HistoryIcon,
  TrendingUp
} from "lucide-react";

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
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>April 2025</span>
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Browse Properties
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Property Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">123</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        28%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs previous 30 days
                    </div>
                    <div className="mt-3">
                      <Progress value={72} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Saved Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">8</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        12%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs previous 30 days
                    </div>
                    <div className="mt-3">
                      <Progress value={48} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Agent Responses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">5</div>
                      <div className="flex items-center text-red-500 text-sm font-medium">
                        <ArrowDown className="mr-1 h-4 w-4" />
                        10%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      vs previous 30 days
                    </div>
                    <div className="mt-3">
                      <Progress value={32} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="properties" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                <TabsContent value="properties">
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
                        <HistoryIcon className="h-5 w-5 text-purple-500" />
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
                </TabsContent>
                
                <TabsContent value="activities">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>Your recent interactions with properties and agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted">
                          {[
                            { title: "Viewed 14 Oak Avenue", time: "2 hours ago", icon: <Eye className="h-4 w-4 text-blue-500" /> },
                            { title: "Messaged Agent Sarah about 78 Pine Street", time: "Yesterday", icon: <MessageSquare className="h-4 w-4 text-indigo-500" /> },
                            { title: "Added 45 Maple Drive to favorites", time: "2 days ago", icon: <Heart className="h-4 w-4 text-rose-500" /> },
                            { title: "Updated your search criteria", time: "3 days ago", icon: <SearchCheck className="h-4 w-4 text-amber-500" /> },
                          ].map((activity, index) => (
                            <div key={index} className="relative mb-6 last:mb-0">
                              <div className="absolute -left-[22px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 p-1">
                                {activity.icon}
                              </div>
                              <div className="pt-1.5">
                                <p className="text-sm font-medium">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="insights">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>Market Trends</CardTitle>
                        <CardDescription>Average property prices in your saved areas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                          <TrendingUp className="h-10 w-10 text-muted" />
                          <span className="ml-2 text-muted-foreground">Price trend chart</span>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="text-sm">Downtown</div>
                            <div className="text-sm font-medium">$428,500 <span className="text-green-500 text-xs">+2.4%</span></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">Suburbs</div>
                            <div className="text-sm font-medium">$352,700 <span className="text-green-500 text-xs">+1.8%</span></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>Property Comparison</CardTitle>
                        <CardDescription>How your viewed properties compare</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Price Range</span>
                            <span className="text-sm font-medium">$350k - $450k</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Size (sq ft)</span>
                            <span className="text-sm font-medium">1,500 - 2,200</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Bedrooms</span>
                            <span className="text-sm font-medium">3 - 4</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Recommended Properties</CardTitle>
                      <CardDescription>Based on your browsing history and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex border rounded-md overflow-hidden hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="w-24 h-24 bg-muted flex-shrink-0 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">IMG</span>
                            </div>
                            <div className="p-3 flex-1">
                              <div className="font-medium text-sm">Beautiful {i + 2} Bedroom Home</div>
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {123 + i} Example Street
                              </div>
                              <div className="mt-1 text-sm font-medium">${(350 + i * 15).toLocaleString()},000</div>
                              <div className="flex items-center mt-1 text-xs">
                                <span className="text-muted-foreground">{i + 2} bd</span>
                                <span className="mx-1.5">•</span>
                                <span className="text-muted-foreground">{i + 1} ba</span>
                                <span className="mx-1.5">•</span>
                                <span className="text-muted-foreground">{1200 + i * 150} sq ft</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Button variant="outline" size="sm">View All Recommendations</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
