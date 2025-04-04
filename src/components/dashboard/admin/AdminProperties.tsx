
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const properties = [
  { 
    id: 1, 
    title: "Modern Downtown Apartment", 
    address: "123 Main St, Downtown", 
    price: "$325,000", 
    beds: 2, 
    baths: 2,
    sqft: 1050,
    type: "Apartment",
    status: "Active", 
    agent: "Sarah Johnson",
    listed: "May 12, 2023" 
  },
  { 
    id: 2, 
    title: "Suburban Family Home", 
    address: "456 Oak Ave, Pleasant Valley", 
    price: "$529,000", 
    beds: 4, 
    baths: 3,
    sqft: 2200,
    type: "Single Family",
    status: "Active", 
    agent: "David Martinez",
    listed: "Apr 28, 2023" 
  },
  { 
    id: 3, 
    title: "Luxury Waterfront Condo", 
    address: "789 Marina Blvd, Waterfront", 
    price: "$875,000", 
    beds: 3, 
    baths: 3.5,
    sqft: 1875,
    type: "Condo",
    status: "Pending", 
    agent: "Jennifer Williams",
    listed: "Jun 3, 2023" 
  },
  { 
    id: 4, 
    title: "Cozy Studio Apartment", 
    address: "101 College St, University District", 
    price: "$189,000", 
    beds: 0, 
    baths: 1,
    sqft: 550,
    type: "Studio",
    status: "Active", 
    agent: "Robert Brown",
    listed: "May 30, 2023" 
  },
  { 
    id: 5, 
    title: "Elegant Townhouse", 
    address: "225 Park Lane, Midtown", 
    price: "$425,000", 
    beds: 3, 
    baths: 2.5,
    sqft: 1680,
    type: "Townhouse",
    status: "Active", 
    agent: "Amanda Davis",
    listed: "Jun 10, 2023" 
  },
];

export default function AdminProperties() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage all property listings on the platform
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Properties</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search properties..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Listed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-xs text-muted-foreground">{property.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>{property.price}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{property.beds} bd • {property.baths} ba • {property.sqft} sqft</p>
                          <p className="text-xs text-muted-foreground">{property.type}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          property.status === "Active" ? "default" : 
                          property.status === "Pending" ? "secondary" : "outline"
                        }>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{property.agent}</TableCell>
                      <TableCell>{property.listed}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Remove Listing</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Active properties would appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="pending">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Pending properties would appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="sold">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Sold properties would appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
