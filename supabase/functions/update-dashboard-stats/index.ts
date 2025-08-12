import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate total users
    const { count: totalUsers } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Calculate total properties
    const { count: totalProperties } = await supabaseClient
      .from('properties')
      .select('*', { count: 'exact', head: true });

    // Calculate active agents
    const { count: activeAgents } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'agent');

    // Calculate total revenue (from transactions table)
    const { data: revenueData } = await supabaseClient
      .from('transactions')
      .select('amount')
      .gt('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

    const totalRevenue = revenueData?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0;

    // Update dashboard stats
    const stats = [
      {
        stat_name: 'total_users',
        stat_value: totalUsers?.toString() || '0',
        stat_change: 0,
        trend: 'neutral' as const,
        compare_text: 'Updated just now'
      },
      {
        stat_name: 'total_properties',
        stat_value: totalProperties?.toString() || '0',
        stat_change: 0,
        trend: 'neutral' as const,
        compare_text: 'Updated just now'
      },
      {
        stat_name: 'active_agents',
        stat_value: activeAgents?.toString() || '0',
        stat_change: 0,
        trend: 'neutral' as const,
        compare_text: 'Updated just now'
      },
      {
        stat_name: 'total_revenue',
        stat_value: `$${totalRevenue.toFixed(2)}`,
        stat_change: 0,
        trend: 'neutral' as const,
        compare_text: 'Updated just now'
      }
    ];

    // Upsert stats
    const { error: upsertError } = await supabaseClient
      .from('dashboard_stats')
      .upsert(stats, { onConflict: 'stat_name' });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});