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

// Update property (for admin editing)
export async function updateProperty(propertyId: string, propertyData: Partial<Property>): Promise<Property | null> {
  console.log(`Updating property ${propertyId} with data:`, propertyData);
  try {
    const { data, error } = await supabase
      .from("properties")
      .update({ ...propertyData, updated_at: new Date().toISOString() })
      .eq("id", propertyId)
      .select()
      .single();

    if (error) {
      console.error("Error updating property:", error);
      throw error;
    }

    console.log("Property updated successfully:", data);
    return data as Property;
  } catch (error) {
    console.error("Error in updateProperty function:", error);
    throw error;
  }
}

// Fetch user's properties (properties they own)
export async function fetchUserProperties(userId: string): Promise<Property[]> {
  console.log(`Fetching properties for user ${userId}`);
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", userId);

    if (error) {
      console.error("Error fetching user properties:", error);
      throw error;
    }

    return (data || []) as Property[];
  } catch (error) {
    console.error("Error in fetchUserProperties function:", error);
    throw error;
  }
}

// Fetch user's saved properties
export async function fetchUserSavedProperties(userId: string): Promise<any[]> {
  console.log(`Fetching saved properties for user ${userId}`);
  try {
    const { data, error } = await supabase
      .from("property_favorites") // Using the actual database table name
      .select(`
        *,
        property:properties(*)
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user saved properties:", error);
      throw error;
    }

    return (data || []);
  } catch (error) {
    console.error("Error in fetchUserSavedProperties function:", error);
    throw error;
  }
}

// Add property to user's favorites
export async function addUserFavorite(userId: string, propertyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("property_favorites")
      .insert({
        user_id: userId,
        property_id: propertyId
      });

    if (error) {
      console.error("Error adding favorite:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in addUserFavorite function:", error);
    return false;
  }
}

// Remove property from user's favorites
export async function removeUserFavorite(userId: string, propertyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("property_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("property_id", propertyId);

    if (error) {
      console.error("Error removing favorite:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in removeUserFavorite function:", error);
    return false;
  }
}

// Check if property is in user's favorites
export async function isPropertyFavorite(userId: string, propertyId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("property_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("property_id", propertyId)
      .limit(1);

    if (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error in isPropertyFavorite function:", error);
    return false;
  }
}

// Fetch user's property views
export async function fetchUserPropertyViews(userId: string): Promise<any[]> {
  console.log(`Fetching property views for user ${userId}`);
  try {
    const { data, error } = await supabase
      .from("property_views")
      .select(`
        *,
        property:properties(title, price, images)
      `)
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching user property views:", error);
      throw error;
    }

    return (data || []);
  } catch (error) {
    console.error("Error in fetchUserPropertyViews function:", error);
    throw error;
  }
}

// Fetch user's inquiries
export async function fetchUserInquiries(userId: string): Promise<any[]> {
  console.log(`Fetching inquiries for user ${userId}`);
  try {
    const { data, error } = await supabase
      .from("property_inquiries")
      .select(`
        *,
        property:properties(title, price, images)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching user inquiries:", error);
      throw error;
    }

    return (data || []);
  } catch (error) {
    console.error("Error in fetchUserInquiries function:", error);
    throw error;
  }
}

// Fetch user's viewings (scheduled appointments)
export async function fetchUserViewings(userId: string): Promise<any[]> {
  console.log(`Fetching viewings for user ${userId}`);
  try {
    const { data, error } = await supabase
      .from("property_viewings")
      .select(`
        *,
        property:properties(title, price, images, street, city, state)
      `)
      .eq("user_id", userId)
      .order("viewing_date", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching user viewings:", error);
      throw error;
    }

    return (data || []);
  } catch (error) {
    console.error("Error in fetchUserViewings function:", error);
    throw error;
  }
}

