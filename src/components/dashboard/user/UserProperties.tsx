
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Eye, MapPin, Home, Clock, Check, XCircle } from "lucide-react";

const purchasedProperties = [
  { 
    id: 1, 
    title: "3-Bedroom Modern Apartment", 
    type: "Apartment",
    location: "Downtown Area", 
    price: "$285,000", 
    status: "Completed", 
    date: "Mar 15, 2025",
    verificationStatus: "Verified"
  },
  { 
    id: 2, 
    title: "Land Plot (500 sqm)", 
    type: "Land",
    location: "Greenfield Suburb", 
    price: "$120,000", 
    status: "In Progress", 
    date: "Apr 01, 2025",
    verificationStatus: "Under Review"
  }
];

const listedProperties = [
  { 
    id: 1, 
    title: "Studio Apartment", 
    type: "Apartment",
    location: "University District", 
    price: "$175,000", 
    status: "Active", 
    views: 48,
    inquiries: 5
  },
  { 
    id: 2, 
    title: "2-Bedroom Townhouse", 
    type: "House",
    location: "Riverside Area", 
    price: "$310,000", 
    status: "Pending Verification", 
    views: 24,
    inquiries: 2
  }
];

export default function UserProperties() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground">
            Manage your property purchases and listings
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          List New Property
        </Button>
      </div>
      
      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Property Purchases</CardTitle>
              <CardDescription>Properties you've bought or are in the process of buying</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Transaction Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasedProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="font-medium">{property.title}</div>
                        <div className="text-xs text-muted-foreground">{property.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{property.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{property.price}</TableCell>
                      <TableCell>
                        <Badge variant={property.status === "Completed" ? "success" : "outline"}>
                          {property.status === "Completed" ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          property.verificationStatus === "Verified" ? "success" :
                          property.verificationStatus === "Under Review" ? "warning" : "outline"
                        }>
                          {property.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {purchasedProperties.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-muted-foreground">You haven't purchased any properties yet</div>
                  <Button variant="outline" className="mt-4">Browse Properties</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Property Listings</CardTitle>
              <CardDescription>Properties you've listed for sale</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Analytics</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listedProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="font-medium">{property.title}</div>
                        <div className="text-xs text-muted-foreground">{property.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{property.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{property.price}</TableCell>
                      <TableCell>
                        <Badge variant={
                          property.status === "Active" ? "success" :
                          property.status === "Pending Verification" ? "warning" : "outline"
                        }>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>Views: {property.views}</div>
                          <div>Inquiries: {property.inquiries}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {listedProperties.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-muted-foreground">You haven't listed any properties yet</div>
                  <Button className="mt-4">List Your First Property</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
