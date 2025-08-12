-- Critical Features Database Extension
-- This migration adds tables for the missing critical features

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================
-- MESSAGING & COMMUNICATION
-- =======================

-- Conversations table for chat between users and agents
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    title TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for individual messages in conversations
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'agent', 'admin')),
    message_text TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'property_link')),
    file_url TEXT,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- PROPERTY VIEWING & APPOINTMENTS
-- =======================

-- Property viewings/appointments table
CREATE TABLE IF NOT EXISTS public.property_viewings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    viewing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    viewing_type TEXT DEFAULT 'in_person' CHECK (viewing_type IN ('in_person', 'virtual', 'group')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    duration_minutes INTEGER DEFAULT 60,
    notes TEXT,
    attendees_count INTEGER DEFAULT 1,
    meeting_link TEXT, -- For virtual viewings
    reminder_sent BOOLEAN DEFAULT FALSE,
    user_notes TEXT, -- Notes from the user
    agent_notes TEXT, -- Notes from the agent
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Post-viewing rating
    feedback TEXT, -- Post-viewing feedback
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- LEAD MANAGEMENT & CRM
-- =======================

-- Leads table for comprehensive lead tracking
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    source TEXT CHECK (source IN ('website', 'referral', 'social_media', 'advertisement', 'walk_in', 'phone_call')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'interested', 'viewing_scheduled', 'offer_made', 'closed_won', 'closed_lost')),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    
    -- Lead preferences
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    preferred_property_type TEXT,
    preferred_locations TEXT[], -- Array of preferred cities/areas
    bedrooms_min INTEGER,
    bathrooms_min DECIMAL(3,1),
    
    -- Assignment and tracking
    assigned_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_followup_date TIMESTAMP WITH TIME ZONE,
    conversion_date TIMESTAMP WITH TIME ZONE, -- When lead became client
    
    -- Additional info
    notes TEXT,
    tags TEXT[], -- Array of tags for categorization
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead activities for tracking all interactions
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'sms', 'meeting', 'property_shown', 'note_added', 'status_changed')),
    title TEXT NOT NULL,
    description TEXT,
    outcome TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- PROPERTY COMPARISON & WISHLIST
-- =======================

-- Property comparisons for users
CREATE TABLE IF NOT EXISTS public.property_comparisons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- User-defined name for the comparison
    property_ids UUID[] NOT NULL, -- Array of property IDs to compare
    notes TEXT,
    is_shared BOOLEAN DEFAULT FALSE,
    share_token TEXT UNIQUE, -- For sharing comparisons
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced favorites with categories
CREATE TABLE IF NOT EXISTS public.property_wishlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'My Favorites',
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist items
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wishlist_id UUID REFERENCES property_wishlists(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    notes TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(wishlist_id, property_id)
);

-- =======================
-- PROPERTY ANALYTICS & TRACKING
-- =======================

-- Property inquiries for lead generation
CREATE TABLE IF NOT EXISTS public.property_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be null for anonymous inquiries
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    
    -- Contact info (for anonymous users)
    name TEXT,
    email TEXT,
    phone TEXT,
    
    -- Inquiry details
    inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'price_info', 'viewing_request', 'financing_info')),
    message TEXT NOT NULL,
    urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
    
    -- Response tracking
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'in_progress', 'responded', 'closed')),
    response_text TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES agents(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property analytics for performance tracking
CREATE TABLE IF NOT EXISTS public.property_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Engagement metrics
    views_count INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    viewing_requests INTEGER DEFAULT 0,
    
    -- Conversion metrics
    leads_generated INTEGER DEFAULT 0,
    viewings_scheduled INTEGER DEFAULT 0,
    viewings_completed INTEGER DEFAULT 0,
    offers_received INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, date)
);

-- =======================
-- NOTIFICATIONS SYSTEM
-- =======================

