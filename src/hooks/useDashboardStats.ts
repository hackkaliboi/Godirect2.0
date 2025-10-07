import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Helper function to calculate date range
const getDateRange = (timeRange: string) => {
  const now = new Date();
  const startDate = new Date(now);

  switch (timeRange) {
    case '1d':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30); // Default to 30 days
  }

  return { startDate, endDate: now };
};

export function useDashboardStats(timeRange: string = '30d') {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real stats from database
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Check if supabase is properly configured
        if (!supabase || !supabase.from) {
          throw new Error('Supabase client not properly configured');
        }

        const { startDate, endDate } = getDateRange(timeRange);

        // Fetch total users (all time, not time-based)
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch total properties (all time, not time-based)
        const { count: totalProperties, error: propertiesError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        if (propertiesError) throw propertiesError;

        // Fetch active agents (profiles with user_type = 'agent') (all time, not time-based)
        const { count: activeAgents, error: agentsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'agent');

        if (agentsError) throw agentsError;

        // Fetch total transactions within time range
        const { count: totalTransactions, error: transactionsError } = await (supabase as any)
          .from('property_transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (transactionsError) throw transactionsError;

        // Fetch pending properties (all time, not time-based)
        const { count: pendingProperties, error: pendingError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Calculate revenue from transactions within time range
        const { data: transactions, error: revenueError } = await (supabase as any)
          .from('property_transactions')
          .select('price')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (revenueError) throw revenueError;

        // Sum up the transaction prices for revenue
        const totalRevenue = transactions?.reduce((sum, transaction) => sum + (transaction.price || 0), 0) || 0;

        // Fetch today's property views
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { count: todayViews, error: viewsError } = await (supabase as any)
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .gte('viewed_at', today.toISOString())
          .lt('viewed_at', tomorrow.toISOString());

        if (viewsError) throw viewsError;

        // Calculate conversion rate (inquiries to transactions)
        // For now, we'll use a simple calculation based on the time range
        const { count: totalInquiries, error: inquiriesError } = await (supabase as any)
          .from('property_inquiries')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (inquiriesError) throw inquiriesError;

        // Conversion rate calculation (transactions / inquiries * 100)
        const conversionRate = totalInquiries && totalInquiries > 0
          ? ((totalTransactions || 0) / totalInquiries * 100).toFixed(1)
          : '0.0';

        // Create stats array
        const statsData = [
          {
            stat_name: 'total_users',
            stat_value: totalUsers?.toString() || '0',
            compare_text: 'Total registered users',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'total_properties',
            stat_value: totalProperties?.toString() || '0',
            compare_text: 'Active property listings',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'active_agents',
            stat_value: activeAgents?.toString() || '0',
            compare_text: 'Verified real estate agents',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'total_revenue',
            stat_value: `₦${totalRevenue.toLocaleString()}`,
            compare_text: 'Total platform revenue',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'pending_properties',
            stat_value: pendingProperties?.toString() || '0',
            compare_text: 'Properties awaiting approval',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'total_transactions',
            stat_value: totalTransactions?.toString() || '0',
            compare_text: 'Completed transactions',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'today_views',
            stat_value: todayViews?.toString() || '0',
            compare_text: 'Property views today',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'conversion_rate',
            stat_value: `${conversionRate}%`,
            compare_text: 'Inquiry to transaction rate',
            updated_at: new Date().toISOString()
          }
        ];

        setStats(statsData);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
        // Set default stats when there's an error
        setStats([
          {
            stat_name: 'total_users',
            stat_value: '0',
            compare_text: 'Total registered users',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'total_properties',
            stat_value: '0',
            compare_text: 'Active property listings',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'active_agents',
            stat_value: '0',
            compare_text: 'Verified real estate agents',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'total_revenue',
            stat_value: '₦0',
            compare_text: 'Total platform revenue',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'pending_properties',
            stat_value: '0',
            compare_text: 'Properties awaiting approval',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'total_transactions',
            stat_value: '0',
            compare_text: 'Completed transactions',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'today_views',
            stat_value: '0',
            compare_text: 'Property views today',
            updated_at: new Date().toISOString()
          },
          {
            stat_name: 'conversion_rate',
            stat_value: '0%',
            compare_text: 'Inquiry to transaction rate',
            updated_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Only set up real-time subscriptions if supabase is properly configured
    if (supabase && supabase.channel) {
      try {
        // Simple approach - just refetch stats periodically
        const interval = setInterval(() => {
          fetchStats();
        }, 30000); // Refetch every 30 seconds

        // Cleanup interval
        return () => {
          clearInterval(interval);
        };
      } catch (e) {
        console.error('Error setting up periodic stats updates:', e);
      }
    }
  }, [timeRange]);

  return { stats, loading, error };
}