
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedListings from "@/components/home/FeaturedListings";
import PropertyTypes from "@/components/home/PropertyTypes";
import PropertyStatistics from "@/components/home/PropertyStatistics";
import MarketTrends from "@/components/home/MarketTrends";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>HomePulse Realty | Find Your Dream Home</title>
        <meta name="description" content="Find your dream home with HomePulse Realty. Browse thousands of properties for sale and rent across the country." />
      </Helmet>
      
      <HeroSearch />
      
      <PropertyStatistics />
      
      <FeaturedListings />
      
      <PropertyTypes />
      
      <MarketTrends />
      
      <HowItWorks />
      
      <Testimonials />
      
      <Newsletter />
    </>
  );
};

export default Index;
