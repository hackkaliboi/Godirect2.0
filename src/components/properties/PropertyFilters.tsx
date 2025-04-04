
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { propertyTypes, amenities } from "@/utils/data";
import { cn } from "@/lib/utils";

interface PropertyFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const PropertyFilters = ({ onApplyFilters }: PropertyFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);

  const toggleFilter = (type: string, array: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (array.includes(type)) {
      setter(array.filter(item => item !== type));
    } else {
      setter([...array, type]);
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      searchTerm,
      propertyTypes: selectedTypes,
      amenities: selectedAmenities,
      priceRange,
      bedrooms,
      bathrooms,
    });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setPriceRange([0, 2000000]);
    setBedrooms(null);
    setBathrooms(null);
  };
  
  const formatPrice = (value: number) => 
    `$${value.toLocaleString('en-US')}`;

  // Fixed type conversion for bedrooms and bathrooms
  const handleBedroomSelection = (value: string | number | null) => {
    if (value === "5+") {
      setBedrooms(5);
    } else if (typeof value === "number") {
      setBedrooms(value);
    } else {
      setBedrooms(null);
    }
  };

  const handleBathroomSelection = (value: string | number | null) => {
    if (value === "4+") {
      setBathrooms(4);
    } else if (typeof value === "number") {
      setBathrooms(value);
    } else {
      setBathrooms(null);
    }
  };

  return (
    <div className="mb-8">
      {/* Search bar and filter button */}
      <div className="relative flex items-center mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-realty-400" size={18} />
          <Input
            placeholder="Search by location, zip code, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="ml-2 flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Advanced filters */}
      <div className={cn(
        "bg-white dark:bg-realty-800 rounded-lg border border-gray-200 dark:border-realty-700 overflow-hidden transition-all duration-300",
        isOpen ? "opacity-100 max-h-[1000px] mb-6" : "opacity-0 max-h-0 pointer-events-none"
      )}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-medium text-lg">Advanced Filters</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearFilters}
              className="text-realty-600 dark:text-realty-300 hover:text-realty-900 dark:hover:text-white"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <h4 className="font-medium">Price Range</h4>
              <div className="px-2">
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={2000000}
                  step={50000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-3">
              <h4 className="font-medium">Property Type</h4>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.slice(0, 6).map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                    className={cn(
                      "rounded-full",
                      selectedTypes.includes(type)
                        ? "bg-realty-800 text-white hover:bg-realty-700 border-realty-800"
                        : "bg-transparent hover:bg-realty-50 dark:hover:bg-realty-700"
                    )}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="space-y-5">
              <div>
                <h4 className="font-medium mb-3">Bedrooms</h4>
                <div className="flex space-x-2">
                  {[null, 1, 2, 3, 4, "5+"].map((num, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleBedroomSelection(num)}
                      className={cn(
                        "rounded-full min-w-[40px]",
                        (bedrooms === num || (num === "5+" && bedrooms === 5))
                          ? "bg-realty-800 text-white hover:bg-realty-700 border-realty-800"
                          : "bg-transparent hover:bg-realty-50 dark:hover:bg-realty-700"
                      )}
                    >
                      {num === null ? "Any" : num}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Bathrooms</h4>
                <div className="flex space-x-2">
                  {[null, 1, 2, 3, "4+"].map((num, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleBathroomSelection(num)}
                      className={cn(
                        "rounded-full min-w-[40px]",
                        (bathrooms === num || (num === "4+" && bathrooms === 4))
                          ? "bg-realty-800 text-white hover:bg-realty-700 border-realty-800"
                          : "bg-transparent hover:bg-realty-50 dark:hover:bg-realty-700"
                      )}
                    >
                      {num === null ? "Any" : num}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <h4 className="font-medium">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {amenities.slice(0, 8).map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox 
                      id={amenity} 
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleFilter(amenity, selectedAmenities, setSelectedAmenities)}
                    />
                    <label
                      htmlFor={amenity}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-realty-800 hover:bg-realty-900 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {(selectedTypes.length > 0 || selectedAmenities.length > 0 || 
        bedrooms !== null || bathrooms !== null || 
        priceRange[0] > 0 || priceRange[1] < 2000000) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTypes.map(type => (
            <div key={type} className="bg-realty-50 dark:bg-realty-700 text-realty-800 dark:text-white px-3 py-1 rounded-full text-sm flex items-center">
              {type}
              <X 
                className="h-3 w-3 ml-2 cursor-pointer" 
                onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}
              />
            </div>
          ))}
          
          {bedrooms !== null && (
            <div className="bg-realty-50 dark:bg-realty-700 text-realty-800 dark:text-white px-3 py-1 rounded-full text-sm flex items-center">
              {bedrooms}+ Beds
              <X 
                className="h-3 w-3 ml-2 cursor-pointer" 
                onClick={() => setBedrooms(null)}
              />
            </div>
          )}
          
          {bathrooms !== null && (
            <div className="bg-realty-50 dark:bg-realty-700 text-realty-800 dark:text-white px-3 py-1 rounded-full text-sm flex items-center">
              {bathrooms}+ Baths
              <X 
                className="h-3 w-3 ml-2 cursor-pointer" 
                onClick={() => setBathrooms(null)}
              />
            </div>
          )}
          
          {(priceRange[0] > 0 || priceRange[1] < 2000000) && (
            <div className="bg-realty-50 dark:bg-realty-700 text-realty-800 dark:text-white px-3 py-1 rounded-full text-sm flex items-center">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              <X 
                className="h-3 w-3 ml-2 cursor-pointer" 
                onClick={() => setPriceRange([0, 2000000])}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
