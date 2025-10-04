import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Plus } from "lucide-react";
import { Property } from "@/types/database";

interface PropertyFormData {
    title: string;
    description: string;
    property_type: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    square_feet: string;
    lot_size: string;
    year_built: string;
    amenities: string[];
    features: string[];
    status: string;
    listing_type: string;
}

const PropertyListingForm = () => {
    const { user, userType } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<PropertyFormData>({
        title: "",
        description: "",
        property_type: "",
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "Nigeria",
        price: "",
        bedrooms: "",
        bathrooms: "",
        square_feet: "",
        lot_size: "",
        year_built: "",
        amenities: [],
        features: [],
        status: "available",
        listing_type: "sale"
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [customFeature, setCustomFeature] = useState("");
    const [isFeaturedRequest, setIsFeaturedRequest] = useState(false);

    const propertyTypes = [
        "House", "Apartment", "Condo", "Townhouse",
        "Commercial", "Land", "Duplex", "Penthouse"
    ];

    const states = [
        "Lagos", "Abuja", "Port Harcourt", "Enugu",
        "Calabar", "Kano", "Kaduna", "Akwa Ibom",
        "Anambra", "Ogun", "Oyo", "Rivers", "Delta",
        "Cross River", "Benue", "Plateau", "Kogi",
        "Nasarawa", "Niger", "Bauchi", "Sokoto"
    ];

    const amenitiesList = [
        "Parking", "Gym", "Swimming Pool", "Security",
        "Garden", "Balcony", "Furnished", "Air Conditioning",
        "Internet", "Laundry", "Pet Friendly", "Wheelchair Accessible",
        "Elevator", "Generator", "Solar Power", "CCTV",
        "Intercom", "Playground", "Club House", "Backup Water"
    ];

    const featuresList = [
        "Water Supply", "Electricity", "Good Road Access", "Near School",
        "Near Hospital", "Near Market", "Near Airport", "Near Railway",
        "Near Bus Stop", "Near Shopping Mall", "Near Park", "Near Beach",
        "Mountain View", "City View", "Water Front", "Gated Community",
        "New Construction", "Renovated", "Serviced", "Unserviced"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleFeatureToggle = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const handleAddCustomFeature = () => {
        if (customFeature.trim() && !formData.features.includes(customFeature.trim())) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, customFeature.trim()]
            }));
            setCustomFeature("");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newImages = [...images, ...files];
            setImages(newImages);

            // Create previews
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...previews]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        const newPreviews = [...imagePreviews];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const uploadImages = async () => {
        const imageUrls: string[] = [];

        for (const image of images) {
            const fileExt = image.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `property-images/${user?.id}/${fileName}`;

            const { data, error } = await supabase.storage
                .from('property-images')
                .upload(filePath, image);

            if (error) {
                console.error('Error uploading image:', error);
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('property-images')
                .getPublicUrl(filePath);

            imageUrls.push(publicUrl);
        }

        return imageUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.description || !formData.property_type ||
                !formData.street || !formData.city || !formData.state || !formData.price) {
                toast({
                    title: "Error",
                    description: "Please fill in all required fields",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Upload images if any
            let imageUrls: string[] = [];
            if (images.length > 0) {
                try {
                    imageUrls = await uploadImages();
                } catch (error) {
                    console.error("Error uploading images:", error);
                    toast({
                        title: "Error",
                        description: "Failed to upload images. Please try again.",
                        variant: "destructive"
                    });
                    setLoading(false);
                    return;
                }
            }

            // Create property listing
            const propertyData: any = {
                title: formData.title,
                description: formData.description,
                property_type: formData.property_type.toLowerCase(),
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zip_code,
                country: formData.country,
                price: parseFloat(formData.price),
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
                bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
                square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
                lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
                year_built: formData.year_built ? parseInt(formData.year_built) : null,
                amenities: formData.amenities,
                features: formData.features,
                images: imageUrls,
                owner_id: user?.id,
                status: "pending", // Start with pending approval
                is_featured: isFeaturedRequest, // Request featured status
                address: `${formData.street}, ${formData.city}, ${formData.state}`
            };

            const { data, error } = await supabase
                .from('properties')
                .insert([propertyData])
                .select();

            if (error) throw error;

            toast({
                title: "Success",
                description: "Property listing submitted successfully! It will be reviewed by our team."
            });

            // Reset form
            setFormData({
                title: "",
                description: "",
                property_type: "",
                street: "",
                city: "",
                state: "",
                zip_code: "",
                country: "Nigeria",
                price: "",
                bedrooms: "",
                bathrooms: "",
                square_feet: "",
                lot_size: "",
                year_built: "",
                amenities: [],
                features: [],
                status: "available",
                listing_type: "sale"
            });
            setImages([]);
            setImagePreviews([]);
            setIsFeaturedRequest(false);
        } catch (error) {
            console.error("Error submitting property:", error);
            toast({
                title: "Error",
                description: "Failed to submit property listing. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom py-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
                        List Your Property
                    </h1>
                    <p className="text-realty-600 dark:text-realty-300">
                        Fill out the form below to list your property directly on our platform
                    </p>
                </div>

                <Card className="border-realty-200 dark:border-realty-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-realty-900 dark:text-white">
                            Property Details
                        </CardTitle>
                        <CardDescription>
                            Provide detailed information about your property to attract potential buyers or renters
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Property Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Modern 3-Bedroom Apartment in Lekki"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="property_type">Property Type *</Label>
                                    <Select
                                        value={formData.property_type}
                                        onValueChange={(value) => handleSelectChange("property_type", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select property type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {propertyTypes.map(type => (
                                                <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your property in detail. Include information about the neighborhood, nearby amenities, and what makes this property special..."
                                    rows={4}
                                />
                            </div>

                            {/* Address Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-realty-900 dark:text-white">Address Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="street">Street Address *</Label>
                                        <Input
                                            id="street"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 123 Main Street"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Lagos"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State *</Label>
                                        <Select
                                            value={formData.state}
                                            onValueChange={(value) => handleSelectChange("state", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {states.map(state => (
                                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zip_code">ZIP Code</Label>
                                        <Input
                                            id="zip_code"
                                            name="zip_code"
                                            value={formData.zip_code}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 100001"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Nigeria"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Property Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-realty-900 dark:text-white">Property Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₦) *</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 50000000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bedrooms">Bedrooms</Label>
                                        <Input
                                            id="bedrooms"
                                            name="bedrooms"
                                            type="number"
                                            value={formData.bedrooms}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 3"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bathrooms">Bathrooms</Label>
                                        <Input
                                            id="bathrooms"
                                            name="bathrooms"
                                            type="number"
                                            step="0.5"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 2.5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="square_feet">Square Feet</Label>
                                        <Input
                                            id="square_feet"
                                            name="square_feet"
                                            type="number"
                                            value={formData.square_feet}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="lot_size">Lot Size (sq ft)</Label>
                                        <Input
                                            id="lot_size"
                                            name="lot_size"
                                            type="number"
                                            value={formData.lot_size}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 5000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="year_built">Year Built</Label>
                                        <Input
                                            id="year_built"
                                            name="year_built"
                                            type="number"
                                            value={formData.year_built}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 2010"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="listing_type">Listing Type</Label>
                                        <Select
                                            value={formData.listing_type}
                                            onValueChange={(value) => handleSelectChange("listing_type", value)}
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
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="space-y-2">
                                <Label>Amenities</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {amenitiesList.map(amenity => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`amenity-${amenity}`}
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={() => handleAmenityToggle(amenity)}
                                                className="h-4 w-4 text-realty-gold border-realty-300 rounded focus:ring-realty-gold"
                                            />
                                            <label
                                                htmlFor={`amenity-${amenity}`}
                                                className="text-sm text-realty-700 dark:text-realty-300"
                                            >
                                                {amenity}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-2">
                                <Label>Property Features</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {featuresList.map(feature => (
                                        <div key={feature} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`feature-${feature}`}
                                                checked={formData.features.includes(feature)}
                                                onChange={() => handleFeatureToggle(feature)}
                                                className="h-4 w-4 text-realty-gold border-realty-300 rounded focus:ring-realty-gold"
                                            />
                                            <label
                                                htmlFor={`feature-${feature}`}
                                                className="text-sm text-realty-700 dark:text-realty-300"
                                            >
                                                {feature}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Custom Feature Input */}
                                <div className="flex gap-2 mt-3">
                                    <Input
                                        value={customFeature}
                                        onChange={(e) => setCustomFeature(e.target.value)}
                                        placeholder="Add custom feature"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddCustomFeature}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Display custom features */}
                                {formData.features.filter(f => !featuresList.includes(f)).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.features.filter(f => !featuresList.includes(f)).map(feature => (
                                            <div key={feature} className="bg-realty-100 dark:bg-realty-800 px-2 py-1 rounded-full text-sm flex items-center">
                                                {feature}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        features: prev.features.filter(f => f !== feature)
                                                    }))}
                                                    className="ml-1 text-realty-500 hover:text-realty-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Property Images</Label>
                                <div className="border-2 border-dashed border-realty-300 dark:border-realty-700 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center gap-2 w-full h-full"
                                    >
                                        <Upload className="h-8 w-8 text-realty-500" />
                                        <span>Upload Images</span>
                                        <span className="text-xs text-realty-500">PNG, JPG up to 10MB</span>
                                    </Button>
                                </div>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Featured Listing Option */}
                            <div className="flex items-center space-x-2 p-4 bg-realty-50 dark:bg-realty-900/20 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="featured-request"
                                    checked={isFeaturedRequest}
                                    onChange={(e) => setIsFeaturedRequest(e.target.checked)}
                                    className="h-4 w-4 text-realty-gold border-realty-300 rounded focus:ring-realty-gold"
                                />
                                <label
                                    htmlFor="featured-request"
                                    className="text-sm font-medium text-realty-900 dark:text-white"
                                >
                                    Request Featured Listing (+₦50,000)
                                </label>
                                <p className="text-xs text-realty-600 dark:text-realty-400 ml-2">
                                    Get priority placement and increased visibility
                                </p>
                            </div>

                            {/* Benefits Section */}
                            <div className="bg-realty-50 dark:bg-realty-900/20 p-4 rounded-lg">
                                <h3 className="font-medium text-realty-900 dark:text-white mb-2">Direct Listing Benefits</h3>
                                <ul className="text-sm text-realty-600 dark:text-realty-400 space-y-1">
                                    <li>• Connect directly with interested buyers without intermediaries</li>
                                    <li>• Full control over your listing, pricing, and communication</li>
                                    <li>• Keep more of your sale proceeds with lower fees</li>
                                    <li>• Get featured placement to maximize visibility</li>
                                    <li>• Professional property showcase with multiple images</li>
                                </ul>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    className="bg-realty-gold hover:bg-realty-gold/90 text-realty-900 font-medium"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit Property"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PropertyListingForm;