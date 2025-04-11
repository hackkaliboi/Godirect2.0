
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

// Fetch all agents
export async function fetchAgents(): Promise<Agent[]> {
  console.log("Fetching agents...");
  try {
    const { data, error } = await supabase
      .from("agents")
      .select("*");
    
    if (error) {
      throw error;
    }
    
    // If no data is returned from Supabase, use mock data
    if (!data || data.length === 0) {
      console.log("No agents found in database, using mock data");
      return agents;
    }
    
    return data as Agent[];
  } catch (error) {
    console.error("Error fetching agents:", error);
    // Fallback to mock data if there's an error
    return agents;
  }
}

// Fetch agent by ID
export async function fetchAgentById(id: string): Promise<Agent | null> {
  console.log(`Fetching agent with id: ${id}`);
  try {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Agent;
  } catch (error) {
    console.error("Error fetching agent:", error);
    
    // Fallback to mock data
    const agent = agents.find(agent => agent.id === id);
    return agent || null;
  }
}

// Fetch all properties
export async function fetchProperties(): Promise<Property[]> {
  console.log("Fetching properties...");
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*");
    
    if (error) {
      throw error;
    }
    
    // If no data is returned from Supabase, use mock data
    if (!data || data.length === 0) {
      console.log("No properties found in database, using mock data");
      
      // Format mock data to match our Property type
      return properties.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        featured: p.featured,
        status: p.status,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        square_feet: p.squareFeet,
        street: p.address.street,
        city: p.address.city,
        state: p.address.state,
        zip_code: p.address.zipCode,
        images: p.images,
        amenities: p.amenities,
        property_type: p.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
        year_built: p.yearBuilt,
        agent_id: p.agentId,
        created_at: p.createdAt,
      })) as Property[];
    }
    
    return data as Property[];
  } catch (error) {
    console.error("Error fetching properties:", error);
    
    // Format mock data to match our Property type
    return properties.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      featured: p.featured,
      status: p.status,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      square_feet: p.squareFeet,
      street: p.address.street,
      city: p.address.city,
      state: p.address.state,
      zip_code: p.address.zipCode,
      images: p.images,
      amenities: p.amenities,
      property_type: p.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
      year_built: p.yearBuilt,
      agent_id: p.agentId,
      created_at: p.createdAt,
    })) as Property[];
  }
}

// Fetch featured properties
export async function fetchFeaturedProperties(): Promise<Property[]> {
  console.log("Fetching featured properties...");
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("featured", true);
    
    if (error) {
      throw error;
    }
    
    // If no data is returned from Supabase, use mock data
    if (!data || data.length === 0) {
      console.log("No featured properties found in database, using mock data");
      
      // Format mock data to match our Property type
      const featuredProps = properties.filter(p => p.featured);
      return featuredProps.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        featured: p.featured,
        status: p.status,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        square_feet: p.squareFeet,
        street: p.address.street,
        city: p.address.city,
        state: p.address.state,
        zip_code: p.address.zipCode,
        images: p.images,
        amenities: p.amenities,
        property_type: p.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
        year_built: p.yearBuilt,
        agent_id: p.agentId,
        created_at: p.createdAt,
      })) as Property[];
    }
    
    return data as Property[];
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    
    // Format mock data to match our Property type
    const featuredProps = properties.filter(p => p.featured);
    return featuredProps.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      featured: p.featured,
      status: p.status,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      square_feet: p.squareFeet,
      street: p.address.street,
      city: p.address.city,
      state: p.address.state,
      zip_code: p.address.zipCode,
      images: p.images,
      amenities: p.amenities,
      property_type: p.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
      year_built: p.yearBuilt,
      agent_id: p.agentId,
      created_at: p.createdAt,
    })) as Property[];
  }
}

// Fetch property by ID
export async function fetchPropertyById(id: string): Promise<Property | null> {
  console.log(`Fetching property with id: ${id}`);
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Property;
  } catch (error) {
    console.error("Error fetching property:", error);
    
    // Fallback to mock data
    const property = properties.find(property => property.id === id);
    if (!property) return null;
    
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      featured: property.featured,
      status: property.status,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.squareFeet,
      street: property.address.street,
      city: property.address.city,
      state: property.address.state,
      zip_code: property.address.zipCode,
      images: property.images,
      amenities: property.amenities,
      property_type: property.propertyType as "House" | "Apartment" | "Condo" | "Townhouse" | "Land" | "Commercial",
      year_built: property.yearBuilt,
      agent_id: property.agentId,
      created_at: property.createdAt,
    } as Property;
  }
}

// Fetch all testimonials
export async function fetchTestimonials(): Promise<Testimonial[]> {
  console.log("Fetching testimonials...");
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*");
    
    if (error) {
      throw error;
    }
    
    // If no data is returned from Supabase, use mock data
    if (!data || data.length === 0) {
      console.log("No testimonials found in database, using mock data");
      return testimonials;
    }
    
    return data as Testimonial[];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    // Fallback to mock data if there's an error
    return testimonials;
  }
}

// Fetch all market trends
export async function fetchMarketTrends(): Promise<MarketTrend[]> {
  console.log("Fetching market trends...");
  try {
    const { data, error } = await supabase
      .from("market_trends")
      .select("*");
    
    if (error) {
      throw error;
    }
    
    // If no data is returned from Supabase, use mock data
    if (!data || data.length === 0) {
      console.log("No market trends found in database, using mock data");
      return marketTrends.map(trend => ({
        id: trend.id,
        title: trend.title,
        value: trend.value,
        trend: trend.trend as "up" | "down" | "stable",
        description: trend.description,
      }));
    }
    
    return data as MarketTrend[];
  } catch (error) {
    console.error("Error fetching market trends:", error);
    // Fallback to mock data if there's an error
    return marketTrends.map(trend => ({
      id: trend.id,
      title: trend.title,
      value: trend.value,
      trend: trend.trend as "up" | "down" | "stable",
      description: trend.description,
    }));
  }
}
