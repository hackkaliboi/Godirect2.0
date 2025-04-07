
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";

// Mock property data for edit mode - in a real app, this would come from an API
const propertyData = {
  "1": {
    id: "1",
    title: "3-Bedroom Modern Apartment",
    type: "Apartment",
    description: "Beautiful and spacious 3-bedroom apartment in downtown area, featuring modern amenities, open floor plan, and fantastic city views.",
    location: "Downtown Area",
    address: "123 Main Street, Downtown Area, City",
    price: 285000,
    status: "Completed",
    verificationStatus: "Verified",
    date: "2025-03-15",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    features: ["Central Air", "Balcony", "In-unit Laundry", "Fitness Center", "Storage Unit"],
  },
  "2": {
    id: "2",
    title: "Land Plot (500 sqm)",
    type: "Land",
    description: "Prime 500 square meter land plot in fast-developing Greenfield Suburb. Ideal for residential construction with all utilities available at the property line.",
    location: "Greenfield Suburb",
    address: "Lot 45, Greenfield Development, Suburb",
    price: 120000,
    status: "In Progress",
    verificationStatus: "Under Review",
    date: "2025-04-01",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    ],
    squareFeet: 5000,
    features: ["Corner Lot", "Utilities Available", "Clear Title", "No Liens"],
  }
};

// List of common features by property type
const featuresByType = {
  Apartment: [
    "Central Air", "Balcony", "In-unit Laundry", "Fitness Center", "Storage Unit",
    "Elevator", "Parking Space", "Pet Friendly", "Security System", "Swimming Pool"
  ],
  House: [
    "Garage", "Backyard", "Fireplace", "Basement", "Porch", 
    "Central Air", "Deck", "Security System", "Garden", "Smart Home"
  ],
  Land: [
    "Corner Lot", "Utilities Available", "Clear Title", "No Liens", "Road Access",
    "Water Rights", "Flat Terrain", "Mountain View", "River Frontage", "Ocean View"
  ],
  Commercial: [
    "ADA Compliant", "Loading Dock", "Reception Area", "Sprinkler System", "Security System",
    "Elevator", "Open Floor Plan", "Storage Space", "Kitchen", "Conference Room"
  ]
};

export default function UserPropertyForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Initialize form state with existing data or defaults
  const initialProperty = isEditMode 
    ? propertyData[id as keyof typeof propertyData] 
    : {
        title: "",
        type: "",
        description: "",
        location: "",
        address: "",
        price: 0,
        images: [] as string[],
        bedrooms: 0,
        bathrooms: 0,
        squareFeet: 0,
        features: [] as string[],
      };
  
  const [formData, setFormData] = useState(initialProperty);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState(
    formData.type ? featuresByType[formData.type as keyof typeof featuresByType] : []
  );
  
  if (isEditMode && !initialProperty) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => navigate('/user-dashboard/properties')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Properties
        </Button>
        <div className="flex items-center justify-center h-64 mt-8">
          <div className="text-center">
            <h3 className="text-lg font-medium">Property Not Found</h3>
            <p className="mt-1 text-muted-foreground">The property you're trying to edit doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "bedrooms" || name === "bathrooms" || name === "squareFeet") {
      setFormData({
        ...formData,
        [name]: Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
      features: [] // Reset features when type changes
    });
    setAvailableFeatures(featuresByType[value as keyof typeof featuresByType] || []);
  };
  
  const handleFeatureToggle = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter(f => f !== feature)
        : [...formData.features, feature]
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...filesArray]);
      
      // Create preview URLs
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...newImages]
      });
    }
  };
  
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    const updatedFiles = [...imageFiles];
    updatedFiles.splice(index, 1);
    
    setFormData({
      ...formData,
      images: updatedImages
    });
    setImageFiles(updatedFiles);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to an API
    console.log('Form submitted:', formData);
    
    toast({
      title: isEditMode ? "Property updated successfully" : "Property listed successfully",
      description: "Your property has been submitted for verification.",
    });
    
    navigate('/user-dashboard/properties');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Button variant="outline" onClick={() => navigate('/user-dashboard/properties')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Properties
          </Button>
          <h1 className="text-3xl font-bold">{isEditMode ? "Edit Property" : "List New Property"}</h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? "Update your property information below" 
              : "Fill out the form below to list a new property for sale"}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="Enter a descriptive title" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Commercial">Commercial Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description} 
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the property"
                    rows={4} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location/Area</Label>
                    <Input 
                      id="location" 
                      name="location"
                      value={formData.location} 
                      onChange={handleChange}
                      placeholder="e.g., Downtown, Suburbs" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input 
                      id="price" 
                      name="price"
                      type="number"
                      value={formData.price || ''} 
                      onChange={handleChange}
                      placeholder="Property price" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={formData.address} 
                    onChange={handleChange}
                    placeholder="Enter the property's full address" 
                    required 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {(formData.type === "Apartment" || formData.type === "House") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input 
                          id="bedrooms" 
                          name="bedrooms"
                          type="number"
                          value={formData.bedrooms || ''} 
                          onChange={handleChange}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input 
                          id="bathrooms" 
                          name="bathrooms"
                          type="number"
                          value={formData.bathrooms || ''} 
                          onChange={handleChange}
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="squareFeet">Size (sq ft)</Label>
                    <Input 
                      id="squareFeet" 
                      name="squareFeet"
                      type="number"
                      value={formData.squareFeet || ''} 
                      onChange={handleChange}
                      min="0"
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Features & Amenities</Label>
                  {formData.type ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableFeatures.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`feature-${feature}`}
                            checked={formData.features.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <Label htmlFor={`feature-${feature}`} className="font-normal">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Select a property type to see available features</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Listing Type</Label>
                  <RadioGroup defaultValue="sale" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sale" id="sale" />
                      <Label htmlFor="sale" className="font-normal">For Sale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="rent" />
                      <Label htmlFor="rent" className="font-normal">For Rent</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {formData.images?.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden">
                      <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="aspect-square border-2 border-dashed rounded-md flex items-center justify-center">
                    <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center p-4">
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-center text-muted-foreground">Upload Image</span>
                      <Input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only" 
                        multiple
                      />
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload high-quality images of the property. First image will be used as the cover.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button type="button" variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Property Documents
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Upload property documents such as title deeds, floor plans, permits, etc.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="sticky bottom-4 bg-background pt-4">
              <Button type="submit" className="w-full">
                {isEditMode ? "Update Property" : "Submit Property"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Your property will be reviewed by our agents before being listed publicly.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
