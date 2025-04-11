
import { supabase } from "@/integrations/supabase/client";
import { agents, properties, testimonials, marketTrends } from "./data";

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

// Fetch all agents - using mock data for now
export async function fetchAgents(): Promise<Agent[]> {
  console.log("Fetching agents...");
  try {
    // When the Supabase table is created, uncomment the following:
    // const { data, error } = await supabase
    //   .from("agents")
    //   .select("*");
    
    // if (error) {
    //   throw error;
    // }
    
    // return data as Agent[];
    
    // Using mock data for now
    return agents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
}

// Fetch agent by ID - using mock data for now
export async function fetchAgentById(id: string): Promise<Agent | null> {
  console.log(`Fetching agent with id: ${id}`);
  try {
    // When the Supabase table is created, uncomment the following:
    // const { data, error } = await supabase
    //   .from("agents")
    //   .select("*")
    //   .eq("id", id)
    //   .single();
    
    // if (error) {
    //   throw error;
    // }
    
    // return data as Agent;
    
    // Using mock data for now
    const agent = agents.find(agent => agent.id === id);
    return agent || null;
  } catch (error) {
    console.error("Error fetching agent:", error);
    return null;
  }
}

// Fetch all properties - using mock data for now
export async function fetchProperties(): Promise<Property[]> {
  console.log("Fetching properties...");
  try {
    // When the Supabase table is created, uncomment the following:
    // const { data, error } = await supabase
    //   .from("properties")
    //   .select("*");
    
    // if (error) {
    //   throw error;
    // }
    
    // return data as Property[];
    
    // Using mock data for now
    return properties.map(p => ({
      ...p,
      square_feet: p.squareFeet,
      zip_code: p.address.zipCode,
      street: p.address.street,
      property_type: p.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
      agent_id: p.agentId,
      created_at: p.createdAt,
    })) as Property[];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// Fetch featured properties - using mock data for now
export async function fetchFeaturedProperties(): Promise<Property[]> {
  console.log("Fetching featured properties...");
  try {
    // When the Supabase table is created, uncomment the following:
    // const { data, error } = await supabase
    //   .from("properties")
    //   .select("*")
    //   .eq("featured", true);
    
    // if (error) {
    //   throw error;
    // }
    
    // return data as Property[];
    
    // Using mock data for now
    const featuredProps = properties.filter(p => p.featured);
    return featuredProps.map(p => ({
      ...p,
      square_feet: p.squareFeet,
      zip_code: p.address.zipCode,
      street: p.address.street,
      property_type: p.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
      agent_id: p.agentId,
      created_at: p.createdAt,
    })) as Property[];
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
}

// Fetch property by ID - using mock data for now
export async function fetchPropertyById(id: string): Promise<Property | null> {
  console.log(`Fetching property with id: ${id}`);
  try {
    // When the Supabase table is created, uncomment the following:
    // const { data, error } = await supabase
    //   .from("properties")
    //   .select("*")
    //   .eq("id", id)
    //   .single();
    
    // if (error) {
    //   throw error;
    // }
    
    // return data as Property;
    
    // Using mock data for now
    const property = properties.find(property => property.id === id);
    if (!property) return null;
    
    return {
      ...property,
      square_feet: property.squareFeet,
      zip_code: property.address.zipCode,
      street: property.address.street,
      property_type: property.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
      agent_id: property.agentId,
      created_at: property.createdAt,
    } as Property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

// Fetch all testimonials - using mock data for now
export async function fetchTestimonials(): Promise<Testimonial[]> {
  console.log("Fetching testimonials...");
  try {
    // When the Supabase table is created, uncomment the following:
    // const { data, error } = await supabase
    //   .from("testimonials")
    //   .select("*");
    
    // if (error) {
    //   throw error;
    // }
    
    // return data as Testimonial[];
    
    // Using mock data for now
    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

// Fetch all market trends - using mock data for now
export async function fetchMarketTrends(): Promise<MarketTrend[]> {
  console.log("Fetching market trends...");
  try {
    // When the Supabase table is created, uncomment the following:
    // const { data, error } = await supabase
    //   .from("market_trends")
    //   .select("*");
    
    // if (error) {
    //   throw error;
    // }
    
    // return data as MarketTrend[];
    
    // Using mock data for now
    return marketTrends.map(trend => ({
      id: trend.id,
      title: trend.title,
      value: trend.value,
      trend: trend.trend as "up" | "down" | "stable",
      description: trend.description,
    }));
  } catch (error) {
    console.error("Error fetching market trends:", error);
    return [];
  }
}
