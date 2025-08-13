
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

// Market trends data - now fetched from Supabase
export const marketTrends: any[] = [];

// Property types - now fetched from Supabase
export const propertyTypes: string[] = [];

// Amenities - now fetched from Supabase
export const amenities: string[] = [];

// Price ranges - now fetched from Supabase
export const priceRanges: any[] = [];

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
