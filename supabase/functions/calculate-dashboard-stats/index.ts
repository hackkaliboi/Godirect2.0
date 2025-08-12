
// supabase/functions/calculate-dashboard-stats/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stats calculation functions
interface StatData {
  name: string;
  value: string;
  change: number;
}

interface QueryBuilder {
  select: (query: string) => QueryBuilder;
  insert: (data: Record<string, unknown>) => QueryBuilder;
  update: (data: Record<string, unknown>) => QueryBuilder;
  eq: (column: string, value: unknown) => QueryBuilder;
  in: (column: string, values: unknown[]) => QueryBuilder;
  lt: (column: string, value: string) => QueryBuilder;
  gte: (column: string, value: string) => QueryBuilder;
  single: () => QueryBuilder;
}

interface SupabaseClientWithAuth {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string; [key: string]: unknown } | null } }>;
  };
  from: (table: string) => QueryBuilder;
}

// Handle CORS preflight requests
const handleCORS = (req: Request): Response | null => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return null;
};

// Create Supabase client with user auth context
const createSupabaseClient = (req: Request): SupabaseClientWithAuth => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );
};

// Authenticate the user and check if they're an admin
const authenticateAdmin = async (
  supabase: SupabaseClientWithAuth
): Promise<{ user: { id: string; [key: string]: unknown } | null; isAdmin: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, isAdmin: false, error: "Unauthorized" };
    }

    // Check if user is an admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (profile?.user_type !== "admin") {
      return { user, isAdmin: false, error: "Unauthorized: Admin access required" };
    }

    return { user, isAdmin: true };
  } catch (error) {
    return { user: null, isAdmin: false, error: error.message };
  }
};

// Update or insert a stat in the dashboard_stats table
const updateDashboardStat = async (
  supabase: SupabaseClientWithAuth,
  stat: StatData
): Promise<void> => {
  // Check if the stat exists
  const { data: existingStat } = await supabase
    .from("dashboard_stats")
    .select("*")
    .eq("stat_name", stat.name)
    .single();

  if (existingStat) {
    // Update existing stat
    const { error } = await supabase
      .from("dashboard_stats")
      .update({
        stat_value: stat.value,
        stat_change: stat.change,
        updated_at: new Date().toISOString(),
      })
      .eq("stat_name", stat.name);

    if (error) {
      console.error(`Error updating ${stat.name}:`, error);
    }
  } else {
    // Insert new stat
    const { error } = await supabase
      .from("dashboard_stats")
      .insert({
        stat_name: stat.name,
        stat_value: stat.value,
        stat_change: stat.change,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(`Error inserting ${stat.name}:`, error);
    }
  }
};

// Log the admin activity
const logAdminActivity = async (
  supabase: SupabaseClientWithAuth,
  userId: string
): Promise<void> => {
  await supabase.from("activity_log").insert({
    activity_type: "dashboard_update",
    description: "Dashboard statistics updated by admin",
    user_id: userId,
  });
};

// Calculate total revenue stat
const calculateTotalRevenue = async (
  supabase: SupabaseClientWithAuth, 
  thirtyDaysAgo: Date, 
  sixtyDaysAgo: Date
): Promise<StatData> => {
  // Total Revenue (from payments table)
  const { data: revenueData } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "Completed");
  
  const totalRevenue = revenueData?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  
  // Calculate revenue change (compare with previous 30 days)
  const { data: previousRevenueData } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "Completed")
    .lt("payment_date", thirtyDaysAgo.toISOString())
    .gte("payment_date", sixtyDaysAgo.toISOString());
  
  const previousRevenue = previousRevenueData?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 1; // Avoid division by zero
  const revenueChange = (totalRevenue - previousRevenue) / previousRevenue * 100;

  return {
    name: "total_revenue",
    value: totalRevenue >= 1000000 ? `$${(totalRevenue / 1000000).toFixed(2)}M` : `$${(totalRevenue / 1000).toFixed(0)}K`,
    change: parseFloat(revenueChange.toFixed(1)),
  };
};

