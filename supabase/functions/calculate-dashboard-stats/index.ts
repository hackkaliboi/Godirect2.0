
// supabase/functions/calculate-dashboard-stats/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is an admin
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (profile?.user_type !== "admin") {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate actual stats from database
    const dashboardStats = await calculateDashboardStats(supabaseClient);
    
    // Update the dashboard_stats table with new values
    for (const stat of dashboardStats) {
      // Check if the stat exists
      const { data: existingStat } = await supabaseClient
        .from("dashboard_stats")
        .select("*")
        .eq("stat_name", stat.name)
        .single();

      if (existingStat) {
        // Update existing stat
        const { error } = await supabaseClient
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
        const { error } = await supabaseClient
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
    }
    
    // Log activity
    await supabaseClient.from("activity_log").insert({
      activity_type: "dashboard_update",
      description: "Dashboard statistics updated by admin",
      user_id: user.id
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats: dashboardStats
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function calculateDashboardStats(supabase) {
  const stats = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

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

  stats.push({
    name: "total_revenue",
    value: totalRevenue >= 1000000 ? `$${(totalRevenue / 1000000).toFixed(2)}M` : `$${(totalRevenue / 1000).toFixed(0)}K`,
    change: parseFloat(revenueChange.toFixed(1)),
  });

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

  stats.push({
    name: "active_listings",
    value: String(activeListings || 0),
    change: parseFloat(listingsChange.toFixed(1)),
  });

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

  stats.push({
    name: "users_agents",
    value: String(totalUsers || 0),
    change: parseFloat(usersChange.toFixed(1)),
  });

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

  stats.push({
    name: "payment_approvals",
    value: String(pendingPayments || 0),
    change: parseFloat(pendingChange.toFixed(1)),
  });

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

  stats.push({
    name: "properties_sold",
    value: String(propertiesSold || 0),
    change: parseFloat(soldChange.toFixed(1)),
  });

  return stats;
}
