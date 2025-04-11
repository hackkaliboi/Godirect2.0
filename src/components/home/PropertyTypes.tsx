
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Define property type data structure
interface PropertyTypeData {
  title: string;
  image: string;
  count: number;
  url: string;
  type: string;
}

const PropertyTypes = () => {
  // Fetch properties to count by type
  const { data: properties, isLoading } = useQuery({
    queryKey: ["property-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("property_type");
      
      if (error) {
        throw error;
      }
      
      return data;
    }
  });

  // Count properties by type and prepare data
  const getPropertyTypes = (): PropertyTypeData[] => {
    if (!properties || properties.length === 0) {
      return defaultPropertyTypes;
    }
    
    // Count properties by type
    const typeCounts: Record<string, number> = {};
    properties.forEach(prop => {
      const type = prop.property_type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    // Map to our UI format
    return [
      {
        id: 1,
        title: "Single Family Homes",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop",
        count: typeCounts["House"] || 0,
        url: "/properties?type=House",
        type: "House"
      },
      {
        id: 2,
        title: "Condos & Apartments",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
        count: (typeCounts["Condo"] || 0) + (typeCounts["Apartment"] || 0),
        url: "/properties?type=Condo,Apartment",
        type: "Condo"
      },
      {
        id: 3,
        title: "Luxury Properties",
        image: "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=800&auto=format&fit=crop",
        count: properties.length > 5 ? Math.floor(properties.length / 5) : 0, // Estimate luxury properties
        url: "/properties?luxury=true",
        type: "Luxury"
      },
      {
        id: 4,
        title: "Commercial Spaces",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
        count: typeCounts["Commercial"] || 0,
        url: "/properties?type=Commercial",
        type: "Commercial"
      }
    ];
  };

  // Default property types for when we have no data
  const defaultPropertyTypes: PropertyTypeData[] = [
    {
      id: 1,
      title: "Single Family Homes",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop",
      count: 0,
      url: "/properties?type=House",
      type: "House"
    },
    {
      id: 2,
      title: "Condos & Apartments",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
      count: 0,
      url: "/properties?type=Condo,Apartment",
      type: "Condo"
    },
    {
      id: 3,
      title: "Luxury Properties",
      image: "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=800&auto=format&fit=crop",
      count: 0,
      url: "/properties?luxury=true",
      type: "Luxury"
    },
    {
      id: 4,
      title: "Commercial Spaces",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
      count: 0,
      url: "/properties?type=Commercial",
      type: "Commercial"
    }
  ];

  const propertyTypes = getPropertyTypes();

  return (
    <section className="section-padding bg-white dark:bg-realty-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-semibold mb-2 text-realty-900 dark:text-white">
            Explore Property Types
          </h2>
          <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
            Discover your perfect property from our diverse selection of listings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading states
            Array(4).fill(null).map((_, index) => (
              <div key={index} className="relative h-80 rounded-xl overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
            ))
          ) : (
            // Property type cards
            propertyTypes.map((type) => (
              <Link 
                key={type.id}
                to={type.url}
                className="group relative h-80 rounded-xl overflow-hidden"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${type.image})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-realty-900/80 to-realty-900/20" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-heading font-semibold text-white mb-1">
                    {type.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {type.count.toLocaleString()} Properties
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
