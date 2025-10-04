import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PropertyListingForm = () => {
    const { user, userType } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        property_type: "",
        location: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        square_feet: "",
        amenities: [] as string[],
        status: "available"
    });

    const propertyTypes = [
        "House", "Apartment", "Condo", "Townhouse",
        "Commercial", "Land", "Duplex", "Penthouse"
    ];

    const locations = [
        "Lagos", "Abuja", "Port Harcourt", "Enugu",
        "Calabar", "Kano", "Kaduna", "Akwa Ibom",
        "Anambra", "Ogun"
    ];

    const amenitiesList = [
        "Parking", "Gym", "Swimming Pool", "Security",
        "Garden", "Balcony", "Furnished", "Air Conditioning",
        "Internet", "Laundry", "Pet Friendly", "Wheelchair Accessible"
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.description || !formData.property_type ||
                !formData.location || !formData.price) {
                toast({
                    title: "Error",
                    description: "Please fill in all required fields",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }

            // Create property listing
            const { data, error } = await supabase
                .from('properties')
                .insert([
                    {
                        ...formData,
                        price: parseFloat(formData.price),
                        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
                        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
                        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
                        amenities: formData.amenities,
                        agent_id: user?.id,
                        owner_id: user?.id,
                        status: "pending" // Start with pending approval
                    }
                ])
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
                location: "",
                price: "",
                bedrooms: "",
                bathrooms: "",
                square_feet: "",
                amenities: [],
                status: "available"
            });
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
                        Fill out the form below to list your property on our platform
                    </p>
                </div>

                <Card className="border-realty-200 dark:border-realty-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-realty-900 dark:text-white">
                            Property Details
                        </CardTitle>
                        <CardDescription>
                            Provide detailed information about your property
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your property in detail..."
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Select
                                        value={formData.location}
                                        onValueChange={(value) => handleSelectChange("location", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map(location => (
                                                <SelectItem key={location} value={location}>{location}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Bathrooms</Label>
                                    <Input
                                        id="bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        value={formData.bathrooms}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2"
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

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                            <SelectItem value="rented">Rented</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Amenities</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {amenitiesList.map(amenity => (
                                        <div key={amenity} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={amenity}
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={() => handleAmenityToggle(amenity)}
                                                className="h-4 w-4 text-realty-gold border-realty-300 rounded focus:ring-realty-gold"
                                            />
                                            <label
                                                htmlFor={amenity}
                                                className="text-sm text-realty-700 dark:text-realty-300"
                                            >
                                                {amenity}
                                            </label>
                                        </div>
                                    ))}
                                </div>
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