
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedListings from "@/components/home/FeaturedListings";
import MarketTrends from "@/components/home/MarketTrends";
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
      
      <FeaturedListings />
      
      <MarketTrends />
      
      <Testimonials />
      
      <Newsletter />
    </>
  );
};

export default Index;
