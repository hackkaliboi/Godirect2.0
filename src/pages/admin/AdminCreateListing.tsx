import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Camera, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Car,
  ArrowLeft,
  Plus,
  X,
  Shield,
  CheckCircle,
  UserCheck,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { createProperty } from "@/utils/supabaseData";

// Enhanced validation schema for admin with additional fields
const adminListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().min(1000, "Price must be at least ₦1,000"),
  propertyType: z.string().min(1, "Property type is required"),
  listingType: z.enum(["sale", "rent"]),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or more"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or more"),
  squareFootage: z.number().min(100, "Square footage must be at least 100"),
  parkingSpaces: z.number().min(0, "Parking spaces must be 0 or more"),
  yearBuilt: z.number().min(1900).max(new Date().getFullYear()),
  // Address fields
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  // Contact
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  contactEmail: z.string().email("Valid email is required"),
  // Admin-specific fields
  assignedAgent: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["draft", "pending", "approved", "published", "archived"]),
  featured: z.boolean(),
  verified: z.boolean(),
  allowInstantBook: z.boolean(),
  negotiable: z.boolean(),
});

type AdminListingFormData = z.infer<typeof adminListingSchema>;

const propertyTypes = [
  "House", "Apartment", "Condo", "Townhouse", "Villa", "Duplex", 
  "Land", "Commercial", "Office", "Warehouse", "Shop", "Studio"
];

