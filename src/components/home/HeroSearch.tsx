
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { propertyTypes, priceRanges } from "@/utils/data";

const HeroSearch = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query params based on the search criteria
    const params = new URLSearchParams();
    
    if (location) params.append("location", location);
    if (propertyType) params.append("type", propertyType);
    if (priceRange) params.append("price", priceRange);
    
    // Navigate to the properties page with search params
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000&auto=format&fit=crop')",
          height: "100%"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-realty-900/80 to-realty-900/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20 container-custom min-h-[600px] flex flex-col justify-center items-center text-center py-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-white mb-6 animate-fade-up">
          Find Your Dream Home Today
        </h1>
        <p className="text-white/80 max-w-2xl mb-10 text-lg md:text-xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Discover thousands of properties for sale and rent across the country. Let us help you find the perfect place to call home.
        </p>
        
        {/* Search Form */}
        <div className="w-full max-w-4xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <form 
            onSubmit={handleSearch}
            className="bg-white dark:bg-realty-800 rounded-lg shadow-lg p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-realty-400" size={18} />
                  <Input
                    placeholder="Enter location, city, or ZIP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="md:col-span-1">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-1">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-4">
                <Button 
                  type="submit" 
                  className="w-full bg-realty-800 hover:bg-realty-900 text-white"
                >
                  <Search className="mr-2" size={18} />
                  Search Properties
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
