import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageSlider from "@/components/ui/slider/ImageSlider";
import { searchHistoryApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const HeroSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<{ label: string }[]>([]);

  // Fetch property types and price ranges on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property types
        const { data: typesData, error: typesError } = await supabase
          .from("properties")
          .select("property_type");

        if (typesError) {
          console.error("Error fetching property types:", typesError);
        } else {
          // Extract unique property types
          const uniqueTypes = [...new Set(typesData.map(item => item.property_type))];
          setPropertyTypes(uniqueTypes.filter(type => type !== null && type !== undefined) as string[]);
        }

        // Fetch price ranges
        const { data: priceData, error: priceError } = await supabase
          .from("properties")
          .select("price");

        if (priceError) {
          console.error("Error fetching price ranges:", priceError);
        } else {
          if (priceData && priceData.length > 0) {
            // Calculate min and max prices
            const prices = priceData.map(item => item.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            // Create price ranges based on the data
            const ranges = [];

            // For Nigerian properties, we'll create ranges in millions of Naira
            const rangeSize = 50000000; // 50 million Naira increments
            let currentMin = Math.floor(minPrice / rangeSize) * rangeSize;

            while (currentMin <= maxPrice) {
              const currentMax = currentMin + rangeSize - 1;
              const count = prices.filter(price => price >= currentMin && price <= currentMax).length;

              if (count > 0) {
                // Format the label
                const minLabel = currentMin >= 1000000 ? `${(currentMin / 1000000).toFixed(0)}M` : currentMin.toLocaleString();
                const maxLabel = currentMax >= 1000000 ? `${(currentMax / 1000000).toFixed(0)}M` : currentMax.toLocaleString();
                ranges.push({
                  label: `₦${minLabel} - ₦${maxLabel}`
                });
              }

              currentMin += rangeSize;
            }

            setPriceRanges(ranges);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Define slider images
  const sliderImages = [
    "/hero-section/nigeria-city-1.png",
    "/hero-section/nigeria-city-2.png",
    "/hero-section/nigeria-city-3.png",
    "/hero-section/nigeria-city-4.png"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query params based on the search criteria
    const params = new URLSearchParams();

    if (location) params.append("location", location);
    if (propertyType) params.append("type", propertyType);

    // Parse price range if selected
    if (priceRange) {
      // Extract min and max values from the price range label
      // Expected format: "₦5M - ₦10M" or "₦1000000 - ₦5000000"
      const priceMatch = priceRange.match(/₦([\d.]+[Mm]?)[\s]*-[\s]*₦([\d.]+[Mm]?)/i);
      if (priceMatch) {
        let minPrice = priceMatch[1];
        let maxPrice = priceMatch[2];

        // Convert M suffix to actual numbers
        if (minPrice.toLowerCase().endsWith('m')) {
          minPrice = (parseFloat(minPrice) * 1000000).toString();
        } else {
          minPrice = minPrice.replace(/[^\d]/g, ''); // Remove any non-digit characters except decimal
        }

        if (maxPrice.toLowerCase().endsWith('m')) {
          maxPrice = (parseFloat(maxPrice) * 1000000).toString();
        } else {
          maxPrice = maxPrice.replace(/[^\d]/g, ''); // Remove any non-digit characters except decimal
        }

        params.append("price_min", minPrice);
        params.append("price_max", maxPrice);
      }
    }

    // Navigate to the properties page with search params
    navigate(`/properties?${params.toString()}`);

    // Save search to history if user is logged in
    if (user) {
      const searchFilters = {
        property_type: propertyType || null,
        price_range: priceRange || null
      };

      // Save to search history (non-blocking)
      searchHistoryApi.saveSearchToHistory(location, searchFilters);
    }
  };

  const recentSearches = ["Lagos, Nigeria", "Enugu, Nigeria", "Calabar, Nigeria", "Abuja, Nigeria"];

  return (
    <div className="relative w-full">
      {/* Image Slider - This should be the background */}
      <div className="absolute inset-0 z-0">
        <ImageSlider
          images={sliderImages}
          autoPlay={true}
          autoPlayInterval={7000}
          showIndicators={true}
          showArrows={false}
          height="h-full"
        />
      </div>

      {/* Enhanced Overlay with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-realty-900/90 via-realty-800/70 to-realty-900/60 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-realty-900/10 to-realty-900/30 z-10" />

      {/* Content - This should be on top */}
      <div className="relative z-20 container-custom min-h-[700px] flex flex-col justify-center items-center text-center py-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-white mb-6 animate-fade-up tracking-tight">
          Find Your <span className="text-realty-gold relative inline-block">
            <span className="relative z-10">Dream Home</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
          </span> Today
        </h1>
        <p className="text-white/90 max-w-2xl mb-10 text-lg md:text-xl animate-fade-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
          Discover thousands of properties for sale and rent across the country. Let us help you find the perfect place to call home.
        </p>

        {/* Enhanced Animated elements - fixed z-index values */}
        <div className="absolute hidden md:block top-40 -left-4 animate-bounce opacity-70" style={{ zIndex: 30 }}>
          <div className="h-16 w-16 rounded-full bg-realty-gold/20 backdrop-blur-sm border border-realty-gold/30"></div>
        </div>
        <div className="absolute hidden md:block bottom-40 -right-10 animate-bounce opacity-70" style={{ zIndex: 30, animationDelay: "0.5s", animationDuration: "3s" }}>
          <div className="h-20 w-20 rounded-full bg-realty-gold/20 backdrop-blur-sm border border-realty-gold/30"></div>
        </div>
        <div className="absolute hidden md:block top-1/4 right-20 animate-pulse opacity-50" style={{ zIndex: 30, animationDuration: "4s" }}>
          <div className="h-24 w-24 rounded-full bg-realty-gold/10 backdrop-blur-sm border border-realty-gold/20"></div>
        </div>
        <div className="absolute hidden md:block bottom-1/3 left-16 animate-pulse opacity-40" style={{ zIndex: 30, animationDuration: "5s" }}>
          <div className="h-32 w-32 rounded-full bg-realty-gold/5 backdrop-blur-sm border border-realty-gold/10"></div>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-4xl animate-fade-up" style={{ zIndex: 30, animationDelay: "0.2s" }}>
          <form
            onSubmit={handleSearch}
            className="bg-white/95 dark:bg-realty-800/95 backdrop-blur-md rounded-xl shadow-2xl p-4 md:p-6 border border-white/20 dark:border-realty-700/20 transition-all duration-300 hover:shadow-realty-gold/10"
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
                    {priceRanges.map((range, index) => (
                      <SelectItem key={index} value={range.label}>
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
            <div className="mt-4 flex flex-wrap items-center gap-2 animate-fade-up" style={{ animationDelay: "0.3s" }}>
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
          <div className="mt-6 flex flex-wrap justify-center gap-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button
              variant="link"
              className="text-white hover:text-realty-gold transition-colors group flex items-center relative overflow-hidden"
              onClick={() => navigate("/properties?status=For Sale")}
            >
              <span className="relative z-10">Browse Properties for Sale</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-realty-gold group-hover:w-full transition-all duration-300"></span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="link"
              className="text-white hover:text-realty-gold transition-colors group flex items-center relative overflow-hidden"
              onClick={() => navigate("/properties?status=For Rent")}
            >
              <span className="relative z-10">Explore Rental Properties</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-realty-gold group-hover:w-full transition-all duration-300"></span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;