
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building, ArrowRight } from "lucide-react";
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

  const recentSearches = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Miami, FL"];

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
      <div className="relative z-20 container-custom min-h-[650px] flex flex-col justify-center items-center text-center py-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-semibold text-white mb-6 animate-fade-up">
          Find Your <span className="text-realty-gold">Dream Home</span> Today
        </h1>
        <p className="text-white/80 max-w-2xl mb-10 text-lg md:text-xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Discover thousands of properties for sale and rent across the country. Let us help you find the perfect place to call home.
        </p>
        
        {/* Animated elements */}
        <div className="absolute hidden md:block top-40 -left-4 animate-bounce opacity-70">
          <div className="h-16 w-16 rounded-full bg-realty-gold/10 backdrop-blur-sm"></div>
        </div>
        <div className="absolute hidden md:block bottom-40 -right-10 animate-bounce opacity-70" style={{ animationDelay: "0.5s", animationDuration: "3s" }}>
          <div className="h-20 w-20 rounded-full bg-realty-gold/10 backdrop-blur-sm"></div>
        </div>
        
        {/* Search Form */}
        <div className="w-full max-w-4xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <form 
            onSubmit={handleSearch}
            className="bg-white dark:bg-realty-800 rounded-lg shadow-xl p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-realty-400" size={18} />
                  <Input
                    placeholder="Enter location, city, or ZIP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 border-realty-200 dark:border-realty-700"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="border-realty-200 dark:border-realty-700">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-realty-400" />
                      <SelectValue placeholder="Property type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-3">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="border-realty-200 dark:border-realty-700">
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
              
              <div className="md:col-span-1">
                <Button 
                  type="submit" 
                  className="w-full h-full bg-realty-800 hover:bg-realty-900 text-white dark:bg-realty-gold dark:text-realty-900 dark:hover:bg-realty-gold/90"
                >
                  <Search className="md:h-5 md:w-5" />
                  <span className="md:hidden ml-2">Search</span>
                </Button>
              </div>
            </div>
            
            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-realty-500 dark:text-realty-400">Popular:</span>
              {recentSearches.map((item, index) => (
                <button 
                  key={index}
                  type="button"
                  onClick={() => setLocation(item)}
                  className="text-sm px-3 py-1 rounded-full bg-realty-100 dark:bg-realty-700/30 text-realty-600 dark:text-realty-300 hover:bg-realty-200 dark:hover:bg-realty-700/50 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </form>
          
          {/* Quick links */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button 
              variant="link" 
              className="text-white hover:text-realty-gold transition-colors group flex items-center"
              onClick={() => navigate("/properties?status=For Sale")}
            >
              Browse Properties for Sale
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="link" 
              className="text-white hover:text-realty-gold transition-colors group flex items-center"
              onClick={() => navigate("/properties?status=For Rent")}
            >
              Explore Rental Properties
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
