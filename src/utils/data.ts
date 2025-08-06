
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  featured: boolean;
  status: 'For Sale' | 'For Rent' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  images: string[];
  amenities: string[];
  propertyType: 'House' | 'Apartment' | 'Condo' | 'Townhouse';
  yearBuilt: number;
  agentId: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  image: string;
  title: string;
  bio: string;
  ratings: number;
  reviews: number;
  specializations: string[];
  listings: number;
  sales: number;
  experience: number;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  testimonial: string;
  rating: number;
  location: string;
}

// Properties data will be fetched from Supabase
export const properties: Property[] = [];

// Agents data will be fetched from Supabase
export const agents: Agent[] = [];

// Testimonials data will be fetched from Supabase
export const testimonials: Testimonial[] = [];

// Market trends data
export const marketTrends = [
  {
    id: "1",
    title: "Home Price Index",
    value: "+5.8%",
    trend: "up",
    description: "Year-over-year increase in home prices"
  },
  {
    id: "2",
    title: "Days on Market",
    value: "18",
    trend: "down",
    description: "Average days on market for listed properties"
  },
  {
    id: "3",
    title: "Inventory Levels",
    value: "+2.3%",
    trend: "up",
    description: "Increase in available properties"
  },
  {
    id: "4",
    title: "Mortgage Rate",
    value: "3.25%",
    trend: "stable",
    description: "Average 30-year fixed-rate mortgage"
  }
];

// Property types
export const propertyTypes = [
  "House", "Apartment", "Condo", "Townhouse", "Land", "Multi-Family", "Commercial", "Industrial"
];

// Amenities
export const amenities = [
  "Swimming Pool", "Garden", "Garage", "Fireplace", "Air Conditioning", "Balcony", 
  "Gym", "Elevator", "Pet Friendly", "Security System", "Waterfront", "Mountain View",
  "Smart Home", "Solar Panels", "Wine Cellar", "Home Theater", "Outdoor Kitchen"
];

// Price ranges
export const priceRanges = [
  { min: 0, max: 300000, label: "Under $300k" },
  { min: 300000, max: 500000, label: "$300k - $500k" },
  { min: 500000, max: 750000, label: "$500k - $750k" },
  { min: 750000, max: 1000000, label: "$750k - $1M" },
  { min: 1000000, max: 1500000, label: "$1M - $1.5M" },
  { min: 1500000, max: 2000000, label: "$1.5M - $2M" },
  { min: 2000000, max: null, label: "Over $2M" }
];

// Helper function to format price
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}k`;
  } else {
    return `$${price}`;
  }
};

export const formatPriceWithCommas = (price: number): string => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
};
