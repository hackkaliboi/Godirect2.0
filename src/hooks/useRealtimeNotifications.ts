import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Notification as NotificationType } from '@/types/database';

export const useRealtimeNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        // Check if supabase has the required methods for real queries
        if (!(supabase as any).from) {
          console.warn('Supabase client not properly configured');
          return;
        }

        const { data, error } = await (supabase as any)
          .from('notifications')
          .select('*')
          .eq('recipient_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        setNotifications(data || []);
        setUnreadCount(data?.filter(n => !n.is_read).length || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Only subscribe to real-time notifications if the real client is available
    let channel: any = null;
    
    if ((supabase as any).channel && typeof (supabase as any).channel === 'function') {
      try {
        channel = (supabase as any)
          .channel('notifications')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${userId}`
          }, (payload: any) => {
            const newNotification = payload.new as NotificationType;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show browser notification if permission is granted
            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification('New Notification', {
                  body: newNotification.title,
                  icon: '/favicon.ico'
                });
              }
            }
          })
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${userId}`
          }, (payload: any) => {
            const updatedNotification = payload.new as NotificationType;
            setNotifications(prev => 
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
            
            // Update unread count
            const unread = notifications.filter(n => !n.is_read).length;
            setUnreadCount(unread);
          })
          .on('postgres_changes', {
            event: 'DELETE',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${userId}`
          }, (payload: any) => {
            const deletedId = payload.old.id;
            setNotifications(prev => prev.filter(n => n.id !== deletedId));
            
            // Update unread count
            const unread = notifications.filter(n => !n.is_read).length;
            setUnreadCount(unread);
          })
          .subscribe();
      } catch (error) {
        console.warn('Real-time notifications not available:', error);
      }
    }

    // Cleanup subscription
    return () => {
      if (channel && channel.unsubscribe) {
        channel.unsubscribe();
      }
    };
  }, [userId]);

  return { notifications, unreadCount, loading };
};