-- Notifications table for system-wide notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'agent', 'admin')),
    
    -- Notification content
    type TEXT NOT NULL CHECK (type IN ('property_alert', 'viewing_reminder', 'message_received', 'inquiry_received', 'viewing_scheduled', 'viewing_cancelled', 'property_updated', 'payment_reminder')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    viewing_id UUID REFERENCES property_viewings(id) ON DELETE SET NULL,
    inquiry_id UUID REFERENCES property_inquiries(id) ON DELETE SET NULL,
    
    -- Delivery tracking
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    delivery_method TEXT[] DEFAULT ARRAY['in_app'], -- Array: in_app, email, sms
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- SAVED SEARCHES & ALERTS
-- =======================

-- Saved property searches with alerts
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    
    -- Search criteria (stored as JSON for flexibility)
    search_criteria JSONB NOT NULL,
    
    -- Alert settings
    alerts_enabled BOOLEAN DEFAULT TRUE,
    alert_frequency TEXT DEFAULT 'daily' CHECK (alert_frequency IN ('immediate', 'daily', 'weekly')),
    last_alert_sent TIMESTAMP WITH TIME ZONE,
    
    -- Tracking
    results_count INTEGER DEFAULT 0,
    last_run TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- PAYMENT & TRANSACTIONS
-- =======================

-- Enhanced payment tracking with Nigerian payment methods
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    
    -- Transaction details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('property_purchase', 'agent_commission', 'service_fee', 'inspection_fee', 'legal_fee')),
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    
    -- Payment method and gateway
    payment_method TEXT NOT NULL CHECK (payment_method IN ('paystack', 'flutterwave', 'bank_transfer', 'cash', 'interswitch')),
    payment_reference TEXT UNIQUE,
    gateway_reference TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Additional details
    description TEXT,
    fees DECIMAL(12,2) DEFAULT 0,
    metadata JSONB, -- Store gateway-specific data
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================
-- INDEXES FOR PERFORMANCE
-- =======================

-- Conversations and Messages
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_property_id ON conversations(property_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Property Viewings
CREATE INDEX IF NOT EXISTS idx_property_viewings_property_id ON property_viewings(property_id);
CREATE INDEX IF NOT EXISTS idx_property_viewings_user_id ON property_viewings(user_id);
CREATE INDEX IF NOT EXISTS idx_property_viewings_agent_id ON property_viewings(agent_id);
CREATE INDEX IF NOT EXISTS idx_property_viewings_date ON property_viewings(viewing_date);
CREATE INDEX IF NOT EXISTS idx_property_viewings_status ON property_viewings(status);

-- Leads and Activities
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);

-- Property Analytics
CREATE INDEX IF NOT EXISTS idx_property_analytics_property_date ON property_analytics(property_id, date);
CREATE INDEX IF NOT EXISTS idx_property_analytics_date ON property_analytics(date);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(payment_reference);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- =======================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================

-- Enable RLS on all new tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (add more as needed)
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Agents can view their assigned conversations" ON conversations FOR SELECT USING (
  EXISTS(SELECT 1 FROM agents WHERE id = agent_id AND auth.uid()::text = id::text)
);

CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (
  EXISTS(SELECT 1 FROM conversations WHERE id = conversation_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their own viewings" ON property_viewings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Agents can view their viewings" ON property_viewings FOR SELECT USING (
  EXISTS(SELECT 1 FROM agents WHERE id = agent_id AND auth.uid()::text = id::text)
);

-- Add more RLS policies as needed for other tables...

COMMENT ON TABLE conversations IS 'Conversations between users and agents about properties';
COMMENT ON TABLE messages IS 'Individual messages within conversations';
COMMENT ON TABLE property_viewings IS 'Scheduled property viewings and appointments';
COMMENT ON TABLE leads IS 'Lead management and tracking system';
COMMENT ON TABLE lead_activities IS 'Activity log for leads';
COMMENT ON TABLE property_comparisons IS 'User property comparison lists';
COMMENT ON TABLE property_inquiries IS 'Property inquiry tracking';
COMMENT ON TABLE notifications IS 'System-wide notification management';
COMMENT ON TABLE saved_searches IS 'User saved property searches with alerts';
COMMENT ON TABLE payment_transactions IS 'Payment and transaction tracking';
