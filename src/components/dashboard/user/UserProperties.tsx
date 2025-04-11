
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Filter, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/utils/supabaseData";
import { useQuery } from "@tanstack/react-query";
import { formatPriceWithCommas } from "@/utils/data";

const UserProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["user-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      return data as Property[];
    }
  });
  
  // Filter properties based on search term and filter type
  const filteredProperties = properties?.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "For Sale") return matchesSearch && property.status === "For Sale";
    if (filterType === "For Rent") return matchesSearch && property.status === "For Rent";
    if (filterType === "Active") return matchesSearch && property.status === "Active";
    if (filterType === "Pending") return matchesSearch && property.status === "Pending";
    if (filterType === "Inactive") return matchesSearch && property.status === "Inactive";
    
    return matchesSearch;
  });
  
  // If loading
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If error
  if (error) {
    console.error("Error loading properties:", error);
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load properties. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground">
            Manage your property listings
          </p>
        </div>
        <Link to="/user-dashboard/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Properties</CardTitle>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search properties..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType("all")}>All Properties</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType("For Sale")}>For Sale</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("For Rent")}>For Rent</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType("Active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Inactive")}>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 overflow-auto">
          {filteredProperties && filteredProperties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Views</TableHead>
                  <TableHead className="hidden sm:table-cell">Inquiries</TableHead>
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
                    <TableCell className="hidden md:table-cell">{property.status}</TableCell>
                    <TableCell>
                      <Badge variant={
                        property.status === "Active" ? "default" : 
                        property.status === "Pending" ? "secondary" : "outline"
                      }>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">-</TableCell>
                    <TableCell className="hidden sm:table-cell">-</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={`/user-dashboard/properties/${property.id}`}>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </Link>
                          <Link to={`/user-dashboard/properties/edit/${property.id}`}>
                            <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Remove Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" 
                  ? "No properties match your search criteria." 
                  : "No properties found. Add your first property to get started."}
              </p>
              {!searchTerm && filterType === "all" && (
                <Link to="/user-dashboard/properties/new" className="mt-4 inline-block">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProperties;
