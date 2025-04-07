
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Home, 
  CalendarDays, 
  User, 
  FileText, 
  MessageSquare,
  Check,
  AlertCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock property data - in a real app, this would come from an API
const propertyData = {
  "1": {
    id: "1",
    title: "3-Bedroom Modern Apartment",
    type: "Apartment",
    description: "Beautiful and spacious 3-bedroom apartment in downtown area, featuring modern amenities, open floor plan, and fantastic city views.",
    location: "Downtown Area",
    address: "123 Main Street, Downtown Area, City",
    price: 285000,
    status: "Completed",
    verificationStatus: "Verified",
    date: "2025-03-15",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    features: ["Central Air", "Balcony", "In-unit Laundry", "Fitness Center", "Storage Unit"],
    ownerInfo: {
      name: "Alex Garcia",
      contact: "alex@example.com",
      phone: "555-123-4567"
    },
    documents: ["Title Deed", "Property Assessment", "Floor Plan"],
    inquiries: 12
  },
  "2": {
    id: "2",
    title: "Land Plot (500 sqm)",
    type: "Land",
    description: "Prime 500 square meter land plot in fast-developing Greenfield Suburb. Ideal for residential construction with all utilities available at the property line.",
    location: "Greenfield Suburb",
    address: "Lot 45, Greenfield Development, Suburb",
    price: 120000,
    status: "In Progress",
    verificationStatus: "Under Review",
    date: "2025-04-01",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    squareFeet: 5000,
    features: ["Corner Lot", "Utilities Available", "Clear Title", "No Liens"],
    ownerInfo: {
      name: "Alex Garcia",
      contact: "alex@example.com",
      phone: "555-123-4567"
    },
    documents: ["Land Title", "Survey Map", "Zoning Certificate"],
    inquiries: 5
  }
};

export default function UserPropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  
  // In a real app, you would fetch this data from an API
  const property = propertyData[id as keyof typeof propertyData];
  
  if (!property) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => navigate('/user-dashboard/properties')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Properties
        </Button>
        <div className="flex items-center justify-center h-64 mt-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Property Not Found</h3>
            <p className="mt-1 text-muted-foreground">The property you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    toast({
      title: "Property deletion requested",
      description: "Your request to delete this property has been submitted.",
    });
    navigate('/user-dashboard/properties');
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Completed":
        return <Badge variant="success" className="text-sm"><Check className="h-3 w-3 mr-1" /> {status}</Badge>;
      case "In Progress":
        return <Badge variant="outline" className="text-sm"><Clock className="h-3 w-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="outline" className="text-sm">{status}</Badge>;
    }
  };
  
  const getVerificationBadge = (status: string) => {
    switch(status) {
      case "Verified":
        return <Badge variant="success" className="text-sm">{status}</Badge>;
      case "Under Review":
        return <Badge variant="warning" className="text-sm">{status}</Badge>;
      default:
        return <Badge variant="outline" className="text-sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Button variant="outline" onClick={() => navigate('/user-dashboard/properties')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Properties
          </Button>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" /> {property.address}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/user-dashboard/properties/edit/${id}`)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">No image available</div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{property.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Property Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span>{property.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span>${property.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{property.location}</span>
                          </div>
                          {property.bedrooms && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bedrooms:</span>
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bathrooms:</span>
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span>{property.squareFeet} sqft</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Features</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {property.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="space-y-4">
                    <h3 className="font-medium">Property Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.documents.map((doc, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>{doc}</span>
                          <Button variant="ghost" size="sm" className="ml-auto">View</Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="mt-4">
                      Upload New Document
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="inquiries">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Property Inquiries</h3>
                      <Badge variant="secondary">{property.inquiries} total</Badge>
                    </div>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">John Smith</span>
                          </div>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm">I'm interested in this property. Is it still available for viewing this weekend?</p>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3 mr-1" /> Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-muted-foreground text-sm">
                      View all inquiries
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction Status:</span>
                <div>{getStatusBadge(property.status)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Verification Status:</span>
                <div>{getVerificationBadge(property.verificationStatus)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date Listed:</span>
                <span>{new Date(property.date).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Owner Information</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{property.ownerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{property.ownerInfo.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{property.ownerInfo.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button>Request Verification</Button>
                <Button variant="outline">Download Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
