import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Building, Home, TrendingUp, Users, ChevronRight } from "lucide-react";

// Home page components
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedListings from "@/components/home/FeaturedListings";
import PropertyTypes from "@/components/home/PropertyTypes";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import ScrollToTop from "@/components/ui/scroll-to-top";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  // Smooth scroll effect for the page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>GoDirectly | Find Your Dream Home in Nigeria</title>
        <meta name="description" content="Find your dream home with GoDirectly. Browse thousands of premium properties for sale and rent in Enugu and Calabar, Nigeria." />
        <meta name="keywords" content="real estate, property, Nigeria, Enugu, Calabar, buy home, rent apartment, luxury properties" />
      </Helmet>

      {/* Main hero section with search */}
      <HeroSearch />

      {/* Featured Locations */}
      <section className="py-16 bg-gradient-to-r from-realty-50 to-white dark:from-realty-900/40 dark:to-realty-900/20">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
              Explore <span className="text-realty-gold relative inline-block">
                <span className="relative z-10">Prime Locations</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
              </span>
            </h2>
            <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
              Discover exceptional properties in Nigeria's most sought-after locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Enugu Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-realty-900/90 to-realty-900/20 z-10"></div>
              <div className="w-full h-80 bg-gradient-to-br from-green-600 to-green-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building className="h-24 w-24 text-white/30" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center text-white mb-2">
                  <MapPin className="h-5 w-5 mr-2 text-realty-gold" />
                  <h3 className="text-xl font-semibold">Enugu</h3>
                </div>
                <p className="text-white/80 mb-4 text-sm">Known as the 'Coal City', Enugu offers a blend of urban amenities and natural beauty.</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">240+ Properties</span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">From ₦25M</span>
                </div>
                <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full">
                  <Link to="/properties?location=Enugu" className="flex items-center justify-center">
                    Explore Enugu
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Calabar Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-realty-900/90 to-realty-900/20 z-10"></div>
              <div className="w-full h-80 bg-gradient-to-br from-blue-600 to-blue-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="h-24 w-24 text-white/30" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center text-white mb-2">
                  <MapPin className="h-5 w-5 mr-2 text-realty-gold" />
                  <h3 className="text-xl font-semibold">Calabar</h3>
                </div>
                <p className="text-white/80 mb-4 text-sm">The 'Canaan City' is known for its cleanliness, hospitality, and vibrant cultural heritage.</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">180+ Properties</span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">From ₦22M</span>
                </div>
                <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full">
                  <Link to="/properties?location=Calabar" className="flex items-center justify-center">
                    Explore Calabar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Lagos Card */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-realty-900/90 to-realty-900/20 z-10"></div>
              <div className="w-full h-80 bg-gradient-to-br from-orange-600 to-orange-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="h-24 w-24 text-white/30" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center text-white mb-2">
                  <MapPin className="h-5 w-5 mr-2 text-realty-gold" />
                  <h3 className="text-xl font-semibold">Lagos</h3>
                </div>
                <p className="text-white/80 mb-4 text-sm">Nigeria's economic hub offering premium waterfront properties and urban living.</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">320+ Properties</span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">From ₦35M</span>
                </div>
                <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full">
                  <Link to="/properties?location=Lagos" className="flex items-center justify-center">
                    Explore Lagos
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured property listings */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-8 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
              Featured <span className="text-realty-gold relative inline-block">
                <span className="relative z-10">Properties</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
              </span>
            </h2>
            <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties across Nigeria.
            </p>
          </div>
          <FeaturedListings />
        </div>
      </section>

      {/* Property types */}
      <section className="py-16 bg-gradient-to-r from-realty-50 to-white dark:from-realty-900/40 dark:to-realty-900/20">
        <div className="container-custom">
          <div className="text-center mb-8 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
              Browse by <span className="text-realty-gold relative inline-block">
                <span className="relative z-10">Property Type</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
              </span>
            </h2>
            <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
              Find the perfect property that fits your specific needs and preferences.
            </p>
          </div>
          <PropertyTypes />
        </div>
      </section>

      {/* Testimonials with enhanced styling */}
      <section className="py-16 bg-gradient-to-r from-realty-900 to-realty-800 text-white">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Client <span className="text-realty-gold relative inline-block">
                <span className="relative z-10">Testimonials</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
              </span>
            </h2>
            <p className="text-realty-300 max-w-2xl mx-auto">
              Hear what our satisfied clients have to say about their experience with GoDirectly.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-realty-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-realty-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-realty-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Find Your Dream Home in Nigeria?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who have found their perfect property with GoDirectly. Our expert team is ready to guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-realty-gold hover:bg-realty-gold/90 text-realty-900 font-medium">
                <Link to="/properties">Browse Properties</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 hover:bg-white/10 text-white">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-b from-realty-50 to-white dark:from-realty-900/30 dark:to-realty-900/10">
        <div className="container-custom">
          <Newsletter />
        </div>
      </section>

      {/* Scroll to top button */}
      <ScrollToTop />
    </>
  );
};

export default Index;