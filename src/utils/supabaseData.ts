
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
  is_featured: boolean;
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
      console.error("Error fetching agents:", error);
      return [];
    }
    
    return (data || []) as Agent[];
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
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
    return null;
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
      console.error("Error fetching properties:", error);
      return [];
    }
    return (data || []).map(item => ({
      ...item,
      is_featured: item.featured || false,
      property_type: item.property_type as Property['property_type'],
      status: item.status as Property['status']
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}
// Fetch featured properties
export async function fetchFeaturedProperties(): Promise<Property[]> {
  console.log("Fetching featured properties...");
  try {
    // First try to fetch all properties and filter client-side
    // This is a fallback in case the featured column doesn't exist yet
    const { data, error } = await supabase
      .from("properties")
      .select("*");
    
    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
    
    // Filter for featured properties and map the data
    return (data || [])
      .filter(item => item.featured === true)
      .map(item => ({
        ...item,
        is_featured: item.featured || false,
        property_type: item.property_type as Property['property_type'],
        status: item.status as Property['status']
      }));
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
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
    
    return {
      ...data,
      is_featured: data.featured || false,
      property_type: data.property_type as Property['property_type'],
      status: data.status as Property['status']
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
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
    
    return (data || []) as Testimonial[];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
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
    
    return (data || []) as MarketTrend[];
  } catch (error) {
    console.error("Error fetching market trends:", error);
    return [];
  }
}

// Create a new property
export async function createProperty(propertyData: {
  title: string;
  description?: string;
  price: number;
  property_type: string;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year_built?: number;
  street?: string;
  city: string;
  state: string;
  zip_code?: string;
  amenities: string[];
  images: string[];
  featured?: boolean;
  agent_id?: string | null;
}): Promise<Property | null> {
  console.log("Creating property with data:", JSON.stringify(propertyData, null, 2));
  
  try {
    const insertData = {
      title: propertyData.title,
      description: propertyData.description || null,
      price: propertyData.price,
      property_type: propertyData.property_type,
      status: propertyData.status,
      bedrooms: propertyData.bedrooms || null,
      bathrooms: propertyData.bathrooms || null,
      square_feet: propertyData.square_feet || null,
      year_built: propertyData.year_built || null,
      street: propertyData.street || null,
      city: propertyData.city,
      state: propertyData.state,
      zip_code: propertyData.zip_code || null,
      amenities: propertyData.amenities || [],
      images: propertyData.images || [],
      featured: propertyData.featured || false,
      agent_id: propertyData.agent_id || null,
    };
    
    console.log("Insert data:", JSON.stringify(insertData, null, 2));
    
    const { data, error } = await supabase
      .from("properties")
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log("Property created successfully:", data);
    
    return {
      ...data,
      is_featured: data.featured || false,
      property_type: data.property_type as Property['property_type'],
      status: data.status as Property['status']
    };
  } catch (error) {
    console.error("Error in createProperty function:", error);
    throw error;
  }
}
