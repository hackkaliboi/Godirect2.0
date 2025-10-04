import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardStats() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real stats from database
    const fetchStats = async () => {
      try {
        // Check if supabase is properly configured
        if (!supabase || !supabase.from) {
          throw new Error('Supabase client not properly configured');
        }

        // Fetch total users
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch total properties
        const { count: totalProperties, error: propertiesError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        if (propertiesError) throw propertiesError;

        // Fetch active agents (profiles with user_type = 'agent')
        const { count: activeAgents, error: agentsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_type', 'agent');

        if (agentsError) throw agentsError;

        // Create stats array (using 0 for revenue until we can fix the types issue)
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
            stat_value: '₦0',
            compare_text: 'Total platform revenue',
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
  }, []);

  return { stats, loading, error };
}