
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Heart, Share, Printer, MapPin, Bed, Bath, Move, 
  CheckSquare, Calendar, Home, Phone, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPriceWithCommas } from "@/utils/data";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyPurchase from "@/components/properties/PropertyPurchase";
import { Helmet } from "react-helmet-async";
import { fetchPropertyById, Property } from "@/utils/supabaseData";
import { useQuery } from "@tanstack/react-query";

const PropertyDetails = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => id ? fetchPropertyById(id) : null,
    enabled: !!id
  });
  
  // If loading
  if (isLoading) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">
          Loading property information...
        </h2>
      </div>
    );
  }

  // Similar properties (excluding current property)
  const { data: similarProperties = [] } = useQuery({
    queryKey: ["similar-properties", property?.id, property?.property_type],
    queryFn: async () => {
      // For now, return empty array - you can implement fetchProperties later
      return [];
    },
    enabled: !!property
  });

  // If error
  if (error || !property) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">
          Property not found
        </h2>
        <p className="mb-8">The property you are looking for does not exist or has been removed.</p>
        <Link to="/properties">
          <Button>Back to Properties</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{property.title} | Godirect Realty</title>
        <meta name="description" content={property.description?.substring(0, 160) || ""} />
      </Helmet>
      
      <div className="bg-realty-50 dark:bg-realty-800/30 py-8">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="flex text-sm mb-4">
            <Link to="/" className="text-realty-600 dark:text-realty-400 hover:text-realty-900 dark:hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-realty-400">/</span>
            <Link to="/properties" className="text-realty-600 dark:text-realty-400 hover:text-realty-900 dark:hover:text-white">
              Properties
            </Link>
            <span className="mx-2 text-realty-400">/</span>
            <span className="text-realty-900 dark:text-white font-medium">
              {property.title}
            </span>
          </div>
          
          {/* Property header */}
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-semibold text-realty-900 dark:text-white mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-realty-600 dark:text-realty-400">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {property.street}, {property.city}, {property.state} {property.zip_code}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-3xl font-heading font-semibold text-realty-800 dark:text-realty-gold mb-1">
                {formatPriceWithCommas(property.price)}
              </div>
              <div className="text-realty-600 dark:text-realty-400 text-sm">
                {property.status}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              variant="outline"
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center"
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
          
          {/* Property gallery */}
          <PropertyGallery images={property.images} title={property.title} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property details */}
              <div className="bg-white dark:bg-realty-800 rounded-xl shadow p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-realty-50 dark:bg-realty-700/30 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto text-realty-800 dark:text-realty-300 mb-2" />
                    <div className="text-lg font-medium text-realty-900 dark:text-white">
                      {property.bedrooms || 0}
                    </div>
                    <div className="text-sm text-realty-600 dark:text-realty-400">
                      Bedrooms
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-realty-50 dark:bg-realty-700/30 rounded-lg">
                    <Bath className="h-6 w-6 mx-auto text-realty-800 dark:text-realty-300 mb-2" />
                    <div className="text-lg font-medium text-realty-900 dark:text-white">
                      {property.bathrooms || 0}
                    </div>
                    <div className="text-sm text-realty-600 dark:text-realty-400">
                      Bathrooms
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-realty-50 dark:bg-realty-700/30 rounded-lg">
                    <Move className="h-6 w-6 mx-auto text-realty-800 dark:text-realty-300 mb-2" />
                    <div className="text-lg font-medium text-realty-900 dark:text-white">
                      {property.square_feet || 0}
                    </div>
                    <div className="text-sm text-realty-600 dark:text-realty-400">
                      Sq Ft
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-realty-50 dark:bg-realty-700/30 rounded-lg">
                    <Home className="h-6 w-6 mx-auto text-realty-800 dark:text-realty-300 mb-2" />
                    <div className="text-lg font-medium text-realty-900 dark:text-white">
                      {property.property_type}
                    </div>
                    <div className="text-sm text-realty-600 dark:text-realty-400">
                      Property Type
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                  Description
                </h2>
                <p className="text-realty-600 dark:text-realty-300 whitespace-pre-line">
                  {property.description || 'No description available'}
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-realty-700">
                  <h2 className="text-xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                    Property Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-realty-800 dark:text-realty-300 mr-2" />
                      <span className="text-realty-600 dark:text-realty-400">
                        Year Built: 
                      </span>
                      <span className="ml-1 text-realty-900 dark:text-white">
                        {property.year_built || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Home className="h-5 w-5 text-realty-800 dark:text-realty-300 mr-2" />
                      <span className="text-realty-600 dark:text-realty-400">
                        Property Type: 
                      </span>
                      <span className="ml-1 text-realty-900 dark:text-white">
                        {property.property_type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tabs: Features, Location, etc. */}
              <Tabs defaultValue="features">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="features">Features & Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="floor-plan">Floor Plan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="mt-6 bg-white dark:bg-realty-800 rounded-xl shadow p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <CheckSquare className="h-5 w-5 text-realty-800 dark:text-realty-300 mr-2" />
                        <span className="text-realty-600 dark:text-realty-300">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="mt-6 bg-white dark:bg-realty-800 rounded-xl shadow p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                    Location
                  </h3>
                  <div className="aspect-[16/9] bg-realty-100 dark:bg-realty-700 rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-realty-500 dark:text-realty-300">
                      Map goes here
                    </div>
                  </div>
                  <div className="mt-4 text-realty-600 dark:text-realty-300">
                    <p>
                      {property.street}, {property.city}, {property.state} {property.zip_code}
                    </p>
                    <p className="mt-2">
                      Located in a prime neighborhood with easy access to schools, shopping centers, and public transportation.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="floor-plan" className="mt-6 bg-white dark:bg-realty-800 rounded-xl shadow p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                    Floor Plan
                  </h3>
                  <div className="aspect-[16/9] bg-realty-100 dark:bg-realty-700 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-realty-500 dark:text-realty-300">
                      Floor plan visualization would go here
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent info */}
              {property.agent_id && (
                <div className="bg-white dark:bg-realty-800 rounded-xl shadow p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src="/placeholder.svg" 
                      alt="Agent" 
                      className="w-16 h-16 rounded-full object-cover" 
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-heading font-semibold text-realty-900 dark:text-white">
                        Agent
                      </h3>
                      <p className="text-sm text-realty-500 dark:text-realty-400">
                        Real Estate Agent
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div 
                      className="flex items-center text-sm text-realty-600 dark:text-realty-300"
                    >
                      <Phone className="h-4 w-4 mr-2 text-realty-500" />
                      Contact agent for details
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-realty-800 hover:bg-realty-900 text-white">
                      Contact Agent
                    </Button>
                    <Button variant="outline" className="w-full">
                      Schedule Viewing
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Purchase Property */}
              <div className="bg-white dark:bg-realty-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                  Purchase This Property
                </h3>
                <p className="text-sm text-realty-600 dark:text-realty-400 mb-4">
                  Ready to make this property yours? Submit a purchase request and our team will guide you through the process.
                </p>
                <PropertyPurchase 
                  propertyId={property.id}
                  propertyTitle={property.title}
                  propertyPrice={property.price}
                />
              </div>
              
              {/* Mortgage Calculator */}
              <div className="bg-white dark:bg-realty-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 text-realty-900 dark:text-white">
                  Mortgage Calculator
                </h3>
                
                <div className="bg-realty-50 dark:bg-realty-700/30 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-realty-600 dark:text-realty-300">Principal & Interest</span>
                    <span className="font-medium text-realty-900 dark:text-white">$3,240/mo</span>
                  </div>
                  <div className="text-xs text-realty-500 dark:text-realty-400">
                    Based on 20% down payment, 30-year fixed rate mortgage at 3.25%
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Full Calculator
                </Button>
              </div>
            </div>
          </div>
          
          {/* Similar Properties */}
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-semibold mb-6 text-realty-900 dark:text-white">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