const amenitiesList = [
  "Swimming Pool", "Gym", "Parking", "Garden", "Balcony", "Air Conditioning",
  "Heating", "Fireplace", "Walk-in Closet", "Laundry Room", "Security System",
  "Elevator", "Concierge", "Rooftop Terrace", "Storage", "Pet Friendly",
  "Furnished", "High-Speed Internet", "Cable/Satellite TV", "Dishwasher",
  "Generator", "Solar Power", "Water Treatment", "CCTV", "Gated Community"
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", 
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

// Mock agents for dropdown
const availableAgents = [
  { id: "1", name: "John Okafor", email: "john@example.com" },
  { id: "2", name: "Mary Adebayo", email: "mary@example.com" },
  { id: "3", name: "David Okwu", email: "david@example.com" },
  { id: "4", name: "Sarah Usman", email: "sarah@example.com" },
];

export default function AdminCreateListing() {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AdminListingFormData>({
    resolver: zodResolver(adminListingSchema),
    defaultValues: {
      listingType: "sale",
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 0,
      yearBuilt: new Date().getFullYear(),
      priority: "medium",
      status: "draft",
      featured: false,
      verified: false,
      allowInstantBook: false,
      negotiable: true,
    }
  });

  const listingType = watch("listingType");
  const status = watch("status");
  const priority = watch("priority");

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 15)); // Max 15 images for admin
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AdminListingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Map admin form data to property format
      const propertyData = {
        title: data.title,
        description: data.description,
        price: data.price,
        property_type: data.propertyType,
        status: data.listingType === "sale" ? "For Sale" : "For Rent",
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        square_feet: data.squareFootage,
        year_built: data.yearBuilt,
        street: data.street,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        amenities: selectedAmenities,
        images: images.map(img => img.name), // TODO: Upload files to storage first
        featured: data.featured,
        agent_id: data.assignedAgent || null,
      };

      // Save to Supabase
      const createdProperty = await createProperty(propertyData);
      
      if (createdProperty) {
        const successMessage = data.status === "published" 
          ? "Property listing created and published successfully!"
          : "Property listing created successfully!";
        
        toast.success(successMessage);
        navigate("/admin-dashboard/properties");
      } else {
        throw new Error("Failed to create property");
      }
      
    } catch (error) {
      toast.error("Failed to create listing. Please try again.");
      console.error("Error creating listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "text-green-600 bg-green-50 border-green-200";
      case "approved": return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "draft": return "text-gray-600 bg-gray-50 border-gray-200";
      case "archived": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/admin-dashboard/properties")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin: Create New Listing
          </h1>
          <p className="text-muted-foreground">
            Create and manage property listings with administrative privileges
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Admin Controls */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Shield className="h-5 w-5" />
              Administrative Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="status">Listing Status</Label>
                <Select 
                  defaultValue="draft"
                  onValueChange={(value: "draft" | "pending" | "approved" | "published" | "archived") => setValue("status", value)}
                >
                  <SelectTrigger className={getStatusColor(status)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  defaultValue="medium"
                  onValueChange={(value: "low" | "medium" | "high" | "urgent") => setValue("priority", value)}
                >
                  <SelectTrigger className={getPriorityColor(priority)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignedAgent">Assign to Agent</Label>
                <Select onValueChange={(value) => setValue("assignedAgent", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          {agent.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Featured Listing
                </Label>
                <Switch
                  id="featured"
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  onCheckedChange={(checked) => setValue("verified", checked as boolean)}
                />
                <Label htmlFor="verified" className="text-sm">
                  <CheckCircle className="inline h-4 w-4 mr-1 text-green-600" />
                  Mark as Verified
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowInstantBook"
                  onCheckedChange={(checked) => setValue("allowInstantBook", checked as boolean)}
                />
                <Label htmlFor="allowInstantBook" className="text-sm">
                  Allow Instant Booking
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="negotiable"
                  defaultChecked
                  onCheckedChange={(checked) => setValue("negotiable", checked as boolean)}
                />
                <Label htmlFor="negotiable" className="text-sm">
                  Price Negotiable
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Luxury 4BR Villa in Lekki Phase 1"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select onValueChange={(value) => setValue("propertyType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p className="text-sm text-red-500 mt-1">{errors.propertyType.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Property Description *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Provide a detailed description of the property, highlighting key features, location benefits, and unique selling points..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="listingType">Listing Type *</Label>
                <Select 
                  defaultValue="sale"
                  onValueChange={(value: "sale" | "rent") => setValue("listingType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">
                  Price * ({listingType === "rent" ? "Monthly" : "Total"})
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">₦</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    className="pl-8"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <div className="relative">
                  <Bed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    className="pl-10"
                    {...register("bedrooms", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <div className="relative">
                  <Bath className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    className="pl-10"
                    {...register("bathrooms", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="squareFootage">Square Footage *</Label>
                <div className="relative">
                  <Square className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="squareFootage"
                    type="number"
                    placeholder="1200"
                    className="pl-10"
                    {...register("squareFootage", { valueAsNumber: true })}
                  />
                </div>
                {errors.squareFootage && (
                  <p className="text-sm text-red-500 mt-1">{errors.squareFootage.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="parkingSpaces"
                    type="number"
                    min="0"
                    className="pl-10"
                    {...register("parkingSpaces", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="yearBuilt">Year Built *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="yearBuilt"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="pl-10"
                    {...register("yearBuilt", { valueAsNumber: true })}
                  />
                </div>
                {errors.yearBuilt && (
                  <p className="text-sm text-red-500 mt-1">{errors.yearBuilt.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="e.g., 15 Victoria Island Close"
                {...register("street")}
              />
              {errors.street && (
                <p className="text-sm text-red-500 mt-1">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Lagos"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select onValueChange={(value) => setValue("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  placeholder="e.g., 100001"
                  {...register("zipCode")}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500 mt-1">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Property Amenities & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>

            {selectedAmenities.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Selected Amenities ({selectedAmenities.length}):</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Property Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="images">Upload Images (Max 15 for Admin)</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload high-quality images. First image will be the main photo. Admin accounts can upload up to 15 images.
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-1 left-1 text-xs bg-blue-600">
                        Main
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  placeholder="Property contact person"
                  {...register("contactName")}
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500 mt-1">{errors.contactName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  placeholder="+234 800 000 0000"
                  {...register("contactPhone")}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-500 mt-1">{errors.contactPhone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@example.com"
                  {...register("contactEmail")}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate("/admin-dashboard/properties")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Creating Listing..." : "Create Admin Listing"}
          </Button>
        </div>
      </form>
    </div>
  );
}
