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
import { Separator } from "@/components/ui/separator";
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
  X
} from "lucide-react";
import { toast } from "sonner";
import { createProperty } from "@/utils/supabaseData";

// Validation schema
const listingSchema = z.object({
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
});

type ListingFormData = z.infer<typeof listingSchema>;

const propertyTypes = [
  "House", "Apartment", "Condo", "Townhouse", "Villa", "Duplex",
  "Land", "Commercial", "Office", "Warehouse", "Shop"
];

const amenitiesList = [
  "Swimming Pool", "Gym", "Parking", "Garden", "Balcony", "Air Conditioning",
  "Heating", "Fireplace", "Walk-in Closet", "Laundry Room", "Security System",
  "Elevator", "Concierge", "Rooftop Terrace", "Storage", "Pet Friendly",
  "Furnished", "High-Speed Internet", "Cable/Satellite TV", "Dishwasher"
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function CreateListing() {
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
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      listingType: "sale",
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 0,
      yearBuilt: new Date().getFullYear()
    }
  });

  const listingType = watch("listingType");
  const propertyType = watch("propertyType");

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 10)); // Max 10 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);

    try {
      console.log("Form data:", data);
      console.log("Selected amenities:", selectedAmenities);

      // Map form data to property format
      const propertyData = {
        title: data.title,
        description: data.description,
        price: data.price,
        property_type: data.propertyType.toLowerCase(), // Use property_type instead of type
        status: "available", // Use 'available' status
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        square_feet: data.squareFootage,
        year_built: data.yearBuilt,
        street: data.street, // Use street instead of address
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        country: "NG", // Add country field
        features: selectedAmenities,
        amenities: selectedAmenities, // Add amenities field
        images: [], // Start with empty array for now
        is_featured: false, // User listings are not featured by default
        owner_id: null, // Add owner_id field
      };

      console.log("Property data to be sent:", propertyData);

      // Save to Supabase
      const createdProperty = await createProperty(propertyData);

      if (createdProperty) {
        toast.success("Property listing created successfully! It will be reviewed before going live.");
        navigate("/dashboard/listings"); // Update navigation path
      } else {
        throw new Error("Failed to create property");
      }

    } catch (error) {
      console.error("Detailed error creating listing:", error);
      if (error instanceof Error) {
        toast.error(`Failed to create listing: ${error.message}`);
      } else {
        toast.error("Failed to create listing. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
              onClick={() => navigate("/dashboard/listings")} // Update navigation path
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Create New Listing
          </h1>
          <p className="text-muted-foreground">
            Add a new property to your portfolio
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="e.g., Beautiful 3BR Home in Victoria Island"
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe the property features, location benefits, and what makes it special..."
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
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    className="pl-10"
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
                <Input
                  id="yearBuilt"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  {...register("yearBuilt", { valueAsNumber: true })}
                />
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
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="e.g., 123 Lagos Street"
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
            <CardTitle>Amenities & Features</CardTitle>
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
                <h4 className="text-sm font-medium mb-2">Selected Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
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
              <Label htmlFor="images">Upload Images (Max 10)</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload high-quality images of your property. The first image will be used as the main photo.
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      <Badge className="absolute bottom-1 left-1 text-xs">
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
                  placeholder="Owner name"
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
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="owner@example.com"
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
            onClick={() => navigate("/dashboard/listings")} // Update navigation path
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Creating Listing..." : "Create Listing"}
          </Button>
        </div>
      </form>
    </div>
  );
}