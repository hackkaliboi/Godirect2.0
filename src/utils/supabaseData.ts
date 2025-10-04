import { supabase } from "@/integrations/supabase/client";
import { Property as DatabaseProperty } from "@/types/database";

// Types
// Remove Agent type since users act as their own agents

export type Property = DatabaseProperty;

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

// Fetch all properties
export async function fetchProperties(): Promise<Property[]> {
  console.log("Fetching properties...");
  try {
    // Check if supabase is properly configured
    if (!supabase || !supabase.from) {
      console.error("Supabase client not properly configured");
      return [];
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*");
    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    console.log("Raw properties data:", data);

    return (data || []) as Property[];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// Fetch properties that need approval (pending status)
export async function fetchPendingProperties(): Promise<Property[]> {
  console.log("Fetching pending properties...");
  try {
    // Check if supabase is properly configured
    if (!supabase || !supabase.from) {
      console.error("Supabase client not properly configured");
      return [];
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching pending properties:", error);
      return [];
    }

    console.log("Raw pending properties data:", data);

    return (data || []) as Property[];
  } catch (error) {
    console.error("Error fetching pending properties:", error);
    return [];
  }
}

// Fetch featured properties
export async function fetchFeaturedProperties(): Promise<Property[]> {
  console.log("Fetching featured properties...");
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true);

    if (error) {
      console.error("Error fetching featured properties:", error);
      return [];
    }

    return (data || []) as Property[];
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

    return data as Property;
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
  lot_size?: number;
  year_built?: number;
  street: string;
  city: string;
  state: string;
  zip_code?: string;
  country: string;
  features: string[];
  amenities: string[];
  images: string[];
  is_featured?: boolean;
  owner_id?: string | null;
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
      lot_size: propertyData.lot_size || null,
      year_built: propertyData.year_built || null,
      street: propertyData.street,
      city: propertyData.city,
      state: propertyData.state,
      zip_code: propertyData.zip_code || null,
      country: propertyData.country,
      features: propertyData.features || [],
      amenities: propertyData.amenities || [],
      images: propertyData.images || [],
      is_featured: propertyData.is_featured || false,
      owner_id: propertyData.owner_id || null,
      address: `${propertyData.street}, ${propertyData.city}, ${propertyData.state}`
    };

    console.log("Insert data:", JSON.stringify(insertData, null, 2));

    const { data, error } = await supabase
      .from("properties")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message || 'Unknown error',
        details: 'details' in error ? error.details : 'N/A',
        hint: 'hint' in error ? error.hint : 'N/A',
        code: 'code' in error ? error.code : 'N/A'
      });
      // Let's also log the insertData that caused the error
      console.error("Data that caused the error:", insertData);
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }

    console.log("Property created successfully:", data);

    return data as Property;
  } catch (error) {
    console.error("Error in createProperty function:", error);
    throw error;
  }
}

// Update property status (for admin approval/rejection)
export async function updatePropertyStatus(propertyId: string, status: string): Promise<Property | null> {
  console.log(`Updating property ${propertyId} status to ${status}`);
  try {
    const { data, error } = await supabase
      .from("properties")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", propertyId)
      .select()
      .single();

    if (error) {
      console.error("Error updating property status:", error);
      throw error;
    }

    console.log("Property status updated successfully:", data);
    return data as Property;
  } catch (error) {
    console.error("Error in updatePropertyStatus function:", error);
    throw error;
  }
}