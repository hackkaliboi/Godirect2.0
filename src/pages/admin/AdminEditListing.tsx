import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    Calendar,
    Loader2,
    Save
} from "lucide-react";
import { toast } from "sonner";
import { fetchPropertyById, updateProperty } from "@/utils/supabaseData";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/database";

// Enhanced validation schema for admin with additional fields
const adminListingSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    price: z.number().min(1000, "Price must be at least ₦1,000"),
    propertyType: z.string().min(1, "Property type is required"),
    bedrooms: z.number().min(0, "Bedrooms must be 0 or more"),
    bathrooms: z.number().min(0, "Bathrooms must be 0 or more"),
    squareFootage: z.number().min(100, "Square footage must be at least 100"),
    yearBuilt: z.number().min(1900).max(new Date().getFullYear()),
    // Address fields
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    // Admin-specific fields (only those that exist in database)
    status: z.enum(["draft", "pending", "approved", "published", "archived"]),
    featured: z.boolean(),
});

type AdminListingFormData = z.infer<typeof adminListingSchema>;

const propertyTypes = [
    "House", "Apartment", "Condo", "Townhouse", "Land", "Commercial"
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

export default function AdminEditListing() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<AdminListingFormData>({
        resolver: zodResolver(adminListingSchema),
        defaultValues: {
            bedrooms: 1,
            bathrooms: 1,
            yearBuilt: new Date().getFullYear(),
            status: "draft",
            featured: false,
        }
    });

    // Remove listingType and priority since they're not in the form schema
    const status = watch("status");

    useEffect(() => {
        if (id) {
            loadProperty(id);
        }
    }, [id]);

    const loadProperty = async (propertyId: string) => {
        try {
            setLoading(true);
            const propertyData = await fetchPropertyById(propertyId);

            if (propertyData) {
                setProperty(propertyData);
                setExistingImages(propertyData.images || []);
                setSelectedAmenities(propertyData.features || []);

                // Set form values - ONLY use fields that exist in the form schema
                setValue("title", propertyData.title);
                setValue("description", propertyData.description || "");
                setValue("price", propertyData.price);
                setValue("propertyType", propertyData.property_type);
                setValue("bedrooms", propertyData.bedrooms || 0);
                setValue("bathrooms", propertyData.bathrooms || 0);
                setValue("squareFootage", propertyData.square_feet || 0);
                setValue("yearBuilt", propertyData.year_built || new Date().getFullYear());

                // Extract address components from the full address field
                // The address field in the database contains the full address as a string
                const addressParts = (propertyData as any).address?.split(', ') || [];
                setValue("street", addressParts[0] || (propertyData as any).address || "");
                setValue("city", propertyData.city || addressParts[1] || "");
                setValue("state", propertyData.state || addressParts[2] || "");
                setValue("zipCode", propertyData.zip_code || "");

                // Map database status to form status
                const formStatus = propertyData.status === 'available' ? 'published' :
                    propertyData.status === 'pending' ? 'pending' :
                        propertyData.status === 'sold' ? 'archived' :
                            propertyData.status === 'rented' ? 'archived' :
                                propertyData.status === 'withdrawn' ? 'archived' : 'draft';
                setValue("status", formStatus as any);

                setValue("featured", propertyData.is_featured || false);
            }
        } catch (error) {
            console.error("Error loading property:", error);
            toast.error("Failed to load property data");
        } finally {
            setLoading(false);
        }
    };

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

    const removeImage = (index: number, isExisting: boolean = false) => {
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const removeExistingImage = (imageUrl: string) => {
        setExistingImages(prev => prev.filter(url => url !== imageUrl));
    };

    const onSubmit = async (data: AdminListingFormData) => {
        if (!id) return;

        setIsSubmitting(true);

        try {
            // Map the property type to match database constraints
            let propertyType = data.propertyType.toLowerCase();
            // Map unsupported types to supported ones
            switch (propertyType) {
                case "villa":
                case "duplex":
                case "studio":
                    propertyType = "house";
                    break;
                case "office":
                case "warehouse":
                case "shop":
                    propertyType = "commercial";
                    break;
                default:
                    // Keep the original value if it's already supported
                    break;
            }

            // Upload new images to Supabase storage
            const imageUrls: string[] = [...existingImages];
            if (images.length > 0) {
                for (const image of images) {
                    const fileExt = image.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

                    const { data: uploadData, error: uploadError } = await supabase
                        .storage
                        .from('property-images')
                        .upload(fileName, image, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (uploadError) {
                        console.error('Error uploading image:', uploadError);
                        toast.error(`Failed to upload image: ${uploadError.message}`);
                        continue; // Continue with other images
                    }

                    // Get public URL for the uploaded image
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('property-images')
                        .getPublicUrl(fileName);

                    imageUrls.push(publicUrl);
                }
            }

            // Map admin form status to database status
            let databaseStatus: Property['status'] = 'available';
            switch (data.status) {
                case 'draft':
                    databaseStatus = 'available';
                    break;
                case 'pending':
                    databaseStatus = 'pending';
                    break;
                case 'approved':
                    databaseStatus = 'available';
                    break;
                case 'published':
                    databaseStatus = 'available';
                    break;
                case 'archived':
                    databaseStatus = 'withdrawn';
                    break;
                default:
                    databaseStatus = 'available';
            }

            // Map admin form data to property format - ONLY include fields that exist in the database
            const propertyData = {
                title: data.title,
                description: data.description,
                price: data.price,
                property_type: propertyType,
                status: databaseStatus,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                square_feet: data.squareFootage,
                year_built: data.yearBuilt,
                address: `${data.street}, ${data.city}, ${data.state}`, // Combine address fields
                city: data.city,
                state: data.state,
                zip_code: data.zipCode,
                country: "NG",
                features: selectedAmenities,
                amenities: selectedAmenities,
                images: imageUrls,
                is_featured: data.featured,
                owner_id: property?.owner_id || null,
            };

            console.log("Sending property data to updateProperty:", propertyData);

            // Update in Supabase
            const updatedProperty = await updateProperty(id, propertyData);

            if (updatedProperty) {
                const successMessage = data.status === "published"
                    ? "Property listing updated and published successfully!"
                    : "Property listing updated successfully!";

                toast.success(successMessage);
                navigate("/dashboard/admin/properties");
            } else {
                throw new Error("Failed to update property - no data returned");
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            toast.error(`Failed to update listing: ${errorMessage}. Please try again.`);
            console.error("Error updating listing:", error);
        } finally {
            setIsSubmitting(false);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">Property not found</div>
                <Button onClick={() => navigate("/dashboard/admin/properties")}>Back to Properties</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/dashboard/admin/properties")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Properties
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="h-8 w-8 text-primary" />
                        Admin: Edit Listing
                    </h1>
                    <p className="text-muted-foreground">
                        Edit and manage property listings with administrative privileges
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="status">Listing Status</Label>
                                <Select
                                    value={status}
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

                            <div className="flex items-center space-x-2">
                                <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Featured Listing
                                </Label>
                                <Switch
                                    id="featured"
                                    checked={watch("featured")}
                                    onCheckedChange={(checked) => setValue("featured", checked)}
                                />
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
                                    {...register("title")}
                                    placeholder="Modern 3-bedroom apartment in prime location"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="price">Price (₦) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    {...register("price", { valueAsNumber: true })}
                                    placeholder="5000000"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                {...register("description")}
                                placeholder="Detailed description of the property..."
                                className="min-h-[120px]"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="propertyType">Property Type *</Label>
                                <Select
                                    value={watch("propertyType")}
                                    onValueChange={(value) => setValue("propertyType", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes.map((type) => (
                                            <SelectItem key={type} value={type.toLowerCase()}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.propertyType && (
                                    <p className="text-sm text-red-500 mt-1">{errors.propertyType.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="bedrooms">Bedrooms</Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    {...register("bedrooms", { valueAsNumber: true })}
                                    min="0"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bathrooms">Bathrooms</Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    step="0.5"
                                    {...register("bathrooms", { valueAsNumber: true })}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="squareFootage">Square Footage</Label>
                                <Input
                                    id="squareFootage"
                                    type="number"
                                    {...register("squareFootage", { valueAsNumber: true })}
                                    min="100"
                                />
                                {errors.squareFootage && (
                                    <p className="text-sm text-red-500 mt-1">{errors.squareFootage.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="yearBuilt">Year Built</Label>
                                <Input
                                    id="yearBuilt"
                                    type="number"
                                    {...register("yearBuilt", { valueAsNumber: true })}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                                {errors.yearBuilt && (
                                    <p className="text-sm text-red-500 mt-1">{errors.yearBuilt.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Address Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Address Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="street">Street Address *</Label>
                            <Input
                                id="street"
                                {...register("street")}
                                placeholder="123 Main Street"
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
                                    {...register("city")}
                                    placeholder="Lagos"
                                />
                                {errors.city && (
                                    <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="state">State *</Label>
                                <Select
                                    value={watch("state")}
                                    onValueChange={(value) => setValue("state", value)}
                                >
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
                                <Label htmlFor="zipCode">ZIP Code</Label>
                                <Input
                                    id="zipCode"
                                    {...register("zipCode")}
                                    placeholder="100001"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Property Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {amenitiesList.map((amenity) => (
                                <div key={amenity} className="flex items-center">
                                    <Checkbox
                                        id={amenity}
                                        checked={selectedAmenities.includes(amenity)}
                                        onCheckedChange={() => handleAmenityToggle(amenity)}
                                    />
                                    <Label
                                        htmlFor={amenity}
                                        className="ml-2 text-sm font-normal cursor-pointer"
                                    >
                                        {amenity}
                                    </Label>
                                </div>
                            ))}
                        </div>
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
                    <CardContent>
                        <div className="space-y-4">
                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Existing Images</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {existingImages.map((imageUrl, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Property ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeExistingImage(imageUrl)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            {images.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-2">New Images</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`New property ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="imageUpload" className="block text-sm font-medium mb-2">
                                    Add More Images
                                </Label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById("imageUpload")?.click()}
                                    disabled={existingImages.length + images.length >= 15}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Upload Images
                                </Button>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Upload up to {15 - (existingImages.length + images.length)} more images
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} size="lg">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Update Listing
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
