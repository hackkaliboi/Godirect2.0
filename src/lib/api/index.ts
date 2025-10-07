import { supabase } from '@/integrations/supabase/client';
import {
  Conversation,
  Message,
  PropertyViewing,
  Lead,
  LeadActivity,
  PropertyInquiry,
  Notification,
  SavedSearch,
  PaymentTransaction,
  CreateViewingRequest,
  CreateInquiryRequest,
  CreateLeadRequest,
  SendMessageRequest,
  ConversationWithMessages,
  ViewingWithDetails,
  LeadWithActivities
} from '@/types/database';

// =====================
// MESSAGING & CONVERSATIONS
// =====================

export const conversationsApi = {
  // Create a new conversation for a property
  async createConversation(propertyId: string, userId: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        property_id: propertyId,
        user_id: userId,
        title: 'Property Inquiry'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new direct conversation between users
  async createDirectConversation(userId: string, title: string = 'Direct Message'): Promise<Conversation> {
    const { data: currentUser } = await supabase.auth.getUser();
    console.log("Creating direct conversation:", { userId, title, currentUser });

    // For admin to user conversations, the admin should be the conversation owner
    // This ensures both admin and user can access the conversation
    const conversationOwnerId = currentUser.user?.id;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: conversationOwnerId, // Admin is the conversation owner
        title: title
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      console.error("Error details:", {
        message: error.message,
        ...(error as any).code && { code: (error as any).code },
        ...(error as any).details && { details: (error as any).details },
        ...(error as any).hint && { hint: (error as any).hint }
      });
      throw error;
    }

    console.log("Created conversation:", data);

    // Update the conversation's last_message_at to ensure it appears correctly
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', data.id);

    if (updateError) {
      console.error("Error updating conversation last_message_at:", updateError);
    }

    return data;
  },

  // Get conversations for a user
  async getConversations(userId: string): Promise<ConversationWithMessages[]> {
    try {
      console.log("Fetching conversations for user:", userId);

      // Get all conversations where user is involved in some way
      // This includes:
      // 1. Conversations owned by the user
      // 2. Conversations with titles containing the user ID (direct messages from admin)
      // 3. Conversations where user has sent messages

      const { data, error } = await (supabase as any)
        .from('conversations')
        .select(`
          *,
          property:properties(id, title, price, images, city, state, bedrooms, bathrooms, property_type, street),
          messages(*)
        `)
        .or(`user_id.eq.${userId},title.ilike.%${userId}%`);

      console.log("Fetched conversations for user", userId, ":", data);
      console.log("Fetch error:", error);

      if (error) {
        console.error("Error fetching conversations:", error);
        console.error("Error details:", {
          message: error.message,
          ...(error as any).code && { code: (error as any).code },
          ...(error as any).details && { details: (error as any).details },
          ...(error as any).hint && { hint: (error as any).hint }
        });
        // If the table doesn't exist, return empty array
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          console.warn('Conversations table not found, returning empty array');
          return [];
        }
        throw error;
      }

      // Also get conversations where user has sent messages
      const { data: messageConversations, error: messageError } = await (supabase as any)
        .from('messages')
        .select(`
          conversation:conversations(*, property:properties(id, title, price, images, city, state, bedrooms, bathrooms, property_type, street), messages(*))
        `)
        .eq('sender_id', userId);

      if (messageError) {
        console.error("Error fetching message conversations:", messageError);
      }

      // Combine and deduplicate conversations
      const allConversations = [...(data || [])];

      // Add message conversations that aren't already in the list
      if (messageConversations) {
        messageConversations.forEach(msg => {
          if (msg.conversation && !allConversations.find(c => c.id === msg.conversation.id)) {
            allConversations.push(msg.conversation);
          }
        });
      }

      // Sort by last_message_at
      allConversations.sort((a, b) =>
        new Date(b.last_message_at || b.created_at).getTime() -
        new Date(a.last_message_at || a.created_at).getTime()
      );

      console.log("Fetched all conversations for user", userId, ":", allConversations);
      return allConversations as ConversationWithMessages[];
    } catch (error) {
      // If there's any other error (like table doesn't exist), return empty array
      console.warn('Error fetching conversations, returning empty array:', error);
      return [];
    }
  },

  // Send a message
  async sendMessage(request: SendMessageRequest): Promise<Message> {
    const { data: user } = await supabase.auth.getUser();
    console.log("Sending message with request:", request);
    console.log("Current user:", user);

    // Determine sender type based on user role
    let senderType = 'user';
    if (user?.user?.id) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.user.id)
        .single();

      console.log("User profile:", profile, "Error:", profileError);
      if (profile?.user_type === 'admin') {
        senderType = 'admin';
      }
    }

    console.log("Determined sender type:", senderType);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: request.conversation_id,
        sender_id: user.user?.id,
        sender_type: senderType,
        message_text: request.message_text,
        message_type: request.message_type || 'text',
        file_url: request.file_url
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", {
        message: error.message,
        ...(error as any).code && { code: (error as any).code },
        ...(error as any).details && { details: (error as any).details },
        ...(error as any).hint && { hint: (error as any).hint }
      });
      throw error;
    }

    console.log("Message sent successfully:", data);

    // Update conversation last_message_at
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', request.conversation_id);

    if (updateError) {
      console.error("Error updating conversation last_message_at:", updateError);
    }

    return data;
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .is('read_at', null);

    if (error) throw error;
  },

  // Delete a conversation and all its messages
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      // First delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (messagesError) {
        console.error("Error deleting messages:", messagesError);
        throw messagesError;
      }

      // Then delete the conversation itself
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (conversationError) {
        console.error("Error deleting conversation:", conversationError);
        throw conversationError;
      }

      console.log("Successfully deleted conversation:", conversationId);
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error;
    }
  }
};

