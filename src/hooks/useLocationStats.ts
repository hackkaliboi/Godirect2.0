import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LocationStat {
  city: string;
  count: number;
}

export const useLocationStats = () => {
  const [stats, setStats] = useState<LocationStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLocationStats = async () => {
      try {
        setLoading(true);
        // We want to count available properties per city
        // Since Supabase doesn't support generic GROUP BY with count easily via the JS client without RPC,
        // we'll fetch all available properties and aggregate client-side for now,
        // or usage of .select('city', { count: 'exact', head: false })? No, that gives total.
        
        // Best approach without RPC for smaller datasets:
        // Fetch 'city' from properties where status = 'available'
        const { data, error } = await supabase
          .from('properties')
          .select('city')
          .eq('status', 'available');

        if (error) throw error;

        if (data) {
          // Aggregate counts
          const cityCounts: Record<string, number> = {};
          data.forEach((item: { city: string }) => {
            const city = item.city; // normalize if needed (e.g. city.trim())
            if (city) {
              cityCounts[city] = (cityCounts[city] || 0) + 1;
            }
          });

          const statsArray: LocationStat[] = Object.entries(cityCounts).map(([city, count]) => ({
            city,
            count
          }));
          
          setStats(statsArray);
        }
      } catch (err: any) {
        console.error('Error fetching location stats:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationStats();
  }, []);

  const getCountForCity = (cityName: string): number => {
    const stat = stats.find(s => s.city.toLowerCase() === cityName.toLowerCase());
    return stat ? stat.count : 0;
  };

  return { stats, loading, error, getCountForCity };
};
