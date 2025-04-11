
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Filter, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/utils/supabaseData";
import { useQuery } from "@tanstack/react-query";
import { formatPriceWithCommas } from "@/utils/data";
import { Link } from "react-router-dom";

export default function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch properties from Supabase
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, agents(name)");
      
      if (error) {
        throw error;
      }
      
      return data as (Property & { agents: { name: string } })[];
    }
  });

  // Filter properties based on search term and active tab
  const filteredProperties = properties?.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && property.status === "Active";
    if (activeTab === "pending") return matchesSearch && property.status === "Pending";
    if (activeTab === "sold") return matchesSearch && property.status === "Sold";
    
    return matchesSearch;
  });

  // If loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If error
  if (error) {
    console.error("Error loading properties:", error);
    return (
      <div className="text-center">
        <p className="text-red-500">Failed to load properties. Please try again later.</p>
      </div>
    );
  }

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
                <Input 
                  placeholder="Search properties..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="overflow-x-auto">
              {filteredProperties && filteredProperties.length > 0 ? (
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
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-xs text-muted-foreground">{property.street}, {property.city}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatPriceWithCommas(property.price)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{property.bedrooms || 0} bd • {property.bathrooms || 0} ba • {property.square_feet || 0} sqft</p>
                            <p className="text-xs text-muted-foreground">{property.property_type}</p>
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
                        <TableCell>{property.agents?.name || "Unassigned"}</TableCell>
                        <TableCell>{new Date(property.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <Link to={`/properties/${property.id}`}>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                              </Link>
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
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No properties match your search criteria." : "No properties found in the database."}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {filteredProperties && filteredProperties.length > 0 ? (
                <Table>
                  {/* Similar table structure as above, filtered for active properties */}
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
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-xs text-muted-foreground">{property.street}, {property.city}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatPriceWithCommas(property.price)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{property.bedrooms || 0} bd • {property.bathrooms || 0} ba • {property.square_feet || 0} sqft</p>
                            <p className="text-xs text-muted-foreground">{property.property_type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{property.agents?.name || "Unassigned"}</TableCell>
                        <TableCell>{new Date(property.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <Link to={`/properties/${property.id}`}>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                              </Link>
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
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No active properties found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">
                  {filteredProperties && filteredProperties.length > 0 
                    ? "Pending properties would appear here" 
                    : "No pending properties found"}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="sold">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">
                  {filteredProperties && filteredProperties.length > 0 
                    ? "Sold properties would appear here" 
                    : "No sold properties found"}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
