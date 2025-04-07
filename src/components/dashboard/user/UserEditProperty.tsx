
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, X, Plus, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample property data - in a real app this would be fetched based on ID
const propertyData = {
  id: 1,
  title: "Modern Downtown Apartment",
  type: "apartment",
  listingType: "sale",
  price: 325000,
  description: "Luxurious and modern apartment in the heart of downtown. This stunning property features floor-to-ceiling windows with city views, premium finishes, and an open concept design. The kitchen boasts stainless steel appliances, quartz countertops, and a large island. The primary suite includes a walk-in closet and an ensuite bathroom with a soaking tub and separate shower.",
  address: "123 Main Street",
  city: "Downtown",
  state: "State",
  zipCode: "10001",
  country: "us",
  bedrooms: 2,
  bathrooms: 2,
  squareFeet: 1250,
  yearBuilt: 2018,
  lotSize: 1250,
  parkingSpaces: 1,
  amenities: ["Central Air", "In-unit Laundry", "Dishwasher", "Hardwood Floors", "Gym", "Roof Deck", "Pet-friendly"],
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
};

const amenities = [
  "Central Air", "Dishwasher", "Hardwood Floors", "In-Unit Laundry", "Balcony",
  "Gym", "Pool", "Roof Deck", "Storage Unit", "Garage", "Pet-friendly", "Doorman",
  "Elevator", "Wheelchair Access", "Fireplace"
];

const UserEditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [property, setProperty] = useState(propertyData);
  const [images, setImages] = useState<string[]>(propertyData.images);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(propertyData.amenities);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch property data here based on ID
  }, [id]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload to a storage service
    // Here we're just creating fake URLs
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => 
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(
      selectedAmenities.includes(amenity)
        ? selectedAmenities.filter((a) => a !== amenity)
        : [...selectedAmenities, amenity]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Property Updated",
        description: "Your property has been successfully updated.",
      });
      navigate(`/user-dashboard/properties/${id}`);
    }, 1500);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <Link to={`/user-dashboard/properties/${id}`}>
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground">
            Update your property listing
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the essential details about your property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  defaultValue={property.title}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select defaultValue={property.type} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condominium</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="listingType">Listing Type</Label>
                <Select defaultValue={property.listingType} required>
                  <SelectTrigger id="listingType">
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  defaultValue={property.price}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={property.description}
                className="min-h-[150px]"
                required
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Where is your property located
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <div className="flex">
                <Input
                  id="address"
                  defaultValue={property.address}
                  className="flex-1"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  defaultValue={property.city}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  defaultValue={property.state}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP/Postal Code</Label>
                <Input
                  id="zip"
                  defaultValue={property.zipCode}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select defaultValue={property.country}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="h-48 border border-dashed rounded-md flex flex-col items-center justify-center bg-muted/20">
              <MapPin className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Map location will be displayed here</p>
              <Button variant="link" size="sm">Update Map Location</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Features & Details */}
        <Card>
          <CardHeader>
            <CardTitle>Features & Details</CardTitle>
            <CardDescription>
              Update specific details about your property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  defaultValue={property.bedrooms}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  defaultValue={property.bathrooms}
                  min="0"
                  step="0.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input
                  id="squareFeet"
                  type="number"
                  defaultValue={property.squareFeet}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  defaultValue={property.yearBuilt}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size (sq ft)</Label>
                <Input
                  id="lotSize"
                  type="number"
                  defaultValue={property.lotSize}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  defaultValue={property.parkingSpaces}
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`amenity-${amenity}`} 
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label 
                      htmlFor={`amenity-${amenity}`}
                      className="text-sm cursor-pointer"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
            <CardDescription>
              Update photos of your property (maximum 10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="aspect-video bg-muted relative overflow-hidden rounded-md">
                  <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {images.length < 10 && (
                <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Image</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {images.length} of 10 images uploaded
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="destructive" type="button">
            Delete Property
          </Button>
          <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={() => navigate(`/user-dashboard/properties/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update Property"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserEditProperty;
