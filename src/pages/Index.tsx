import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Building, Home, TrendingUp, Users, ChevronRight, Gift, Percent, Star, Award } from "lucide-react";

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

  // Offer data
  const offers = [
    {
      id: 1,
      title: "First-Time Buyer Special",
      description: "Get up to 5% cashback on your first property purchase with us.",
      icon: <Gift className="h-8 w-8 text-realty-gold" />,
      image: "/offers/offer-1.jpg",
      link: "/properties?offer=first-time"
    },
    {
      id: 2,
      title: "Seasonal Discounts",
      description: "Special discounts up to 10% on selected properties this season.",
      icon: <Percent className="h-8 w-8 text-realty-gold" />,
      image: "/offers/offer-2.jpg",
      link: "/properties?offer=seasonal"
    },
    {
      id: 3,
      title: "VIP Client Benefits",
      description: "Exclusive access to premium listings and priority service.",
      icon: <Star className="h-8 w-8 text-realty-gold" />,
      image: "/offers/offer-3.jpg",
      link: "/properties?offer=vip"
    }
  ];

  // Expanded locations data
  const locations = [
    {
      id: 1,
      name: "Enugu",
      description: "Known as the 'Coal City', Enugu offers a blend of urban amenities and natural beauty.",
      properties: "240+ Properties",
      price: "From ₦25M",
      gradient: "from-green-600 to-green-800",
      icon: <Building className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Enugu"
    },
    {
      id: 2,
      name: "Calabar",
      description: "The 'Canaan City' is known for its cleanliness, hospitality, and vibrant cultural heritage.",
      properties: "180+ Properties",
      price: "From ₦22M",
      gradient: "from-blue-600 to-blue-800",
      icon: <Home className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Calabar"
    },
    {
      id: 3,
      name: "Lagos",
      description: "Nigeria's economic hub offering premium waterfront properties and urban living.",
      properties: "320+ Properties",
      price: "From ₦35M",
      gradient: "from-orange-600 to-orange-800",
      icon: <TrendingUp className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Lagos"
    },
    {
      id: 4,
      name: "Abuja",
      description: "The Federal Capital Territory with modern infrastructure and government amenities.",
      properties: "280+ Properties",
      price: "From ₦40M",
      gradient: "from-purple-600 to-purple-800",
      icon: <Award className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Abuja"
    },
    {
      id: 5,
      name: "Akwa Ibom",
      description: "Coastal state with beautiful beaches and growing real estate opportunities.",
      properties: "120+ Properties",
      price: "From ₦18M",
      gradient: "from-teal-600 to-teal-800",
      icon: <MapPin className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Akwa%20Ibom"
    },
    {
      id: 6,
      name: "Anambra",
      description: "Historically significant state with developing commercial districts.",
      properties: "150+ Properties",
      price: "From ₦20M",
      gradient: "from-amber-600 to-amber-800",
      icon: <Building className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Anambra"
    },
    {
      id: 7,
      name: "Kano",
      description: "Northern commercial hub with traditional markets and modern developments.",
      properties: "190+ Properties",
      price: "From ₦15M",
      gradient: "from-red-600 to-red-800",
      icon: <TrendingUp className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Kano"
    },
    {
      id: 8,
      name: "Kaduna",
      description: "Industrial city with educational institutions and military history.",
      properties: "130+ Properties",
      price: "From ₦17M",
      gradient: "from-indigo-600 to-indigo-800",
      icon: <Home className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Kaduna"
    },
    {
      id: 9,
      name: "Port Harcourt",
      description: "Oil city with coastal beauty and bustling commercial activities.",
      properties: "210+ Properties",
      price: "From ₦30M",
      gradient: "from-emerald-600 to-emerald-800",
      icon: <Users className="h-24 w-24 text-white/30" />,
      link: "/properties?location=Port%20Harcourt"
    }
  ];

  return (
    <>
      <Helmet>
        <title>GoDirectly | Find Your Dream Home in Nigeria</title>
        <meta name="description" content="Find your dream home with GoDirectly. Browse thousands of premium properties for sale and rent in Enugu and Calabar, Nigeria." />
        <meta name="keywords" content="real estate, property, Nigeria, Enugu, Calabar, buy home, rent apartment, luxury properties" />
      </Helmet>

      {/* Main hero section with search */}
      <HeroSearch />

      {/* Special Offers Section */}
      <section className="py-16 bg-gradient-to-r from-realty-50 to-white dark:from-realty-900/40 dark:to-realty-900/20">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-realty-900 dark:text-white mb-4">
              Special <span className="text-realty-gold relative inline-block">
                <span className="relative z-10">Offers</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-realty-gold/20 -rotate-1"></span>
              </span>
            </h2>
            <p className="text-realty-600 dark:text-realty-300 max-w-2xl mx-auto">
              Take advantage of our exclusive deals and special promotions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${offer.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-realty-900/80 to-realty-900/20" />
                  <div className="absolute top-4 right-4 p-2 bg-realty-gold rounded-full">
                    {offer.icon}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-realty-900 dark:text-white mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-realty-600 dark:text-realty-300 mb-4">
                    {offer.description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={offer.link} className="flex items-center justify-center">
                      View Offer
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
            {locations.map((location) => (
              <div key={location.id} className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${location.gradient} z-0`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-realty-900/90 to-realty-900/20 z-10"></div>
                <div className={`w-full h-80 bg-gradient-to-br ${location.gradient} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {location.icon}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center text-white mb-2">
                    <MapPin className="h-5 w-5 mr-2 text-realty-gold" />
                    <h3 className="text-xl font-semibold">{location.name}</h3>
                  </div>
                  <p className="text-white/80 mb-4 text-sm">{location.description}</p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{location.properties}</span>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{location.price}</span>
                  </div>
                  <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full">
                    <Link to={location.link} className="flex items-center justify-center">
                      Explore {location.name}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
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