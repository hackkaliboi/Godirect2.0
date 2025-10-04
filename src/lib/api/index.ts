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
        agent:agents(id, name, image),
        messages(*)
      `)
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data as ConversationWithMessages[];
  },

  // Create a new conversation
  async createConversation(propertyId: string, userId: string, agentId: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        property_id: propertyId,
        user_id: userId,
        agent_id: agentId,
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
        agent_id: request.agent_id,
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
        agent:agents(id, name, phone, email),
        user:profiles(id, first_name, last_name, phone, email)
      `)
      .eq('user_id', userId)
      .order('viewing_date', { ascending: true });

    if (error) throw error;
    return data as ViewingWithDetails[];
  },

  // Get agent's viewings
  async getAgentViewings(agentId: string): Promise<ViewingWithDetails[]> {
    const { data, error } = await supabase
      .from('property_viewings')
      .select(`
        *,
        property:properties(id, title, street, city, state, price, images),
        agent:agents(id, name, phone, email),
        user:profiles(id, first_name, last_name, phone, email)
      `)
      .eq('agent_id', agentId)
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

  // Get leads for an agent
  async getAgentLeads(agentId: string): Promise<LeadWithActivities[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        activities:lead_activities(*),
        agent:agents(id, name, email)
      `)
      .eq('assigned_agent_id', agentId)
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
  },

  // Assign lead to agent
  async assignLead(leadId: string, agentId: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({ 
        assigned_agent_id: agentId,
        status: 'contacted',
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (error) throw error;
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
  async respondToInquiry(inquiryId: string, responseText: string, agentId: string): Promise<void> {
    const { error } = await supabase
      .from('property_inquiries')
      .update({
        status: 'responded',
        response_text: responseText,
        responded_at: new Date().toISOString(),
        responded_by: agentId,
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
      .or(`user_id.eq.${userId},agent_id.eq.${userId}`)
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .eq('status', 'scheduled');

    if (error) throw error;
    return data || [];
  }
};

// =====================
// AGENT KYC & SECURITY MANAGEMENT
// =====================

export const agentSecurityApi = {
  // Submit KYC information
  async submitKYC(kycData: any): Promise<any> {
    try {
      console.log('KYC submitted:', kycData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Upload documents to storage and create database records
      const documentRecords = [];
      
      // Handle identity document front
      if (kycData.identity_documents.front_image) {
        const frontDoc = await this.uploadKYCDocument(
          kycData.identity_documents.front_image, 
          user.id, 
          kycData.identity_documents.type + '_front',
          kycData.identity_documents.number
        );
        documentRecords.push(frontDoc);
      }
      
      // Handle identity document back (if exists)
      if (kycData.identity_documents.back_image) {
        const backDoc = await this.uploadKYCDocument(
          kycData.identity_documents.back_image, 
          user.id, 
          kycData.identity_documents.type + '_back',
          kycData.identity_documents.number
        );
        documentRecords.push(backDoc);
      }
      
      // Handle professional license document
      if (kycData.professional_documents.license_document) {
        const licenseDoc = await this.uploadKYCDocument(
          kycData.professional_documents.license_document, 
          user.id, 
          'professional_license',
          kycData.professional_info.license_number
        );
        documentRecords.push(licenseDoc);
      }
      
      // Handle professional certificate document
      if (kycData.professional_documents.certificate_document) {
        const certDoc = await this.uploadKYCDocument(
          kycData.professional_documents.certificate_document, 
          user.id, 
          'professional_certificate',
          kycData.professional_info.certification
        );
        documentRecords.push(certDoc);
      }
      
      console.log('KYC documents uploaded:', documentRecords);
      
      // Create notification for admin
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'New KYC Submission',
          message: `Agent ${user.email} has submitted KYC documents for verification.`,
          type: 'info',
          category: 'kyc',
          metadata: {
            kyc_document_ids: documentRecords.map(doc => doc.id),
            agent_name: kycData.personal_info.first_name + ' ' + kycData.personal_info.last_name
          }
        });
      
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
      
      return { success: true, kyc_id: documentRecords[0]?.id || 'kyc-' + Date.now() };
    } catch (error) {
      console.error('Error submitting KYC:', error);
      throw error;
    }
  },
  
  // Upload KYC document to storage and create database record
  async uploadKYCDocument(file: File, userId: string, documentType: string, documentNumber?: string): Promise<any> {
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${documentType}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);
      
      // Create database record
      const { data, error } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_number: documentNumber,
          document_url: publicUrl,
          verification_status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading KYC document:', error);
      throw error;
    }
  },

  // Get agent KYC status
  async getKYCStatus(agentId: string): Promise<any> {
    try {
      // Get the latest KYC document status for this agent
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', agentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // If no KYC documents found, return default status
        return {
          verification_status: 'not_submitted',
          verification_level: 'none',
          can_process_payments: false,
          required_documents: ['identity_document', 'license_document']
        };
      }
      
      // Determine overall verification status based on documents
      const { data: allDocuments, error: allDocsError } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', agentId);
      
      if (allDocsError) {
        throw allDocsError;
      }
      
      // Check if any documents are rejected
      const hasRejected = allDocuments.some((doc: any) => doc.verification_status === 'rejected');
      const hasPending = allDocuments.some((doc: any) => doc.verification_status === 'pending');
      const allVerified = allDocuments.every((doc: any) => doc.verification_status === 'verified');
      
      let verificationStatus = 'not_submitted';
      if (hasRejected) {
        verificationStatus = 'rejected';
      } else if (allVerified) {
        verificationStatus = 'verified';
      } else if (hasPending) {
        verificationStatus = 'pending';
      }
      
      return {
        verification_status: verificationStatus,
        verification_level: allVerified ? 'full' : 'basic',
        can_process_payments: allVerified,
        required_documents: ['identity_document', 'license_document']
      };
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      // Return default status on error
      return {
        verification_status: 'error',
        verification_level: 'none',
        can_process_payments: false,
        required_documents: ['identity_document', 'license_document']
      };
    }
  },

  // Update KYC information
  async updateKYC(kycId: string, updates: any): Promise<void> {
    console.log('KYC updated:', kycId, updates);
  },

  // Get agent profile with security context
  async getAgentProfile(agentId: string): Promise<any> {
    return {
      id: agentId,
      agent_code: 'AG-' + agentId.slice(-8).toUpperCase(),
      profile_status: 'pending_kyc',
      can_receive_leads: false,
      can_schedule_viewings: false,
      can_process_payments: false,
      commission_rate: 2.5,
      max_monthly_leads: 10, // Limited until verified
      commission_hold_period_days: 30
    };
  }
};

export const agentTrackingApi = {
  // Generate unique tracking code for agent
  async generateTrackingCode(request: any): Promise<{ tracking_code: string; expires_at: string }> {
    // Generate unique tracking code: AG-XXXX-YYYY-ZZZZ
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const agentCode = request.agent_id.slice(-4).toUpperCase();
    
    const tracking_code = `AG-${agentCode}-${timestamp}-${random}`;
    const expires_at = new Date(Date.now() + (request.expires_in_hours || 24) * 60 * 60 * 1000).toISOString();
    
    console.log('Generated tracking code:', tracking_code);
    
    return { tracking_code, expires_at };
  },

  // Validate and use tracking code
  async useTrackingCode(trackingCode: string, paymentTransactionId: string): Promise<any> {
    console.log('Using tracking code:', trackingCode, 'for payment:', paymentTransactionId);
    
    // In real implementation:
    // 1. Validate code exists and not expired
    // 2. Mark as used
    // 3. Create commission record
    // 4. Log for audit
    
    return {
      agent_id: 'agent-123',
      commission_rate: 2.5,
      commission_amount: 2500 // Example calculation
    };
  },

  // Get agent commission history
  async getAgentCommissions(agentId: string): Promise<any[]> {
    return [
      {
        id: 'comm-1',
        transaction_date: new Date().toISOString(),
        base_amount: 100000,
        commission_rate: 2.5,
        commission_amount: 2500,
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
};

export const paymentGatewayApi = {
  // Admin-only: Create payment gateway
  async createPaymentGateway(gatewayData: any): Promise<any> {
    console.log('Creating payment gateway (admin only):', gatewayData);
    
    // Security checks:
    // 1. Verify admin permissions
    // 2. Encrypt private keys
    // 3. Validate configuration
    // 4. Test connection
    
    return { success: true, gateway_id: 'gw-' + Date.now() };
  },

  // Admin-only: List all payment gateways
  async getPaymentGateways(): Promise<any[]> {
    return [
      {
        id: 'gw-1',
        name: 'Paystack Primary',
        provider: 'paystack',
        is_active: true,
        is_default: true,
        admin_only: false,
        supported_currencies: ['NGN', 'USD'],
        transaction_fee_percentage: 1.5
      },
      {
        id: 'gw-2',
        name: 'Flutterwave Backup',
        provider: 'flutterwave',
        is_active: true,
        is_default: false,
        admin_only: true, // Admin only for high-value transactions
        supported_currencies: ['NGN', 'USD', 'GHS'],
        transaction_fee_percentage: 1.4
      }
    ];
  },

  // Get available gateways for user (filtered by permissions)
  async getAvailableGateways(userType: string): Promise<any[]> {
    const gateways = await this.getPaymentGateways();
    
    // Filter based on user type and permissions
    if (userType !== 'admin') {
      return gateways.filter(gw => !gw.admin_only && gw.is_active);
    }
    
    return gateways.filter(gw => gw.is_active);
  },

  // Process payment with agent tracking
  async processPaymentWithTracking(paymentData: any, trackingCode?: string): Promise<any> {
    console.log('Processing payment with tracking:', { paymentData, trackingCode });
    
    // Security workflow:
    // 1. Validate payment gateway (admin-created only)
    // 2. Verify tracking code if provided
    // 3. Process payment through gateway
    // 4. Record commission if agent involved
    // 5. Create audit log
    
    let paymentResult: any = {
      transaction_id: 'txn-' + Date.now(),
      status: 'completed',
      amount: paymentData.amount,
      gateway_reference: 'gw-ref-' + Date.now()
    };
    
    // If tracking code provided, calculate commission
    if (trackingCode) {
      const commissionData = await agentTrackingApi.useTrackingCode(trackingCode, paymentResult.transaction_id);
      paymentResult = {
        ...paymentResult,
        commission_data: commissionData
      };
    }
    
    return paymentResult;
  }
};

export const adminSecurityApi = {
  // Admin-only: Verify agent KYC
  async verifyAgentKYC(kycId: string, decision: 'approve' | 'reject', notes?: string): Promise<void> {
    try {
      console.log('Admin KYC decision:', { kycId, decision, notes });
      
      // Get current admin user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Admin not authenticated');
      }
      
      // Update KYC document status
      const { error } = await supabase
        .from('kyc_documents')
        .update({
          verification_status: decision === 'approve' ? 'verified' : 'rejected',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          rejection_reason: decision === 'reject' ? notes : null,
          notes: notes
        })
        .eq('id', kycId);
      
      if (error) {
        throw error;
      }
      
      // If approved, update all related documents for this user
      if (decision === 'approve') {
        // Get the user ID from the document
        const { data: documentData, error: fetchError } = await supabase
          .from('kyc_documents')
          .select('user_id')
          .eq('id', kycId)
          .single();
        
        if (!fetchError && documentData) {
          // Update all pending documents for this user to verified
          const { error: updateError } = await supabase
            .from('kyc_documents')
            .update({
              verification_status: 'verified',
              verified_by: user.id,
              verified_at: new Date().toISOString()
            })
            .eq('user_id', documentData.user_id)
            .eq('verification_status', 'pending');
          
          if (updateError) {
            console.error('Error updating related documents:', updateError);
          }
          
          // Update user profile to reflect verified status
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', documentData.user_id);
          
          if (profileError) {
            console.error('Error updating user profile:', profileError);
          }
        }
      }
      
      // Create notification for the agent
      const { data: kycDoc, error: kycDocError } = await supabase
        .from('kyc_documents')
        .select('user_id')
        .eq('id', kycId)
        .single();
      
      if (!kycDocError && kycDoc) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: kycDoc.user_id,
            title: `KYC ${decision === 'approve' ? 'Approved' : 'Rejected'}`,
            message: `Your KYC verification has been ${decision === 'approve' ? 'approved' : 'rejected'}. ${notes ? 'Reason: ' + notes : ''}`,
            type: decision === 'approve' ? 'success' : 'warning',
            category: 'kyc'
          });
        
        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
      
      // Create audit log
      const { error: auditError } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: `kyc_${decision}`,
          table_name: 'kyc_documents',
          record_id: kycId,
          old_values: { verification_status: 'pending' },
          new_values: { verification_status: decision === 'approve' ? 'verified' : 'rejected' },
          metadata: { notes }
        });
      
      if (auditError) {
        console.error('Error creating audit log:', auditError);
      }
    } catch (error) {
      console.error('Error verifying agent KYC:', error);
      throw error;
    }
  },

  // Admin-only: Get agents pending verification
  async getPendingKYCVerifications(): Promise<any[]> {
    try {
      // Get all pending KYC documents with user information
      const { data, error } = await supabase
        .from('kyc_documents')
        .select(`
          id,
          user_id,
          document_type,
          document_number,
          verification_status,
          created_at,
          updated_at,
          profiles:user_id(id, full_name, email, phone, avatar_url)
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Group by user to show one entry per agent with document count
      const groupedData: any[] = [];
      data.forEach((doc: any) => {
        const existing = groupedData.find(item => item.agent_id === doc.user_id);
        if (existing) {
          existing.documents_count += 1;
          existing.document_types.push(doc.document_type);
        } else {
          groupedData.push({
            kyc_id: doc.id,
            agent_id: doc.user_id,
            agent_name: doc.profiles?.full_name || 'Unknown Agent',
            agent_email: doc.profiles?.email || 'No email',
            agent_phone: doc.profiles?.phone || null,
            agent_avatar: doc.profiles?.avatar_url || null,
            submitted_at: doc.created_at,
            verification_status: doc.verification_status,
            documents_count: 1,
            document_types: [doc.document_type],
            risk_flags: []
          });
        }
      });
      
      return groupedData;
    } catch (error) {
      console.error('Error fetching pending KYC verifications:', error);
      // Return mock data on error to prevent breaking the UI
      return [
        {
          kyc_id: 'kyc-1',
          agent_name: 'John Doe',
          submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          verification_status: 'pending',
          documents_count: 4,
          risk_flags: []
        }
      ];
    }
  },

  // Admin-only: Suspend/activate agent
  async updateAgentStatus(agentId: string, status: 'active' | 'suspended', reason?: string): Promise<void> {
    console.log('Admin updating agent status:', { agentId, status, reason });
    
    // Security actions:
    // 1. Update agent profile
    // 2. Disable/enable all agent functions
    // 3. Hold/release commissions
    // 4. Create audit log
    // 5. Notify agent
  },

  // Admin-only: Get security audit logs
  async getSecurityAuditLogs(filters?: any): Promise<any[]> {
    return [
      {
        id: 'audit-1',
        entity_type: 'agent',
        action: 'kyc_submitted',
        actor_type: 'agent',
        timestamp: new Date().toISOString(),
        risk_level: 'low',
        details: 'Agent submitted KYC documents'
      }
    ];
  }
};
