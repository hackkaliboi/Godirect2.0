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
    const revenueStats = await calculateRevenueMetrics(supabaseClient);
    const paymentMethodStats = await calculatePaymentMethodStats(supabaseClient);
    
    // Update the dashboard_stats table with new values
    for (const stat of dashboardStats) {
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
        stats: dashboardStats,
        revenueStats,
        paymentMethodStats 
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

  const { count: agents } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_type", "agent");

  stats.push({
    name: "users_agents",
    value: String(totalUsers || 0),
    change: 0, // You could calculate this if you track user signups over time
  });

  // Payment Approvals (pending payments)
  const { count: pendingPayments } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");

  stats.push({
    name: "payment_approvals",
    value: String(pendingPayments || 0),
    change: 0,
  });

  // Count completed sales
  const { count: propertiesSold } = await supabase
    .from("sales")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed");

  stats.push({
    name: "properties_sold",
    value: String(propertiesSold || 0),
    change: 0,
  });

  return stats;
}

async function calculateRevenueMetrics(supabase) {
  // Get the current date
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Get the beginning of current month and year
  const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-01`;
  const currentYear = `${now.getFullYear()}-01-01`;
  
  // First, check if we have revenue data for today, this month, and this year
  const { data: existingMetrics } = await supabase
    .from("revenue_metrics")
    .select("metric_type, metric_date")
    .in("metric_type", ["daily", "monthly", "yearly"])
    .in("metric_date", [today, currentMonth, currentYear]);
  
  // Calculate total revenue for today
  const { data: todayRevenue } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "Completed")
    .gte("payment_date", `${today}T00:00:00`)
    .lt("payment_date", `${today}T23:59:59`);
  
  const todayTotalRevenue = todayRevenue?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  const { count: todaySalesCount } = await supabase
    .from("sales")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed")
    .gte("sale_date", `${today}T00:00:00`)
    .lt("sale_date", `${today}T23:59:59`);
  
  // Calculate average value per sale today
  const todayAvgValue = todaySalesCount > 0 ? todayTotalRevenue / todaySalesCount : 0;
  
  // Get yesterday's metrics for comparison
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const { data: yesterdayMetric } = await supabase
    .from("revenue_metrics")
    .select("revenue")
    .eq("metric_type", "daily")
    .eq("metric_date", yesterdayStr)
    .single();
  
  // Calculate daily change percentage
  let dailyChangePercentage = 0;
  if (yesterdayMetric && yesterdayMetric.revenue > 0) {
    dailyChangePercentage = ((todayTotalRevenue - yesterdayMetric.revenue) / yesterdayMetric.revenue) * 100;
  }

  // Daily target (can be adjusted based on business rules)
  const dailyTarget = 10000; // Example target of $10,000 per day
  const dailyCompletion = (todayTotalRevenue / dailyTarget) * 100;
  
  // Similar calculations for monthly data
  const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEndDate = new Date(now);
  
  const { data: monthRevenue } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "Completed")
    .gte("payment_date", monthStartDate.toISOString())
    .lte("payment_date", monthEndDate.toISOString());
  
  const monthTotalRevenue = monthRevenue?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  
  // Get previous month for comparison
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  const { data: prevMonthRevenue } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "Completed")
    .gte("payment_date", prevMonthStart.toISOString())
    .lte("payment_date", prevMonthEnd.toISOString());
  
  const prevMonthTotalRevenue = prevMonthRevenue?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  
  // Calculate monthly change percentage
  let monthlyChangePercentage = 0;
  if (prevMonthTotalRevenue > 0) {
    monthlyChangePercentage = ((monthTotalRevenue - prevMonthTotalRevenue) / prevMonthTotalRevenue) * 100;
  }
  
  // Similar calculations for yearly data
  // ... (similar code for yearly revenue)
  
  // Upsert the metrics data
  const metrics = [
    {
      metric_type: "daily",
      metric_date: today,
      revenue: todayTotalRevenue,
      change_percentage: dailyChangePercentage,
      sales_count: todaySalesCount || 0,
      average_value: todayAvgValue,
      target_value: dailyTarget,
      completion_percentage: dailyCompletion
    },
    {
      metric_type: "monthly",
      metric_date: currentMonth,
      revenue: monthTotalRevenue,
      change_percentage: monthlyChangePercentage,
      // ... other monthly metrics
    },
    // Yearly metrics would be added similarly
  ];
  
  // Upsert the metrics
  for (const metric of metrics) {
    const { error } = await supabase
      .from("revenue_metrics")
      .upsert(metric, { 
        onConflict: 'metric_type,metric_date'
      });
    
    if (error) {
      console.error(`Error upserting ${metric.metric_type} metric:`, error);
    }
  }
  
  return metrics;
}

async function calculatePaymentMethodStats(supabase) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get all payment methods
  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("method_key, display_name");
  
  if (!paymentMethods || paymentMethods.length === 0) {
    return [];
  }
  
  // Get total payments count
  const { count: totalPayments } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed");
  
  if (!totalPayments || totalPayments === 0) {
    return [];
  }
  
  // Calculate usage for each payment method
  const stats = [];
  
  for (const method of paymentMethods) {
    const { count: methodCount } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "Completed")
      .eq("payment_method", method.method_key);
    
    const percentage = methodCount ? (methodCount / totalPayments) * 100 : 0;
    
    // Upsert the payment method stats
    const { error } = await supabase
      .from("payment_method_stats")
      .upsert({
        method_key: method.method_key,
        transaction_count: methodCount || 0,
        transaction_percentage: percentage,
        reference_date: today
      }, { 
        onConflict: 'method_key,reference_date'
      });
    
    if (error) {
      console.error(`Error upserting stats for ${method.method_key}:`, error);
    } else {
      stats.push({
        method_key: method.method_key,
        display_name: method.display_name,
        transaction_count: methodCount || 0,
        transaction_percentage: percentage
      });
    }
  }
  
  return stats;
}