// Fetch user dashboard stats
export async function fetchUserDashboardStats(userId: string): Promise<any[]> {
  console.log(`Fetching dashboard stats for user ${userId}`);
  try {
    // Fetch saved properties count
    const { count: savedPropertiesCount, error: savedPropertiesError } = await supabase
      .from("property_favorites") // Using the actual database table name
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (savedPropertiesError) throw savedPropertiesError;

    // Fetch property views count
    const { count: propertyViewsCount, error: propertyViewsError } = await supabase
      .from("property_views")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (propertyViewsError) throw propertyViewsError;

    // Fetch inquiries count
    const { count: inquiriesCount, error: inquiriesError } = await supabase
      .from("property_inquiries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (inquiriesError) throw inquiriesError;

    // Fetch viewings count (scheduled appointments)
    const { count: viewingsCount, error: viewingsError } = await supabase
      .from("property_viewings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (viewingsError) throw viewingsError;

    // Fetch user's listed properties count
    const { count: listedPropertiesCount, error: listedPropertiesError } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId);

    if (listedPropertiesError) throw listedPropertiesError;

    // Create stats array
    const statsData = [
      {
        stat_name: "user_saved_properties",
        stat_value: savedPropertiesCount?.toString() || "0",
        compare_text: "Properties you've saved",
        updated_at: new Date().toISOString()
      },
      {
        stat_name: "user_property_views",
        stat_value: propertyViewsCount?.toString() || "0",
        compare_text: "Properties you've viewed",
        updated_at: new Date().toISOString()
      },
      {
        stat_name: "user_inquiries_sent",
        stat_value: inquiriesCount?.toString() || "0",
        compare_text: "Inquiries you've sent",
        updated_at: new Date().toISOString()
      },
      {
        stat_name: "user_scheduled_tours",
        stat_value: viewingsCount?.toString() || "0",
        compare_text: "Scheduled property tours",
        updated_at: new Date().toISOString()
      },
      {
        stat_name: "user_listed_properties",
        stat_value: listedPropertiesCount?.toString() || "0",
        compare_text: "Properties you've listed",
        updated_at: new Date().toISOString()
      }
    ];

    return statsData;
  } catch (error) {
    console.error("Error in fetchUserDashboardStats function:", error);
    throw error;
  }
}

// Fetch user recent activities
export async function fetchUserRecentActivities(userId: string): Promise<any[]> {
  console.log(`Fetching recent activities for user ${userId}`);
  try {
    // Fetch recent property views
    const { data: propertyViews, error: viewsError } = await supabase
      .from("property_views")
      .select(`
        id,
        property_id,
        viewed_at,
        property:properties(title)
      `)
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(5);

    if (viewsError) throw viewsError;

    // Fetch recent inquiries
    const { data: inquiries, error: inquiriesError } = await supabase
      .from("property_inquiries")
      .select(`
        id,
        property_id,
        created_at,
        property:properties(title)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (inquiriesError) throw inquiriesError;

    // Fetch recent viewings (scheduled appointments)
    const { data: viewings, error: viewingsError } = await supabase
      .from("property_viewings")
      .select(`
        id,
        property_id,
        viewing_date,
        status,
        property:properties(title)
      `)
      .eq("user_id", userId)
      .order("viewing_date", { ascending: false })
      .limit(5);

    if (viewingsError) throw viewingsError;

    // Combine and sort all activities
    const allActivities = [
      ...propertyViews.map(view => ({
        id: view.id,
        type: "property" as const,
        title: "Viewed Property",
        description: view.property?.title || "Unknown property",
        timestamp: new Date(view.viewed_at),
        status: "completed" as const
      })),
      ...inquiries.map(inquiry => ({
        id: inquiry.id,
        type: "message" as const,
        title: "Sent Inquiry",
        description: inquiry.property?.title || "Unknown property",
        timestamp: new Date(inquiry.created_at),
        status: "completed" as const
      })),
      ...viewings.map(viewing => ({
        id: viewing.id,
        type: "transaction" as const,
        title: "Scheduled Viewing",
        description: viewing.property?.title || "Unknown property",
        timestamp: new Date(viewing.viewing_date),
        status: viewing.status
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Take only the 10 most recent

    return allActivities;
  } catch (error) {
    console.error("Error in fetchUserRecentActivities function:", error);
    throw error;
  }
}

// Fetch unique property types from the database
export async function fetchPropertyTypes(): Promise<string[]> {
  console.log("Fetching property types...");
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("property_type");

    if (error) {
      console.error("Error fetching property types:", error);
      return [];
    }

    // Extract unique property types
    const propertyTypes = [...new Set(data.map(item => item.property_type))];
    return propertyTypes.filter(type => type !== null && type !== undefined) as string[];
  } catch (error) {
    console.error("Error fetching property types:", error);
    return [];
  }
}

// Fetch price ranges from the database
export async function fetchPriceRanges(): Promise<{ min: number; max: number; label: string }[]> {
  console.log("Fetching price ranges...");
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("price");

    if (error) {
      console.error("Error fetching price ranges:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Calculate min and max prices
    const prices = data.map(item => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Create price ranges based on the data
    const ranges = [];

    // For Nigerian properties, we'll create ranges in millions of Naira
    const rangeSize = 50000000; // 50 million Naira increments
    let currentMin = Math.floor(minPrice / rangeSize) * rangeSize;

    while (currentMin <= maxPrice) {
      const currentMax = currentMin + rangeSize - 1;
      const count = prices.filter(price => price >= currentMin && price <= currentMax).length;

      if (count > 0) {
        // Format the label
        const minLabel = currentMin >= 1000000 ? `${(currentMin / 1000000).toFixed(0)}M` : currentMin.toLocaleString();
        const maxLabel = currentMax >= 1000000 ? `${(currentMax / 1000000).toFixed(0)}M` : currentMax.toLocaleString();
        ranges.push({
          min: currentMin,
          max: currentMax,
          label: `₦${minLabel} - ₦${maxLabel}`
        });
      }

      currentMin += rangeSize;
    }

    return ranges;
  } catch (error) {
    console.error("Error fetching price ranges:", error);
    return [];
  }
}
