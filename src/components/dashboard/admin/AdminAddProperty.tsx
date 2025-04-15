import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminAddProperty() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("For Sale");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!title || !description || !propertyType || !price || !street || !city) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Insert property into Supabase
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            title,
            description,
            property_type: propertyType,
            status,
            price: parseFloat(price),
            bedrooms: bedrooms ? parseInt(bedrooms) : null,
            bathrooms: bathrooms ? parseFloat(bathrooms) : null,
            square_feet: squareFeet ? parseInt(squareFeet) : null,
            street,
            city,
            state,
            zip_code: zipCode
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Property added successfully",
        description: "Your new property has been added to the listings"
      });
      
      // Navigate back to properties list
      navigate('/admin-dashboard/properties');
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Failed to add property",
        description: "An error occurred while adding the property",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
        actionLabel="Back to Properties"
        actionIcon={<ArrowLeft className="h-4 w-4" />}
        onAction={() => navigate('/admin-dashboard/properties')}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Property Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. Luxury 3 Bedroom Apartment" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Detailed description of the property..." 
                        className="min-h-[120px]" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="property-type">Property Type *</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                          <SelectTrigger id="property-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Condo">Condo</SelectItem>
                            <SelectItem value="Townhouse">Townhouse</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Listing Status *</Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="For Sale">For Sale</SelectItem>
                            <SelectItem value="For Rent">For Rent</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₦) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        min="0" 
                        placeholder="Property price" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input 
                          id="bedrooms" 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input 
                          id="bathrooms" 
                          type="number" 
                          min="0" 
                          step="0.5" 
                          placeholder="0" 
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="square-feet">Square Feet</Label>
                        <Input 
                          id="square-feet" 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          value={squareFeet}
                          onChange={(e) => setSquareFeet(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input 
                        id="street" 
                        placeholder="e.g. 123 Main St" 
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        placeholder="e.g. Lagos" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input 
                        id="state" 
                        placeholder="e.g. Lagos State" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zip-code">Postal/ZIP Code</Label>
                      <Input 
                        id="zip-code" 
                        placeholder="e.g. 100001" 
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Property Features</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="feature-ac" />
                          <Label htmlFor="feature-ac">Air Conditioning</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="feature-parking" />
                          <Label htmlFor="feature-parking">Parking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="feature-pool" />
                          <Label htmlFor="feature-pool">Swimming Pool</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="feature-security" />
                          <Label htmlFor="feature-security">Security</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-4 pt-4">
              <Separator />
              
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I confirm that I have the right to list this property and all information provided is accurate
                </Label>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/admin-dashboard/properties')}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> 
                      Add Property
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
