
import { supabase } from "@/integrations/supabase/client";

// Types
export type Agent = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  title?: string;
  bio?: string;
  ratings?: number;
  reviews?: number;
  specializations: string[];
  listings?: number;
  sales?: number;
  experience?: number;
};

export type Property = {
  id: string;
  title: string;
  description?: string;
  price: number;
  featured: boolean;
  status: "For Sale" | "For Rent" | "Sold";
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  street?: string;
  city: string;
  state: string;
  zip_code?: string;
  images: string[];
  amenities: string[];
  property_type: "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial";
  year_built?: number;
  agent_id?: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  image?: string;
  testimonial: string;
  rating: number;
  location?: string;
};

export type MarketTrend = {
  id: string;
  title: string;
  value: string;
  trend: "up" | "down" | "stable";
  description?: string;
};

// Fetch all agents
export async function fetchAgents() {
  const { data, error } = await supabase
    .from("agents")
    .select("*");
  
  if (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
  
  return data as Agent[];
}

// Fetch agent by ID
export async function fetchAgentById(id: string) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
  
  return data as Agent;
}

// Fetch all properties
export async function fetchProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*");
  
  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
  
  return data as Property[];
}

// Fetch featured properties
export async function fetchFeaturedProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true);
  
  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
  
  return data as Property[];
}

// Fetch property by ID
export async function fetchPropertyById(id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }
  
  return data as Property;
}

// Fetch all testimonials
export async function fetchTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*");
  
  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
  
  return data as Testimonial[];
}

// Fetch all market trends
export async function fetchMarketTrends() {
  const { data, error } = await supabase
    .from("market_trends")
    .select("*");
  
  if (error) {
    console.error("Error fetching market trends:", error);
    return [];
  }
  
  return data as MarketTrend[];
}
