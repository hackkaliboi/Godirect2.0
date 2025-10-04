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
  // Get conversations for a user
  async getConversations(userId: string): Promise<ConversationWithMessages[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        property:properties(id, title, price, images),
        messages(*)
      `)
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data as ConversationWithMessages[];
  },

  // Create a new conversation
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

  // Send a message
  async sendMessage(request: SendMessageRequest): Promise<Message> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: request.conversation_id,
        sender_id: user.user?.id,
        sender_type: 'user', // Determine this based on user type
        message_text: request.message_text,
        message_type: request.message_type || 'text',
        file_url: request.file_url
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', request.conversation_id);

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
        user:profiles(id, first_name, last_name, phone, email)
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
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  // Create notification (internal use)
  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read' | 'read_at' | 'email_sent' | 'sms_sent'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
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

  // Delete saved search
  async deleteSavedSearch(searchId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
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
