import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, LayoutList, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { Property, fetchProperties } from "@/utils/supabaseData";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { searchHistoryApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface FilterState {
  searchTerm?: string;
  propertyTypes?: string[];
  amenities?: string[];
  priceRange?: [number, number];
  bedrooms?: number | null;
  bathrooms?: number | null;
}

const PropertyListings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [initialFilters, setInitialFilters] = useState<Partial<FilterState>>({});

  // Fetch properties from Supabase
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const handleApplyFilters = (filters: FilterState) => {
    // Update URL with filter parameters
    const params = new URLSearchParams();

    if (filters.searchTerm) {
      params.set("location", filters.searchTerm);
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      params.set("type", filters.propertyTypes.join(","));
    }

    if (filters.priceRange) {
      params.set("price_min", filters.priceRange[0].toString());
      params.set("price_max", filters.priceRange[1].toString());
    }

    if (filters.bedrooms !== null) {
      params.set("bedrooms", filters.bedrooms.toString());
    }

    if (filters.bathrooms !== null) {
      params.set("bathrooms", filters.bathrooms.toString());
    }

    if (filters.amenities && filters.amenities.length > 0) {
      params.set("amenities", filters.amenities.join(","));
    }

    // Update browser history
    const newUrl = `/properties${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });

    // Apply all filters to the properties
    let results = [...properties];

    // Filter by search term (location)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (property) =>
          property.city.toLowerCase().includes(term) ||
          property.state.toLowerCase().includes(term) ||
          property.zip_code?.toLowerCase().includes(term) ||
          property.title.toLowerCase().includes(term) ||
          property.street?.toLowerCase().includes(term)
      );
    }

    // Filter by property type
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter((property) =>
        filters.propertyTypes.some(type =>
          property.property_type.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    // Filter by bedrooms
    if (filters.bedrooms !== null) {
      results = results.filter(
        (property) => property.bedrooms && property.bedrooms >= filters.bedrooms
      );
    }

    // Filter by bathrooms
    if (filters.bathrooms !== null) {
      results = results.filter(
        (property) => property.bathrooms && property.bathrooms >= filters.bathrooms
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      results = results.filter(
        (property) =>
          property.price >= filters.priceRange[0] &&
          property.price <= filters.priceRange[1]
      );
    }

    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter((property) =>
        filters.amenities.some((amenity: string) =>
          property.amenities && Array.isArray(property.amenities) && property.amenities.includes(amenity)
        )
      );
    }

    setFilteredProperties(results);

    // Save search to history if user is logged in
    if (user) {
      const searchQuery = filters.searchTerm || "";
      const searchFilters = {
        property_type: filters.propertyTypes?.[0],
        min_price: filters.priceRange?.[0],
        max_price: filters.priceRange?.[1],
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        amenities: filters.amenities
      };

      // Save to search history (non-blocking)
      searchHistoryApi.saveSearchToHistory(searchQuery, searchFilters, results.length);
    }
  };

  // Parse URL query params on initial load and set filtered properties
  useEffect(() => {
    if (properties.length > 0) {
      const params = new URLSearchParams(location.search);
      const locationFilter = params.get("location");
      const typeFilter = params.get("type");
      const priceMin = params.get("price_min");
      const priceMax = params.get("price_max");
      const bedroomsFilter = params.get("bedrooms");
      const bathroomsFilter = params.get("bathrooms");
      const amenitiesFilter = params.get("amenities");

      const initialFilters: Partial<FilterState> = {};

      if (locationFilter) initialFilters.searchTerm = locationFilter;

      if (typeFilter) {
        initialFilters.propertyTypes = typeFilter.split(",").map(type => type.trim());
      }

      if (priceMin && priceMax) {
        initialFilters.priceRange = [
          parseInt(priceMin, 10),
          parseInt(priceMax, 10)
        ];
      }

      if (bedroomsFilter) {
        initialFilters.bedrooms = parseInt(bedroomsFilter, 10);
      }

      if (bathroomsFilter) {
        initialFilters.bathrooms = parseInt(bathroomsFilter, 10);
      }

      if (amenitiesFilter) {
        initialFilters.amenities = amenitiesFilter.split(",").map(amenity => amenity.trim());
      }

      setInitialFilters(initialFilters);
      setFilteredProperties(properties);

      // Apply initial filters if present
      if (Object.keys(initialFilters).length > 0) {
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          handleApplyFilters(initialFilters as FilterState);
        }, 0);
      } else {
        setFilteredProperties(properties);
      }
    }
  }, [properties, location.search, handleApplyFilters]);

  // Sort properties
  const sortProperties = (properties: Property[]) => {
    switch (sortBy) {
      case "price_asc":
        return [...properties].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...properties].sort((a, b) => b.price - a.price);
      case "newest":
        return [...properties].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return properties;
    }
  };

  const sortedProperties = sortProperties(filteredProperties);

  if (isLoading) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">
          Loading properties...
        </h2>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Browse Properties | Godirect Realty</title>
        <meta name="description" content="Browse our extensive collection of properties for sale. Find houses, apartments, condos, and more." />
      </Helmet>

      <div className="bg-realty-50 dark:bg-realty-800/30 py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-realty-900 dark:text-white mb-2">
            Browse Properties
          </h1>
          <p className="text-realty-600 dark:text-realty-400 mb-8">
            Find your next home from our carefully curated property listings.
          </p>

          <PropertyFilters
            onApplyFilters={handleApplyFilters}
            initialFilters={initialFilters}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <p className="text-realty-600 dark:text-realty-400 mb-4 sm:mb-0">
              Showing <span className="font-medium text-realty-900 dark:text-white">{sortedProperties.length}</span> properties
            </p>

            <div className="flex space-x-3">
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 text-realty-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex rounded-md overflow-hidden">
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  className={`px-3 ${view === "grid" ? "bg-realty-800 text-white" : ""}`}
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  className={`px-3 ${view === "list" ? "bg-realty-800 text-white" : ""}`}
                  onClick={() => setView("list")}
                >
                  <LayoutList className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>
          </div>

          {sortedProperties.length > 0 ? (
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col space-y-6"}>
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-realty-800 rounded-lg shadow">
              <h3 className="text-xl font-heading font-semibold text-realty-900 dark:text-white mb-2">
                No properties found
              </h3>
              <p className="text-realty-600 dark:text-realty-400">
                Try adjusting your filters to find the perfect property.
              </p>
            </div>
          )}

          {/* Pagination placeholder */}
          {sortedProperties.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-1">
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    className={page === 1 ? "bg-realty-800" : ""}
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyListings;