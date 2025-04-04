
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const favoriteProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: "$325,000",
    location: "Downtown, City Center",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    type: "Apartment",
    image: "/placeholder.svg",
    dateAdded: "Jun 12, 2023"
  },
  {
    id: 2,
    title: "Suburban Family Home",
    price: "$529,000",
    location: "Pleasant Valley, Suburbs",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    type: "Single Family",
    image: "/placeholder.svg",
    dateAdded: "Jun 10, 2023"
  },
  {
    id: 3,
    title: "Luxury Waterfront Condo",
    price: "$875,000",
    location: "Marina Bay, Waterfront",
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 1875,
    type: "Condo",
    image: "/placeholder.svg",
    dateAdded: "Jun 8, 2023"
  },
  {
    id: 4,
    title: "Cozy Studio Apartment",
    price: "$189,000",
    location: "University District",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    type: "Studio",
    image: "/placeholder.svg",
    dateAdded: "Jun 5, 2023"
  },
  {
    id: 5,
    title: "Elegant Townhouse",
    price: "$425,000",
    location: "Midtown",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1680,
    type: "Townhouse",
    image: "/placeholder.svg",
    dateAdded: "Jun 2, 2023"
  },
  {
    id: 6,
    title: "Renovated Bungalow",
    price: "$385,000",
    location: "Historic District",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1250,
    type: "Bungalow",
    image: "/placeholder.svg",
    dateAdded: "May 29, 2023"
  },
];

export default function UserFavorites() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          <p className="text-muted-foreground">
            Properties you've saved to revisit later
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {favoriteProperties.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="object-cover w-full h-full"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
                <p className="text-primary text-xl font-medium">{property.price}</p>
                <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{property.bedrooms} bd</span>
                  <span className="text-xs">•</span>
                  <span>{property.bathrooms} ba</span>
                  <span className="text-xs">•</span>
                  <span>{property.sqft} sqft</span>
                  <span className="text-xs">•</span>
                  <span>{property.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Heart className="h-3 w-3 mr-1 fill-primary text-primary" />
                    <span>Saved {property.dateAdded}</span>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No saved properties yet</CardTitle>
            <p className="text-center text-muted-foreground">
              Save properties you're interested in to view them later
            </p>
            <Button className="mt-4">Browse Properties</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
