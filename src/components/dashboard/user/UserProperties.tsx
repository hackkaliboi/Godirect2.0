
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
import { Plus, Search, MoreHorizontal, Filter } from "lucide-react";

// Sample data
const properties = [
  { 
    id: 1, 
    title: "Modern Downtown Apartment", 
    address: "123 Main St, Downtown", 
    price: "$325,000", 
    status: "Active",
    type: "For Sale",
    views: 245,
    inquiries: 8,
    date: "2023-05-15"
  },
  { 
    id: 2, 
    title: "Luxury Waterfront Condo", 
    address: "789 Marina Blvd, Waterfront", 
    price: "$875,000", 
    status: "Active",
    type: "For Sale",
    views: 187,
    inquiries: 6,
    date: "2023-05-18"
  },
  { 
    id: 3, 
    title: "Suburban Family Home", 
    address: "456 Oak Ave, Pleasant Valley", 
    price: "$529,000", 
    status: "Pending",
    type: "For Sale",
    views: 320,
    inquiries: 12,
    date: "2023-05-10"
  },
  { 
    id: 4, 
    title: "Downtown Office Space", 
    address: "555 Business Ave, Downtown", 
    price: "$4,500/mo", 
    status: "Active",
    type: "For Rent",
    views: 110,
    inquiries: 3,
    date: "2023-05-20"
  },
  { 
    id: 5, 
    title: "Cozy Studio Apartment", 
    address: "101 College St, University District", 
    price: "$1,800/mo", 
    status: "Active",
    type: "For Rent",
    views: 95,
    inquiries: 5,
    date: "2023-05-22"
  },
  { 
    id: 6, 
    title: "Elegant Townhouse", 
    address: "225 Park Lane, Midtown", 
    price: "$425,000", 
    status: "Inactive",
    type: "For Sale",
    views: 72,
    inquiries: 0,
    date: "2023-04-15"
  },
];

const UserProperties = () => {
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
                <Input placeholder="Search properties..." className="pl-8" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Properties</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>For Sale</DropdownMenuItem>
                  <DropdownMenuItem>For Rent</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Pending</DropdownMenuItem>
                  <DropdownMenuItem>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 overflow-auto">
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
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-xs text-muted-foreground">{property.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell className="hidden md:table-cell">{property.type}</TableCell>
                  <TableCell>
                    <Badge variant={
                      property.status === "Active" ? "default" : 
                      property.status === "Pending" ? "secondary" : "outline"
                    }>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{property.views}</TableCell>
                  <TableCell className="hidden sm:table-cell">{property.inquiries}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProperties;
