
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Heart, MessageSquare, Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Helmet } from "react-helmet-async";

export default function UserDashboard() {
  // Sample data for user stats
  const userStats = [
    { title: "Saved Properties", value: "12", icon: Heart, color: "text-rose-500" },
    { title: "Property Views", value: "48", icon: Eye, color: "text-blue-500" },
    { title: "Messages", value: "5", icon: MessageSquare, color: "text-emerald-500" },
    { title: "Upcoming Tours", value: "2", icon: Building, color: "text-amber-500" },
  ];

  // Sample data for saved properties
  const savedProperties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      price: "$325,000",
      location: "Downtown, City Center",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1050,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Suburban Family Home",
      price: "$529,000",
      location: "Pleasant Valley, Suburbs",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Luxury Waterfront Condo",
      price: "$875,000",
      location: "Marina Bay, Waterfront",
      bedrooms: 3,
      bathrooms: 3.5,
      sqft: 1875,
      image: "/placeholder.svg"
    },
  ];

  return (
    <DashboardLayout userType="user">
      <Helmet>
        <title>User Dashboard | HomePulse Realty</title>
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your property searches
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {userStats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 ${stat.color.replace('text', 'bg')}/10 rounded-full`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="favorites" className="space-y-4">
          <TabsList>
            <TabsTrigger value="favorites">My Favorites</TabsTrigger>
            <TabsTrigger value="searches">Saved Searches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="tours">Scheduled Tours</TabsTrigger>
          </TabsList>
          
          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Properties</CardTitle>
                <CardDescription>
                  Properties you've added to your favorites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {savedProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <div className="aspect-video w-full relative">
                        <img 
                          src={property.image} 
                          alt={property.title} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
                        <p className="text-primary text-xl font-medium">{property.price}</p>
                        <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{property.bedrooms} bd</span>
                          <span className="text-xs">•</span>
                          <span>{property.bathrooms} ba</span>
                          <span className="text-xs">•</span>
                          <span>{property.sqft} sqft</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="searches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Searches</CardTitle>
                <CardDescription>
                  Your saved search criteria and filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Saved searches will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Your communications with agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Messages will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Property Tours</CardTitle>
                <CardDescription>
                  Your upcoming property viewings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Scheduled tours will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
