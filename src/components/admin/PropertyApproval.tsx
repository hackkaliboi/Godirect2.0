import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, CheckCircle, XCircle, Eye, DollarSign, Plus } from "lucide-react";

interface Property {
  id: string;
  title: string;
  agent: string;
  price: number;
  type: "apartment" | "house" | "condo" | "commercial";
  status: "pending" | "approved" | "rejected" | "draft";
  submittedDate: string;
  location: string;
  images: number;
}

// Empty data - will be populated from database
const properties: Property[] = [];

export function PropertyApproval() {
  const navigate = useNavigate();

  const handleCreateListing = () => {
    navigate("/admin-dashboard/properties/create");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "apartment":
        return "bg-primary text-primary-foreground";
      case "house":
        return "bg-accent text-accent-foreground";
      case "condo":
        return "bg-success text-success-foreground";
      case "commercial":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Property Approval</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreateListing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search properties..."
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Properties to Review</h3>
            <p className="text-muted-foreground mb-4">
              Property listings submitted by agents will appear here for approval
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Review property details and photos</p>
              <p>• Approve or reject listings</p>
              <p>• Ensure compliance with platform standards</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Images</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-sm text-muted-foreground">{property.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>{property.agent}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(property.type)}>
                      {property.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(property.price)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.submittedDate}</TableCell>
                  <TableCell>{property.images}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-success">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}