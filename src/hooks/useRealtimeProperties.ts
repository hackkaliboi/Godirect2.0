import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';

export const useRealtimeProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial properties
    const fetchProperties = async () => {
      try {
        // Check if supabase has the required methods for real queries
        if (!(supabase as any).from) {
          console.warn('Supabase client not properly configured');
          return;
        }

        const { data, error } = await (supabase as any)
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching properties:', error);
          return;
        }

        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Only subscribe to real-time property updates if the real client is available
    let channel: any = null;
    
    if ((supabase as any).channel && typeof (supabase as any).channel === 'function') {
      try {
        channel = (supabase as any)
          .channel('properties')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'properties'
          }, (payload: any) => {
            const newProperty = payload.new as Property;
            setProperties(prev => [newProperty, ...prev]);
          })
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'properties'
          }, (payload: any) => {
            const updatedProperty = payload.new as Property;
            setProperties(prev => 
              prev.map(prop => prop.id === updatedProperty.id ? updatedProperty : prop)
            );
          })
          .on('postgres_changes', {
            event: 'DELETE',
            schema: 'public',
            table: 'properties'
          }, (payload: any) => {
            const deletedProperty = payload.old as Property;
            setProperties(prev => prev.filter(prop => prop.id !== deletedProperty.id));
          })
          .subscribe();
      } catch (error) {
        console.warn('Real-time properties not available:', error);
      }
    }

    // Cleanup subscription
    return () => {
      if (channel && channel.unsubscribe) {
        channel.unsubscribe();
      }
    };
  }, []);

  return { properties, loading };
};

export const useRealtimeProperty = (propertyId: string | null) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    // Fetch initial property
    const fetchProperty = async () => {
      try {
        // Check if supabase has the required methods for real queries
        if (!(supabase as any).from) {
          console.warn('Supabase client not properly configured');
          return;
        }

        const { data, error } = await (supabase as any)
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) {
          console.error('Error fetching property:', error);
          return;
        }

        setProperty(data || null);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();

    // Only subscribe to real-time property updates if the real client is available
    let channel: any = null;
    
    if ((supabase as any).channel && typeof (supabase as any).channel === 'function') {
      try {
        channel = (supabase as any)
          .channel(`property:${propertyId}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'properties',
            filter: `id=eq.${propertyId}`
          }, (payload: any) => {
            const updatedProperty = payload.new as Property;
            setProperty(updatedProperty);
          })
          .subscribe();
      } catch (error) {
        console.warn('Real-time property updates not available:', error);
      }
    }

    // Cleanup subscription
    return () => {
      if (channel && channel.unsubscribe) {
        channel.unsubscribe();
      }
    };
  }, [propertyId]);

  return { property, loading };
};