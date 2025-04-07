
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Search, 
  Filter, 
  ExternalLink, 
  MessageSquare,
  Trash2
} from "lucide-react";

// Sample data
const favorites = [
  { 
    id: 101, 
    title: "Luxury Waterfront Condo", 
    address: "789 Marina Blvd, Waterfront", 
    price: "$875,000", 
    type: "For Sale",
    agent: "Sarah Johnson",
    savedDate: "2023-06-12"
  },
  { 
    id: 102, 
    title: "Modern Family Home", 
    address: "456 Oak Ave, Pleasant Valley", 
    price: "$529,000", 
    type: "For Sale",
    agent: "David Martinez",
    savedDate: "2023-06-10"
  },
  { 
    id: 103, 
    title: "Downtown Loft Apartment", 
    address: "555 Central St, Downtown", 
    price: "$2,200/mo", 
    type: "For Rent",
    agent: "Jennifer Williams",
    savedDate: "2023-06-05"
  },
  { 
    id: 104, 
    title: "Elegant Townhouse", 
    address: "225 Park Lane, Midtown", 
    price: "$425,000", 
    type: "For Sale",
    agent: "Robert Brown",
    savedDate: "2023-05-28"
  },
  { 
    id: 105, 
    title: "Suburban Ranch House", 
    address: "888 Meadow Rd, Pleasant Valley", 
    price: "$389,000", 
    type: "For Sale",
    agent: "Amanda Davis",
    savedDate: "2023-05-25"
  },
];

const UserFavorites = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Properties</h1>
          <p className="text-muted-foreground">
            Properties you've saved for future reference
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-muted-foreground mr-2" />
              <CardTitle>Favorited Properties</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search favorites..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Agent</TableHead>
                <TableHead className="hidden sm:table-cell">Saved</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {favorites.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-xs text-muted-foreground">{property.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{property.agent}</TableCell>
                  <TableCell className="hidden sm:table-cell">{property.savedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default UserFavorites;
