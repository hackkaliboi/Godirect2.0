
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "../properties/PropertyCard";
import { fetchFeaturedProperties, Property } from "@/utils/supabaseData";

const FeaturedListings = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 3;

  useEffect(() => {
    const getProperties = async () => {
      setIsLoading(true);
      const data = await fetchFeaturedProperties();
      setFeaturedProperties(data);
      setIsLoading(false);
    };
    
    getProperties();
  }, []);

  const totalProperties = featuredProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalProperties / itemsPerPage));

  const handlePrev = () => {
    setCurrentIndex(prev => 
      prev === 0 ? totalPages - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
      prev === totalPages - 1 ? 0 : prev + 1
    );
  };

  const currentProperties = () => {
    if (featuredProperties.length === 0) return [];
    
    const start = (currentIndex * itemsPerPage) % totalProperties;
    const end = Math.min(start + itemsPerPage, totalProperties);
    
    if (start < end) {
      return featuredProperties.slice(start, end);
    } else {
      // Handle wrap around case
      const firstPart = featuredProperties.slice(start);
      const secondPart = featuredProperties.slice(0, end - totalProperties);
      return [...firstPart, ...secondPart];
    }
  };

  return (
    <section className="section-padding bg-white dark:bg-realty-900">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="text-3xl font-heading font-semibold mb-2 text-realty-900 dark:text-white">
              Featured Properties
            </h2>
            <p className="text-realty-600 dark:text-realty-300 max-w-2xl">
              Discover our handpicked selection of properties that stand out for their quality, location, and value.
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="hidden md:flex items-center space-x-2 mr-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex 
                      ? "w-6 bg-realty-800 dark:bg-realty-gold" 
                      : "w-2 bg-realty-300 dark:bg-realty-700"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrev}
                className="rounded-full"
                aria-label="Previous properties"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNext}
                className="rounded-full"
                aria-label="Next properties"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-realty-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentProperties().map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-heading font-semibold mb-2 text-realty-900 dark:text-white">
              No featured properties
            </h3>
            <p className="text-realty-600 dark:text-realty-400 mb-6">
              There are currently no featured properties available.
            </p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/properties">
            <Button 
              variant="outline" 
              className="px-8 py-2 border-realty-800 text-realty-800 hover:bg-realty-800 hover:text-white dark:border-realty-gold dark:text-realty-gold dark:hover:bg-realty-gold dark:hover:text-realty-900"
            >
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