// Calculate active listings stat
const calculateActiveListings = async (
  supabase: SupabaseClientWithAuth, 
  thirtyDaysAgo: Date
): Promise<StatData> => {
  // Count active listings
  const { count: activeListings } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .in("status", ["For Sale", "For Rent"]);

  // Get previous active listings count for comparison
  const { count: previousActiveListings } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .in("status", ["For Sale", "For Rent"])
    .lt("created_at", thirtyDaysAgo.toISOString());

  const listingsChange = previousActiveListings ? 
    ((activeListings - previousActiveListings) / previousActiveListings) * 100 : 0;

  return {
    name: "active_listings",
    value: String(activeListings || 0),
    change: parseFloat(listingsChange.toFixed(1)),
  };
};

// Calculate users and agents stat
const calculateUsersAgents = async (
  supabase: SupabaseClientWithAuth, 
  thirtyDaysAgo: Date
): Promise<StatData> => {
  // Count users and agents
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Count previous month users
  const { count: prevMonthUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .lt("created_at", thirtyDaysAgo.toISOString());

  const usersChange = prevMonthUsers ? 
    ((totalUsers - prevMonthUsers) / prevMonthUsers) * 100 : 0;

  return {
    name: "users_agents",
    value: String(totalUsers || 0),
    change: parseFloat(usersChange.toFixed(1)),
  };
};

// Calculate pending payments stat
const calculatePendingPayments = async (
  supabase: SupabaseClientWithAuth, 
  thirtyDaysAgo: Date
): Promise<StatData> => {
  // Payment Approvals (pending payments)
  const { count: pendingPayments } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");

  // Previous pending payments count
  const { count: prevPendingPayments } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending")
    .lt("created_at", thirtyDaysAgo.toISOString());

  const pendingChange = prevPendingPayments ? 
    ((pendingPayments - prevPendingPayments) / prevPendingPayments) * 100 : 0;

  return {
    name: "payment_approvals",
    value: String(pendingPayments || 0),
    change: parseFloat(pendingChange.toFixed(1)),
  };
};

// Calculate properties sold stat
const calculatePropertiesSold = async (
  supabase: SupabaseClientWithAuth, 
  thirtyDaysAgo: Date
): Promise<StatData> => {
  // Count completed sales
  const { count: propertiesSold } = await supabase
    .from("sales")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed");

  // Previous month completed sales
  const { count: prevPropertiesSold } = await supabase
    .from("sales")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed")
    .lt("created_at", thirtyDaysAgo.toISOString());

  const soldChange = prevPropertiesSold ? 
    ((propertiesSold - prevPropertiesSold) / prevPropertiesSold) * 100 : 0;

  return {
    name: "properties_sold",
    value: String(propertiesSold || 0),
    change: parseFloat(soldChange.toFixed(1)),
  };
};

// Main function to calculate all dashboard stats
const calculateDashboardStats = async (
  supabase: SupabaseClientWithAuth
): Promise<StatData[]> => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Calculate each stat in parallel for better performance
  const stats = await Promise.all([
    calculateTotalRevenue(supabase, thirtyDaysAgo, sixtyDaysAgo),
    calculateActiveListings(supabase, thirtyDaysAgo),
    calculateUsersAgents(supabase, thirtyDaysAgo),
    calculatePendingPayments(supabase, thirtyDaysAgo),
    calculatePropertiesSold(supabase, thirtyDaysAgo)
  ]);

  return stats;
};

// Main request handler
serve(async (req: Request) => {
  // Handle CORS preflight requests
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    // Create Supabase client with auth context
    const supabaseClient = createSupabaseClient(req);

    // Authenticate and check if user is admin
    const { user, isAdmin, error } = await authenticateAdmin(supabaseClient);
    
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: error || "Unauthorized" }),
        { status: error ? 401 : 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate dashboard stats
    const dashboardStats = await calculateDashboardStats(supabaseClient);
    
    // Update the dashboard_stats table with new values
    await Promise.all(dashboardStats.map(stat => updateDashboardStat(supabaseClient, stat)));
    
    // Log activity
    await logAdminActivity(supabaseClient, user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats: dashboardStats
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
