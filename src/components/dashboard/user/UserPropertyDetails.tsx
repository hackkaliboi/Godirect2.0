
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  MessageSquare, 
  Heart, 
  Share2, 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

// Sample property data - in a real app this would be fetched based on ID
const propertyData = {
  id: 1,
  title: "Modern Downtown Apartment",
  address: "123 Main St, Downtown, City, State, 10001",
  description: "Luxurious and modern apartment in the heart of downtown. This stunning property features floor-to-ceiling windows with city views, premium finishes, and an open concept design. The kitchen boasts stainless steel appliances, quartz countertops, and a large island. The primary suite includes a walk-in closet and an ensuite bathroom with a soaking tub and separate shower.",
  price: "$325,000",
  status: "Active",
  type: "For Sale",
  bedrooms: 2,
  bathrooms: 2,
  squareFeet: 1250,
  yearBuilt: 2018,
  amenities: ["Central Air", "In-unit Laundry", "Dishwasher", "Hardwood Floors", "Gym", "Roof Deck", "Pet-friendly", "Storage Units"],
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
  views: 245,
  favorites: 32,
  inquiries: [
    { 
      id: 1, 
      name: "Jane Smith", 
      email: "jane.smith@example.com", 
      message: "I'm interested in viewing this property. Is it available for a showing this weekend?", 
      date: "2023-05-22",
      status: "New"
    },
    { 
      id: 2, 
      name: "Michael Johnson", 
      email: "michael.j@example.com", 
      message: "Does this property have covered parking? And are utilities included in the HOA fees?", 
      date: "2023-05-20",
      status: "Replied"
    },
    { 
      id: 3, 
      name: "Sarah Williams", 
      email: "sarah.w@example.com", 
      message: "Is the property still available? What's the minimum lease term if I wanted to rent it?", 
      date: "2023-05-18",
      status: "Replied"
    },
  ],
  analytics: {
    weeklyViews: [24, 32, 28, 45, 52, 29, 35],
    viewsBySource: {
      "Direct Search": 42,
      "Home Page": 28,
      "Email Campaign": 15,
      "Social Media": 10,
      "Other": 5
    },
    inquiryConversion: 3.2,
    averageTimeOnPage: "2:45"
  },
  postedDate: "2023-05-15",
  lastUpdated: "2023-05-20"
};

const UserPropertyDetails = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  
  // In a real app, we would fetch the property based on ID
  const property = propertyData;
  
  return (
    <div className="p-6 space-y-6">
      {/* Back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/user-dashboard/properties">
            <Button variant="outline" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
            <p className="text-muted-foreground">
              {property.address}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/user-dashboard/properties/edit/${id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Status and metrics cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Badge 
                className={`text-base px-3 py-1 ${
                  property.status === "Active" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }`}
              >
                {property.status === "Active" ? (
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                ) : (
                  <AlertCircle className="mr-1 h-4 w-4" />
                )}
                {property.status}
              </Badge>
              <span className="text-muted-foreground text-sm">{property.type}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center">
              <Eye className="mr-2 h-5 w-5 text-muted-foreground" />
              {property.views}
            </div>
            <span className="text-green-500 text-sm">+24 this week</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-muted-foreground" />
              {property.inquiries.length}
            </div>
            <span className="text-green-500 text-sm">2 unread</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center">
              <Heart className="mr-2 h-5 w-5 text-muted-foreground" />
              {property.favorites}
            </div>
            <span className="text-green-500 text-sm">+5 this week</span>
          </CardContent>
        </Card>
      </div>
      
      {/* Property details tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1 overflow-hidden">
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={property.images[activeImage]} 
                    alt={`${property.title} main`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 p-4">
                  {property.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`aspect-video bg-muted cursor-pointer overflow-hidden ${
                        index === activeImage ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${property.title} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Photos
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-semibold">{property.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="text-lg font-semibold">Apartment</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="text-lg font-semibold">{property.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="text-lg font-semibold">{property.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Square Feet</p>
                      <p className="text-lg font-semibold">{property.squareFeet}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year Built</p>
                      <p className="text-lg font-semibold">{property.yearBuilt}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{property.address}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p>{property.description}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Inquiries Tab */}
        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>Property Inquiries</CardTitle>
              <CardDescription>
                Manage inquiries from potential buyers or renters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{inquiry.name}</CardTitle>
                          <CardDescription>{inquiry.email}</CardDescription>
                        </div>
                        <Badge variant={inquiry.status === "New" ? "default" : "secondary"}>
                          {inquiry.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{inquiry.message}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {inquiry.date}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Mark as Read</Button>
                        <Button size="sm">Reply</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Listing Performance</CardTitle>
              <CardDescription>
                View detailed analytics for this property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Weekly Views</h3>
                <div className="h-48 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  {/* This would be a chart component in a real app */}
                  <p className="text-muted-foreground">Weekly views chart visualization</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Traffic Sources</h3>
                  <div className="space-y-2">
                    {Object.entries(property.analytics.viewsBySource).map(([source, count]) => (
                      <div key={source} className="flex justify-between items-center">
                        <span>{source}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/20 p-3 rounded-md text-center">
                        <p className="text-muted-foreground text-sm">Inquiry Rate</p>
                        <p className="text-xl font-bold">{property.analytics.inquiryConversion}%</p>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-md text-center">
                        <p className="text-muted-foreground text-sm">Avg Time on Page</p>
                        <p className="text-xl font-bold">{property.analytics.averageTimeOnPage}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visitor Actions</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted/20 p-3 rounded-md">
                        <div className="text-xl font-bold">{property.views}</div>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-md">
                        <div className="text-xl font-bold">{property.favorites}</div>
                        <p className="text-xs text-muted-foreground">Favorites</p>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-md">
                        <div className="text-xl font-bold">{property.inquiries.length}</div>
                        <p className="text-xs text-muted-foreground">Inquiries</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Listing History</CardTitle>
              <CardDescription>
                View the timeline of activities and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center">
                      <Home className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="h-full w-0.5 bg-border mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">Listing Created</h3>
                      <Badge variant="outline" className="ml-2">Creation</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.postedDate}
                    </p>
                    <p className="mt-1">
                      Property was first listed at {property.price}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="bg-muted rounded-full h-8 w-8 flex items-center justify-center">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="h-full w-0.5 bg-border mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">Listing Updated</h3>
                      <Badge variant="outline" className="ml-2">Update</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.lastUpdated}
                    </p>
                    <p className="mt-1">
                      Property description and photos were updated
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="bg-muted rounded-full h-8 w-8 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">First Inquiry Received</h3>
                      <Badge variant="outline" className="ml-2">Inquiry</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.inquiries[property.inquiries.length - 1].date}
                    </p>
                    <p className="mt-1">
                      First inquiry was received from {property.inquiries[property.inquiries.length - 1].name}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPropertyDetails;
