import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, ConversationWithMessages } from '@/types/database';

export const useRealtimeMessages = (conversationId: string | null, userId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!conversationId || !userId) {
      setLoading(false);
      return;
    }

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        // Check if supabase has the required methods for real queries
        if (!(supabase as any).from) {
          console.warn('Supabase client not properly configured');
          return;
        }

        const { data, error } = await (supabase as any)
          .from('messages')
          .select(`
            *,
            sender:profiles(id, full_name, avatar_url)
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Only subscribe to real-time messages if the real client is available
    let channel: any = null;
    
    if ((supabase as any).channel && typeof (supabase as any).channel === 'function') {
      try {
        channel = (supabase as any)
          .channel(`messages:${conversationId}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          }, async (payload: any) => {
            const newMessage = payload.new as Message;
            
            // Fetch sender information
            const { data: sender } = await (supabase as any)
              .from('profiles')
              .select('id, full_name, avatar_url')
              .eq('id', newMessage.sender_id)
              .single();
            
            const messageWithSender = {
              ...newMessage,
              sender: sender || null
            };
            
            setMessages(prev => [...prev, messageWithSender]);
            setNewMessage(messageWithSender);
            
            // Update conversation's last_message_at
            await (supabase as any)
              .from('conversations')
              .update({ last_message_at: new Date().toISOString() })
              .eq('id', conversationId);
          })
          .subscribe();
      } catch (error) {
        console.warn('Real-time messaging not available:', error);
      }
    }

    // Cleanup subscription
    return () => {
      if (channel && channel.unsubscribe) {
        channel.unsubscribe();
      }
    };
  }, [conversationId, userId]);

  return { messages, loading, newMessage, setNewMessage };
};

export const useRealtimeConversations = (userId: string | null) => {
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch initial conversations
    const fetchConversations = async () => {
      try {
        // Check if supabase has the required methods for real queries
        if (!(supabase as any).from) {
          console.warn('Supabase client not properly configured');
          return;
        }

        // Use the correct Supabase query syntax
        const { data, error } = await (supabase as any)
          .from('conversations')
          .select(`
            *,
            property:properties(id, title, price, images, city, state, bedrooms, bathrooms, property_type),
            user:profiles(id, full_name, avatar_url, email),
            messages(*)
          `)
          .or(`user_id.eq.${userId},title.ilike.%${userId}%`)
          .order('last_message_at', { ascending: false });

        if (error) {
          console.error('Error fetching conversations:', error);
          return;
        }

        setConversations(data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Only subscribe to real-time conversations if the real client is available
    let channel: any = null;
    
    if ((supabase as any).channel && typeof (supabase as any).channel === 'function') {
      try {
        channel = (supabase as any)
          .channel('conversations')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'conversations'
          }, (payload: any) => {
            const newConversation = payload.new as ConversationWithMessages;
            setConversations(prev => [newConversation, ...prev]);
          })
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations'
          }, (payload: any) => {
            const updatedConversation = payload.new as ConversationWithMessages;
            setConversations(prev => 
              prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
            );
          })
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          }, async (payload: any) => {
            // When a new message is inserted, update the conversation list
            const newMessage = payload.new as Message;
            
            // Fetch the updated conversation
            const { data: updatedConversation } = await (supabase as any)
              .from('conversations')
              .select(`
                *,
                property:properties(id, title, price, images, city, state, bedrooms, bathrooms, property_type),
                user:profiles(id, full_name, avatar_url, email),
                messages(*)
              `)
              .eq('id', newMessage.conversation_id)
              .single();
            
            if (updatedConversation) {
              setConversations(prev => {
                // Remove the old conversation and add the updated one
                const filtered = prev.filter(conv => conv.id !== updatedConversation.id);
                return [updatedConversation, ...filtered];
              });
            }
          })
          .subscribe();
      } catch (error) {
        console.warn('Real-time conversations not available:', error);
      }
    }

    // Cleanup subscription
    return () => {
      if (channel && channel.unsubscribe) {
        channel.unsubscribe();
      }
    };
  }, [userId]);

  return { conversations, loading };
};