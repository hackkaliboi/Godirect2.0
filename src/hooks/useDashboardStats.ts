import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DashboardStat = Database['public']['Tables']['dashboard_stats']['Row'];

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial stats
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('dashboard_stats')
          .select('*');

        if (error) throw error;
        setStats(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('dashboard_stats_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'dashboard_stats' 
        }, 
        (payload) => {
          // Handle different types of changes
          switch (payload.eventType) {
            case 'INSERT':
              setStats(current => [...current, payload.new as DashboardStat]);
              break;
            case 'UPDATE':
              setStats(current =>
                current.map(stat =>
                  stat.stat_name === (payload.new as DashboardStat).stat_name 
                    ? (payload.new as DashboardStat) 
                    : stat
                )
              );
              break;
            case 'DELETE':
              setStats(current =>
                current.filter(stat => stat.stat_name !== payload.old.stat_name)
              );
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { stats, loading, error };
}