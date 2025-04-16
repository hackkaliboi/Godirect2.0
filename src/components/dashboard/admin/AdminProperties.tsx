import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Filter, Loader2, Upload, Image, FileText, Edit, Trash2, Eye } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/utils/supabaseData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatPriceWithCommas } from "@/utils/data";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

// Helper function to parse CSV data
const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = lines[i].split(',').map(value => value.trim());
    const entry: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      // Convert numeric values
      if (['price', 'bedrooms', 'bathrooms', 'square_feet'].includes(header)) {
        entry[header] = parseFloat(values[index]) || 0;
      } else {
        entry[header] = values[index];
      }
    });
    
    // Add required fields if missing
    entry.created_at = entry.created_at || new Date().toISOString();
    entry.status = entry.status || 'For Sale';
    
    result.push(entry);
  }
  
  return result;
};

export default function AdminProperties() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Bulk upload state
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [csvTemplate, setCsvTemplate] = useState(
    "title,description,price,property_type,status,bedrooms,bathrooms,square_feet,street,city,state,zip_code\n" +
    "Luxury Villa,Beautiful luxury villa with ocean view,500000,Villa,For Sale,4,3,2500,123 Ocean Dr,Miami,FL,33139\n" +
    "Downtown Apartment,Modern apartment in downtown,300000,Apartment,For Sale,2,2,1200,456 Main St,New York,NY,10001"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Image upload state
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  // Fetch properties from Supabase
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, agents(name)");
      
      if (error) {
        throw error;
      }
      
      return data as (Property & { agents: { name: string } })[];
    }
  });

  // Filter properties based on search term and active tab
  const filteredProperties = properties?.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "for_sale") return matchesSearch && property.status === "For Sale";
    if (activeTab === "for_rent") return matchesSearch && property.status === "For Rent";
    if (activeTab === "sold") return matchesSearch && property.status === "Sold";
    
    return matchesSearch;
  });
  
  // Handle bulk upload
  const handleBulkUpload = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Parse CSV data
      const properties = parseCSV(csvTemplate);
      setUploadProgress(30);
      
      if (properties.length === 0) {
        throw new Error("No valid properties found in the CSV data");
      }
      
      // Upload each property
      let successCount = 0;
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        
        const { error } = await supabase
          .from('properties')
          .insert([property]);
        
        if (error) {
          console.error(`Error uploading property ${i + 1}:`, error);
        } else {
          successCount++;
        }
        
        // Update progress
        setUploadProgress(30 + Math.floor((i + 1) / properties.length * 60));
      }
      
      setUploadProgress(100);
      
      // Show success message
      toast.success(`${successCount} of ${properties.length} properties uploaded successfully`);
      
      // Refresh the properties list
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      
      // Close the dialog
      setIsBulkUploadOpen(false);
    } catch (error: any) {
      toast.error(`Failed to upload properties: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Handle image upload dialog open
  const handleOpenImageUpload = (propertyId: string, propertyTitle: string) => {
    setSelectedPropertyId(propertyId);
    setSelectedPropertyTitle(propertyTitle);
    setIsImageUploadOpen(true);
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedPropertyId || !selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select at least one image to upload");
      return;
    }
    
    try {
      setIsUploadingImages(true);
      setImageUploadProgress(10);
      
      const uploadPromises = Array.from(selectedFiles).map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedPropertyId}/${Date.now()}_${index}.${fileExt}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);
        
        // Update progress
        setImageUploadProgress(10 + Math.floor((index + 1) / selectedFiles.length * 80));
        
        return urlData.publicUrl;
      });
      
      const imageUrls = await Promise.all(uploadPromises);
      setImageUploadProgress(90);
      
      // In a real application, we would link images to property in the database
      // Since we don't have a property_images table yet, we'll just log the URLs
      console.log('Image URLs to be linked to property:', imageUrls);
      
      // Mock successful database operation
      const dbError = null;
      
      setImageUploadProgress(100);
      toast.success(`${imageUrls.length} images uploaded successfully`);
      
      // Reset state and close dialog
      setSelectedFiles(null);
      setIsImageUploadOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      toast.error(`Failed to upload images: ${error.message}`);
    } finally {
      setIsUploadingImages(false);
      setImageUploadProgress(0);
    }
  };

  // If loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If error
  if (error) {
    console.error("Error loading properties:", error);
    return (
      <div className="text-center">
        <p className="text-red-500">Failed to load properties. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage all property listings on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={() => navigate('/admin-dashboard/add-property')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Properties</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search properties..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="for_sale">For Sale</TabsTrigger>
              <TabsTrigger value="for_rent">For Rent</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="overflow-x-auto">
              {filteredProperties && filteredProperties.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Listed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-xs text-muted-foreground">{property.street}, {property.city}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatPriceWithCommas(property.price)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{property.bedrooms || 0} bd • {property.bathrooms || 0} ba • {property.square_feet || 0} sqft</p>
                            <p className="text-xs text-muted-foreground">{property.property_type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            property.status === "For Sale" ? "default" : 
                            property.status === "For Rent" ? "secondary" : "outline"
                          }>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{property.agents?.name || "Unassigned"}</TableCell>
                        <TableCell>{new Date(property.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <Link to={`/properties/${property.id}`}>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Remove Listing</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No properties match your search criteria." : "No properties found in the database."}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="for_sale">
              {filteredProperties && filteredProperties.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Listed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-xs text-muted-foreground">{property.street}, {property.city}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatPriceWithCommas(property.price)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{property.bedrooms || 0} bd • {property.bathrooms || 0} ba • {property.square_feet || 0} sqft</p>
                            <p className="text-xs text-muted-foreground">{property.property_type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{property.agents?.name || "Unassigned"}</TableCell>
                        <TableCell>{new Date(property.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <Link to={`/properties/${property.id}`}>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Remove Listing</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No properties for sale found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="for_rent">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">
                  {filteredProperties && filteredProperties.length > 0 
                    ? "Properties for rent would appear here" 
                    : "No properties for rent found"}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="sold">
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">
                  {filteredProperties && filteredProperties.length > 0 
                    ? "Sold properties would appear here" 
                    : "No sold properties found"}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Upload Properties</DialogTitle>
            <DialogDescription>
              Upload multiple properties using CSV format. Edit the template below or paste your own CSV data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="csv-template">CSV Template</Label>
              <Textarea
                id="csv-template"
                className="font-mono text-sm h-[200px]"
                value={csvTemplate}
                onChange={(e) => setCsvTemplate(e.target.value)}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                First row contains headers. Each subsequent row represents a property.
              </p>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Uploading properties... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Properties
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Upload Dialog */}
      <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Images</DialogTitle>
            <DialogDescription>
              Upload images for {selectedPropertyTitle}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="images">Select Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                ref={fileInputRef}
                disabled={isUploadingImages}
              />
              <p className="text-xs text-muted-foreground">
                You can select multiple images. Supported formats: JPG, PNG, GIF.
              </p>
            </div>
            
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="text-sm">
                {selectedFiles.length} file(s) selected
              </div>
            )}
            
            {isUploadingImages && (
              <div className="space-y-2">
                <Progress value={imageUploadProgress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Uploading images... {imageUploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageUploadOpen(false)} disabled={isUploadingImages}>
              Cancel
            </Button>
            <Button onClick={handleImageUpload} disabled={isUploadingImages || !selectedFiles || selectedFiles.length === 0}>
              {isUploadingImages ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Upload Images
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
