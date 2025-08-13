import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Building, Landmark } from "lucide-react";
import { Link } from "react-router-dom";

const InteractiveMap = () => {
  const [activeLocation, setActiveLocation] = useState<string | null>("enugu-center");

  // Map locations data will be fetched from Supabase
  const locations: {
    id: string;
    name: string;
    type: 'residential' | 'commercial' | 'luxury';
    position: {
      top: string;
      left: string;
    };
    properties: number;
    priceRange: string;
  }[] = [];

  // Get the active location details
  const activeLocationData = locations.find(loc => loc.id === activeLocation);

  // Icon based on property type
  const getIcon = (type: string) => {
    switch (type) {
      case "residential":
        return <Home className="h-4 w-4 mr-2" />;
      case "commercial":
        return <Building className="h-4 w-4 mr-2" />;
      case "luxury":
        return <Landmark className="h-4 w-4 mr-2" />;
      default:
        return <MapPin className="h-4 w-4 mr-2" />;
    }
  };

  if (locations.length === 0) {
    return (
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
            Explore <span className="text-realty-gold">Property Hotspots</span>
          </h2>
          <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
            Discover prime real estate locations across Enugu and Calabar with our interactive map.
          </p>
        </div>
        <div className="bg-white dark:bg-realty-800/30 rounded-xl shadow-lg p-8 backdrop-blur-sm text-center">
          <p className="text-xl text-realty-600 dark:text-realty-400">Interactive map will be available soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
          Explore <span className="text-realty-gold">Property Hotspots</span>
        </h2>
        <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
          Discover prime real estate locations across Enugu and Calabar with our interactive map.
        </p>
      </div>

      <div className="bg-white dark:bg-realty-800/30 rounded-xl shadow-lg p-4 md:p-6 backdrop-blur-sm">
        <div className="relative w-full h-[500px] bg-realty-50 dark:bg-realty-900/50 rounded-lg overflow-hidden">
          {/* Map background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90 dark:opacity-70"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c907?q=80&w=1800&auto=format&fit=crop')" 
            }}
          ></div>
          
          {/* Map overlay */}
          <div className="absolute inset-0 bg-realty-900/10 dark:bg-realty-900/50"></div>
          
          {/* Location pins */}
          {locations.map((location) => (
            <button
              key={location.id}
              className={`absolute z-10 transition-all duration-300 ${
                activeLocation === location.id 
                  ? "scale-125" 
                  : "hover:scale-110"
              }`}
              style={{ 
                top: location.position.top, 
                left: location.position.left 
              }}
              onClick={() => setActiveLocation(location.id)}
              aria-label={`View ${location.name}`}
            >
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activeLocation === location.id
                    ? "bg-realty-gold text-realty-900"
                    : "bg-realty-800 text-white dark:bg-realty-700"
                } shadow-lg hover:shadow-xl`}
              >
                <MapPin className="h-4 w-4" />
              </div>
              {activeLocation === location.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap bg-white dark:bg-realty-800 text-realty-900 dark:text-white text-xs font-medium py-1 px-2 rounded shadow-md">
                  {location.name}
                </div>
              )}
            </button>
          ))}
          
          {/* Location details panel */}
          {activeLocationData && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-white/95 dark:bg-realty-800/95 backdrop-blur-md rounded-lg shadow-lg p-4 transition-all duration-300 animate-fade-up">
              <h3 className="text-lg font-semibold text-realty-900 dark:text-white mb-2">
                {activeLocationData.name}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-realty-600 dark:text-realty-300">
                  {getIcon(activeLocationData.type)}
                  <span className="capitalize">{activeLocationData.type} Area</span>
                </div>
                <div className="flex items-center text-sm text-realty-600 dark:text-realty-300">
                  <Home className="h-4 w-4 mr-2" />
                  <span>{activeLocationData.properties} Properties</span>
                </div>
                <div className="flex items-center text-sm text-realty-600 dark:text-realty-300">
                  <span className="w-4 h-4 mr-2 flex items-center justify-center">₦</span>
                  <span>{activeLocationData.priceRange}</span>
                </div>
              </div>
              
              <Button 
                asChild
                size="sm"
                className="w-full bg-realty-800 hover:bg-realty-900 text-white dark:bg-realty-gold dark:text-realty-900"
              >
                <Link to={`/properties?location=${encodeURIComponent(activeLocationData.name)}`}>
                  View Properties
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