// =====================
// PROPERTY VIEWINGS
// =====================

export const viewingsApi = {
  // Schedule a viewing
  async scheduleViewing(request: CreateViewingRequest): Promise<PropertyViewing> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('property_viewings')
      .insert({
        property_id: request.property_id,
        user_id: user.user?.id,
        viewing_date: request.viewing_date,
        viewing_type: request.viewing_type,
        notes: request.notes,
        attendees_count: request.attendees_count || 1
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's viewings
  async getUserViewings(userId: string): Promise<ViewingWithDetails[]> {
    const { data, error } = await supabase
      .from('property_viewings')
      .select(`
        *,
        property:properties(id, title, street, city, state, price, images),
        user:profiles(id, full_name, phone, email)
      `)
      .eq('user_id', userId)
      .order('viewing_date', { ascending: true });

    if (error) throw error;
    return data as ViewingWithDetails[];
  },

  // Update viewing status
  async updateViewingStatus(viewingId: string, status: PropertyViewing['status']): Promise<void> {
    const { error } = await supabase
      .from('property_viewings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', viewingId);

    if (error) throw error;
  },

  // Add viewing feedback
  async addViewingFeedback(viewingId: string, rating: number, feedback: string): Promise<void> {
    const { error } = await supabase
      .from('property_viewings')
      .update({
        rating,
        feedback,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', viewingId);

    if (error) throw error;
  },

  // Update viewing (general update method)
  async updateViewing(viewingId: string, updates: Partial<PropertyViewing>): Promise<void> {
    const { error } = await supabase
      .from('property_viewings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', viewingId);

    if (error) throw error;
  }
};

// =====================
// LEAD MANAGEMENT
// =====================

export const leadsApi = {
  // Create a lead
  async createLead(request: CreateLeadRequest): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: request.name,
        email: request.email,
        phone: request.phone,
        source: request.source || 'website',
        budget_min: request.budget_min,
        budget_max: request.budget_max,
        preferred_property_type: request.preferred_property_type,
        preferred_locations: request.preferred_locations,
        bedrooms_min: request.bedrooms_min,
        bathrooms_min: request.bathrooms_min,
        notes: request.notes,
        tags: request.tags
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get leads for a user
  async getUserLeads(userId: string): Promise<LeadWithActivities[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        activities:lead_activities(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LeadWithActivities[];
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(status.startsWith('closed') && { conversion_date: new Date().toISOString() })
      })
      .eq('id', leadId);

    if (error) throw error;
  },

  // Add lead activity
  async addLeadActivity(leadId: string, activity: Omit<LeadActivity, 'id' | 'lead_id' | 'created_at'>): Promise<LeadActivity> {
    const { data, error } = await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        ...activity
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =====================
// PROPERTY INQUIRIES
// =====================

export const inquiriesApi = {
  // Create an inquiry
  async createInquiry(request: CreateInquiryRequest): Promise<PropertyInquiry> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('property_inquiries')
      .insert({
        property_id: request.property_id,
        user_id: user.user?.id,
        name: request.name,
        email: request.email,
        phone: request.phone,
        inquiry_type: request.inquiry_type,
        message: request.message,
        urgency: request.urgency || 'medium'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get inquiries for a property
  async getPropertyInquiries(propertyId: string): Promise<PropertyInquiry[]> {
    const { data, error } = await supabase
      .from('property_inquiries')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Respond to inquiry
  async respondToInquiry(inquiryId: string, responseText: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('property_inquiries')
      .update({
        status: 'responded',
        response_text: responseText,
        responded_at: new Date().toISOString(),
        responded_by: user.user?.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', inquiryId);

    if (error) throw error;
  }
};

// =====================
// NOTIFICATIONS
// =====================

export const notificationsApi = {
  // Get user notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    console.log('notificationsApi.getUserNotifications called with userId:', userId);

    // Validate userId
    if (!userId) {
      console.warn('No userId provided to getUserNotifications');
      return [];
    }

    try {
      console.log('Attempting to fetch notifications from Supabase...');
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('Supabase response:', { data, error, count });

      if (error) {
        console.error("Error fetching notifications from Supabase:", error);
        // If it's a table not found error, return empty array instead of throwing
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          console.warn('Notifications table not found, returning empty array');
          return [];
        }
        // For other errors, still return empty array to prevent app crashes
        return [];
      }

      console.log(`Successfully fetched ${data?.length || 0} notifications`);
      return data || [];
    } catch (error) {
      console.error("Exception in getUserNotifications:", error);
      // Return empty array on any error to prevent app crashes
      return [];
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    console.log('notificationsApi.markAsRead called with notificationId:', notificationId);

    if (!notificationId) {
      console.warn('No notificationId provided to markAsRead');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      console.log('Successfully marked notification as read');
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  // Mark notification as unread
  async markAsUnread(notificationId: string): Promise<void> {
    console.log('notificationsApi.markAsUnread called with notificationId:', notificationId);

    if (!notificationId) {
      console.warn('No notificationId provided to markAsUnread');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: false,
          read_at: null
        })
        .eq('id', notificationId);

      if (error) {
        console.error("Error marking notification as unread:", error);
        return;
      }

      console.log('Successfully marked notification as unread');
    } catch (error) {
      console.error("Error marking notification as unread:", error);
    }
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    console.log('notificationsApi.deleteNotification called with notificationId:', notificationId);

    if (!notificationId) {
      console.warn('No notificationId provided to deleteNotification');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error("Error deleting notification:", error);
        return;
      }

      console.log('Successfully deleted notification');
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    console.log('notificationsApi.markAllAsRead called with userId:', userId);

    if (!userId) {
      console.warn('No userId provided to markAllAsRead');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error("Error marking all notifications as read:", error);
        return;
      }

      console.log('Successfully marked all notifications as read');
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },

  // Create notification (internal use)
  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read' | 'read_at' | 'email_sent' | 'sms_sent'>): Promise<Notification> {
    console.log('notificationsApi.createNotification called with:', notification);

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) {
        console.error("Error creating notification:", error);
        // If it's a table not found error, create a mock notification
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          console.warn('Notifications table not found, creating mock notification');
          return {
            id: 'mock-' + Date.now(),
            recipient_id: notification.recipient_id,
            recipient_type: notification.recipient_type,
            type: notification.type as any,
            title: notification.title,
            message: notification.message,
            property_id: notification.property_id,
            viewing_id: notification.viewing_id,
            inquiry_id: notification.inquiry_id,
            is_read: false,
            read_at: null,
            delivery_method: [],
            email_sent: false,
            sms_sent: false,
            created_at: new Date().toISOString()
          } as Notification;
        }
        // For other errors, create a mock notification
        return {
          id: 'mock-' + Date.now(),
          recipient_id: notification.recipient_id,
          recipient_type: notification.recipient_type,
          type: notification.type as any,
          title: notification.title,
          message: notification.message,
          property_id: notification.property_id,
          viewing_id: notification.viewing_id,
          inquiry_id: notification.inquiry_id,
          is_read: false,
          read_at: null,
          delivery_method: [],
          email_sent: false,
          sms_sent: false,
          created_at: new Date().toISOString()
        } as Notification;
      }

      console.log('Successfully created notification:', data);
      return data;
    } catch (error) {
      console.error("Exception in createNotification:", error);
      // Create a mock notification on error
      return {
        id: 'mock-' + Date.now(),
        recipient_id: notification.recipient_id,
        recipient_type: notification.recipient_type,
        type: notification.type as any,
        title: notification.title,
        message: notification.message,
        property_id: notification.property_id,
        viewing_id: notification.viewing_id,
        inquiry_id: notification.inquiry_id,
        is_read: false,
        read_at: null,
        delivery_method: [],
        email_sent: false,
        sms_sent: false,
        created_at: new Date().toISOString()
      } as Notification;
    }
  }
};

// =====================
// SAVED SEARCHES
// =====================

export const savedSearchesApi = {
  // Save a search
  async saveSearch(search: Omit<SavedSearch, 'id' | 'created_at' | 'updated_at' | 'results_count' | 'last_run'>): Promise<SavedSearch> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        ...search,
        user_id: user.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's saved searches
  async getUserSavedSearches(userId: string): Promise<SavedSearch[]> {
    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a saved search
  async createSavedSearch(search: Omit<SavedSearch, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'results_count' | 'last_run'>): Promise<SavedSearch> {
    return await this.saveSearch(search as any);
  },

  // Delete saved search
  async deleteSavedSearch(searchId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId);

    if (error) throw error;
  },

  // Update saved search
  async updateSavedSearch(searchId: string, updates: Partial<Omit<SavedSearch, 'id' | 'user_id' | 'created_at'>>): Promise<void> {
    const { error } = await supabase
      .from('saved_searches')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', searchId);

    if (error) throw error;
  },

  // Update search results count
  async updateResultsCount(searchId: string, count: number): Promise<void> {
    const { error } = await supabase
      .from('saved_searches')
      .update({
        results_count: count,
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', searchId);

    if (error) throw error;
  }
};

// =====================
// SEARCH HISTORY
// =====================

export const searchHistoryApi = {
  // Save a search to history
  async saveSearchToHistory(searchQuery: string, filters?: any, resultsCount?: number): Promise<void> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user?.id) return;

    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: user.user.id,
        search_query: searchQuery,
        search_filters: filters || null,
        results_count: resultsCount || 0,
        searched_at: new Date().toISOString()
      });

    if (error) console.error('Error saving search to history:', error);
  },

  // Get user's search history
  async getUserSearchHistory(userId: string, limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Clear user's search history
  async clearSearchHistory(userId: string): Promise<void> {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
};

// =====================
// PAYMENT TRANSACTIONS
// =====================

export const paymentsApi = {
  // Create payment transaction
  async createTransaction(transaction: Omit<PaymentTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentTransaction> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's transactions
  async getUserTransactions(userId: string): Promise<PaymentTransaction[]> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update transaction status
  async updateTransactionStatus(transactionId: string, status: PaymentTransaction['status'], gatewayReference?: string): Promise<void> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (gatewayReference) {
      updateData.gateway_reference = gatewayReference;
    }

    if (status === 'completed') {
      updateData.payment_date = new Date().toISOString();
    }

    const { error } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('id', transactionId);

    if (error) throw error;
  }
};

// =====================
// ANALYTICS HELPERS
// =====================

export const analyticsApi = {
  // Track property view
  async trackPropertyView(propertyId: string, userId?: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Use upsert to increment view count
    const { error } = await (supabase as any).rpc('increment_property_analytics', {
      p_property_id: propertyId,
      p_date: today,
      p_metric: 'views_count'
    });

    if (error) console.error('Error tracking property view:', error);

    // Also track in property_views table if user is logged in
    if (userId) {
      await supabase
        .from('property_views')
        .insert({
          property_id: propertyId,
          user_id: userId,
          view_date: new Date().toISOString()
        });
    }
  },

  // Get property analytics
  async getPropertyAnalytics(propertyId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const { data, error } = await (supabase as any)
      .from('property_analytics')
      .select('*')
      .eq('property_id', propertyId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }
};

// =====================
// ADMIN SECURITY API
// =====================

export const adminSecurityApi = {
  // Get pending KYC verifications
  async getPendingKYCVerifications(): Promise<any[]> {
    try {
      // Fetch pending KYC documents with user information
      const { data, error } = await supabase
        .from('kyc_documents')
        .select(`
          id,
          user_id,
          document_type,
          verification_status,
          created_at,
          profiles:profiles!inner(
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group documents by user and format for display
      const groupedAgents: any[] = [];
      const userMap: Record<string, any> = {};

      data?.forEach((doc: any) => {
        const userId = doc.user_id;
        if (!userMap[userId]) {
          userMap[userId] = {
            kyc_id: doc.id,
            agent_id: userId,
            agent_name: doc.profiles?.full_name || 'Unknown User',
            agent_email: doc.profiles?.email || 'No email',
            agent_phone: doc.profiles?.phone || undefined,
            agent_avatar: doc.profiles?.avatar_url || undefined,
            submitted_at: doc.created_at,
            verification_status: doc.verification_status,
            documents_count: 1,
            document_types: [doc.document_type],
            risk_flags: []
          };
          groupedAgents.push(userMap[userId]);
        } else {
          userMap[userId].documents_count += 1;
          userMap[userId].document_types.push(doc.document_type);
        }
      });

      return groupedAgents;
    } catch (error) {
      console.error('Error fetching pending KYC verifications:', error);
      return [];
    }
  },

  // Verify agent KYC
  async verifyAgentKYC(kycId: string, decision: 'approve' | 'reject', rejectionReason?: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();

      if (decision === 'approve') {
        // Update the document status to verified
        const { error } = await supabase
          .from('kyc_documents')
          .update({
            verification_status: 'verified',
            verified_by: user.user?.id,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', kycId);

        if (error) throw error;

        // Also update the user's profile to mark them as verified agent
        const { data: kycDoc, error: kycError } = await supabase
          .from('kyc_documents')
          .select('user_id')
          .eq('id', kycId)
          .single();

        if (kycError) throw kycError;

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            user_type: 'agent',
            updated_at: new Date().toISOString()
          })
          .eq('id', kycDoc.user_id);

        if (profileError) throw profileError;
      } else {
        // Update the document status to rejected
        const { error } = await supabase
          .from('kyc_documents')
          .update({
            verification_status: 'rejected',
            verified_by: user.user?.id,
            verified_at: new Date().toISOString(),
            rejection_reason: rejectionReason,
            updated_at: new Date().toISOString()
          })
          .eq('id', kycId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error verifying agent KYC:', error);
      throw error;
    }
  }
};

// =====================
// SECURITY & COMPLIANCE
// =====================

export const securityApi = {
  async getSecuritySettings(): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('global_settings')
      .select('*')
      .like('setting_key', '%security%')
      .order('setting_key');

    if (error) throw error;
    return data || [];
  },

  async updateSecuritySetting(settingId: string, value: any): Promise<void> {
    const { error } = await supabase
      .from('global_settings')
      .update({
        setting_value: value,
        updated_at: new Date().toISOString()
      })
      .eq('id', settingId);

    if (error) throw error;
  },

  async getSecurityMetrics(startDate: Date, endDate: Date): Promise<any> {
    // Get user counts
    const { data: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const { data: activeUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get notifications/alerts count as proxy for security events
    const { data: securityAlerts } = await (supabase as any)
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('category', 'system')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    return {
      totalUsers: totalUsers?.length || 0,
      activeUsers: activeUsers?.length || 0,
      failedLogins: 0, // Would need auth.users audit
      securityAlerts: securityAlerts?.length || 0,
      complianceScore: 85, // Calculate based on checks
      dataBreaches: 0,
    };
  }
};

export const auditApi = {
  async getAuditLogs(startDate: Date, endDate: Date): Promise<any[]> {
    // Get various activity logs
    const { data: notifications } = await (supabase as any)
      .from('notifications')
      .select('*')
      .eq('category', 'system')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    return notifications || [];
  },

  async exportAuditLogs(filter?: string, searchTerm?: string): Promise<{ download_url: string }> {
    // In a real implementation, this would generate a CSV/PDF file
    // For now, return a placeholder
    return { download_url: '#audit-export' };
  }
};

export const complianceApi = {
  async getComplianceChecks(): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('global_settings')
      .select('*')
      .like('setting_key', '%compliance%')
      .order('setting_key');

    if (error) throw error;
    return data || [];
  },

  async runComplianceCheck(framework: string): Promise<void> {
    // Log compliance check initiation
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        title: 'Compliance Check Initiated',
        message: `Compliance check for ${framework} framework has been started.`,
        type: 'info',
        category: 'system'
      });

    if (error) throw error;
  }
};

// =====================
// SCHEDULING API
// =====================

export const schedulingApi = {
  async getAvailableSlots(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('appointments')
      .select('start_time, end_time')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .eq('status', 'scheduled');

    if (error) throw error;
    return data || [];
  }
};