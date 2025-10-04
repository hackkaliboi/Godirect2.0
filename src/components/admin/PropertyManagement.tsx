import { useState, useEffect } from "react";
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
import { Search, MoreHorizontal, CheckCircle, XCircle, Eye, DollarSign, Plus, Loader2, RefreshCw } from "lucide-react";
import { fetchProperties, fetchPendingProperties } from "@/utils/supabaseData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/database";

interface PropertyDisplay extends Property {
    owner: string;
    submittedDate: string;
    location: string;
    imageCount: number;
}

export function PropertyManagement() {
    console.log("PropertyManagement component rendering");

    const navigate = useNavigate();
    const [properties, setProperties] = useState<PropertyDisplay[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<PropertyDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"all" | "pending">("all");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("PropertyManagement component mounted");
        loadProperties();
    }, [viewMode]);

    useEffect(() => {
        // Filter properties based on search term
        if (!searchTerm) {
            setFilteredProperties(properties);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = properties.filter(property =>
                property.title.toLowerCase().includes(term) ||
                property.city.toLowerCase().includes(term) ||
                property.state.toLowerCase().includes(term) ||
                property.property_type.toLowerCase().includes(term)
            );
            setFilteredProperties(filtered);
        }
    }, [searchTerm, properties]);

    const loadProperties = async () => {
        try {
            console.log("Loading properties, viewMode:", viewMode);
            setLoading(true);
            setError(null);
            let data: Property[] = [];

            if (viewMode === "pending") {
                console.log("Fetching pending properties...");
                data = await fetchPendingProperties();
                console.log("Pending properties fetched:", data);
            } else {
                console.log("Fetching all properties...");
                data = await fetchProperties();
                console.log("All properties fetched:", data);
            }

            // Transform properties to include additional display fields
            const transformedProperties = data.map(property => ({
                ...property,
                owner: property.owner_id || "Unassigned",
                submittedDate: new Date(property.created_at).toLocaleDateString(),
                location: `${property.city}, ${property.state}`,
                imageCount: property.images?.length || 0
            }));

            console.log("Transformed properties:", transformedProperties);
            setProperties(transformedProperties);
            setFilteredProperties(transformedProperties);
        } catch (err) {
            console.error("Error loading properties:", err);
            setError(err.message || "Failed to load properties");
            toast.error("Failed to load properties: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateListing = () => {
        navigate("/dashboard/admin/properties/create");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-success text-success-foreground";
            case "pending":
                return "bg-warning text-warning-foreground";
            case "sold":
                return "bg-destructive text-destructive-foreground";
            case "rented":
                return "bg-blue text-blue-foreground";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
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
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                    <CardTitle>Property Management</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={handleCreateListing}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Listing
                        </Button>
                        <Button
                            variant={viewMode === "all" ? "default" : "outline"}
                            onClick={() => setViewMode("all")}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            All Properties
                        </Button>
                        <Button
                            variant={viewMode === "pending" ? "default" : "outline"}
                            onClick={() => setViewMode("pending")}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Pending Approval
                        </Button>
                        <Button
                            variant="outline"
                            onClick={loadProperties}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search properties..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-4">Error: {error}</div>
                        <Button onClick={loadProperties}>Retry</Button>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {viewMode === "pending" ? "No Properties Need Approval" : "No Properties Found"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {viewMode === "pending"
                                ? "All property listings are approved or there are no pending submissions."
                                : "No properties match your current filters."
                            }
                        </p>
                        <Button onClick={handleCreateListing}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Listing
                        </Button>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Images</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProperties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{property.title}</div>
                                            <div className="text-sm text-muted-foreground">{property.location}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{property.owner}</TableCell>
                                    <TableCell>
                                        <Badge className={getTypeColor(property.property_type)}>
                                            {property.property_type}
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
                                    <TableCell>{property.imageCount}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigate(`/property/${property.id}`)}>
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