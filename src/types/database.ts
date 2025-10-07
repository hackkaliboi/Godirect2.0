// Extended types for the new database features

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string; // Add currency field
  property_type: string;
  status: 'available' | 'pending' | 'sold' | 'rented' | 'withdrawn';
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  year_built?: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  features: string[];
  amenities: string[];
  virtual_tour_url?: string;
  is_featured: boolean;
  views_count: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  property_id?: string;
  user_id: string;
  // Remove agent_id since users act as their own agents
  title?: string;
  status: 'active' | 'closed' | 'archived';
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message_text: string;
  message_type: 'text' | 'image' | 'document' | 'property_link';
  file_url?: string;
  read_at?: string;
  created_at: string;
}

export interface PropertyViewing {
  id: string;
  property_id: string;
  user_id: string;
  viewing_date: string;
  viewing_type: 'in_person' | 'virtual' | 'group';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  duration_minutes: number;
  notes?: string;
  attendees_count: number;
  meeting_link?: string;
  reminder_sent: boolean;
  user_notes?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source?: 'website' | 'referral' | 'social_media' | 'advertisement' | 'walk_in' | 'phone_call';
  status: 'new' | 'contacted' | 'qualified' | 'interested' | 'viewing_scheduled' | 'offer_made' | 'closed_won' | 'closed_lost';
  score: number;
  budget_min?: number;
  budget_max?: number;
  preferred_property_type?: string;
  preferred_locations?: string[];
  bedrooms_min?: number;
  bathrooms_min?: number;
  // Remove assigned_agent_id since users act as their own agents
  last_contact_date?: string;
  next_followup_date?: string;
  conversion_date?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  // Remove agent_id since users act as their own agents
  activity_type: 'call' | 'email' | 'sms' | 'meeting' | 'property_shown' | 'note_added' | 'status_changed';
  title: string;
  description?: string;
  outcome?: string;
  scheduled_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface PropertyComparison {
  id: string;
  user_id: string;
  name: string;
  property_ids: string[];
  notes?: string;
  is_shared: boolean;
  share_token?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyWishlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  property_id: string;
  notes?: string;
  added_at: string;
}

export interface PropertyInquiry {
  id: string;
  property_id: string;
  user_id?: string;
  // Remove agent_id since users act as their own agents
  name?: string;
  email?: string;
  phone?: string;
  inquiry_type: 'general' | 'price_info' | 'viewing_request' | 'financing_info';
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'acknowledged' | 'in_progress' | 'responded' | 'closed';
  response_text?: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyAnalytics {
  id: string;
  property_id: string;
  date: string;
  views_count: number;
  unique_views: number;
  inquiries_count: number;
  favorites_count: number;
  shares_count: number;
  viewing_requests: number;
  leads_generated: number;
  viewings_scheduled: number;
  viewings_completed: number;
  offers_received: number;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  recipient_type: 'user' | 'admin';
  type: 'property_alert' | 'viewing_reminder' | 'message_received' | 'inquiry_received' | 'viewing_scheduled' | 'viewing_cancelled' | 'property_updated' | 'payment_reminder';
  title: string;
  message: string;
  property_id?: string;
  viewing_id?: string;
  inquiry_id?: string;
  is_read: boolean;
  read_at?: string;
  delivery_method: string[];
  email_sent: boolean;
  sms_sent: boolean;
  created_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  search_criteria: {
    location?: string;
    property_type?: string;
    price_min?: number;
    price_max?: number;
    bedrooms?: number;
    bathrooms?: number;
    features?: string[];
  };
  alerts_enabled: boolean;
  alert_frequency: 'immediate' | 'daily' | 'weekly';
  last_alert_sent?: string;
  results_count: number;
  last_run?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id?: string;
  property_id?: string;
  // Remove agent_id since users act as their own agents
  transaction_type: 'property_purchase' | 'agent_commission' | 'service_fee' | 'inspection_fee' | 'legal_fee';
  amount: number;
  currency: string;
  payment_method: 'paystack' | 'flutterwave' | 'bank_transfer' | 'cash' | 'interswitch';
  payment_reference?: string;
  gateway_reference?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  payment_date?: string;
  description?: string;
  fees: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Form types for creating/updating
export interface CreateViewingRequest {
  property_id: string;
  viewing_date: string;
  viewing_type: 'in_person' | 'virtual' | 'group';
  notes?: string;
  attendees_count?: number;
  // Remove agent_id since users act as their own agents
}

export interface CreateInquiryRequest {
  property_id: string;
  name?: string;
  email?: string;
  phone?: string;
  inquiry_type: 'general' | 'price_info' | 'viewing_request' | 'financing_info';
  message: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  phone?: string;
  source?: 'website' | 'referral' | 'social_media' | 'advertisement' | 'walk_in' | 'phone_call';
  budget_min?: number;
  budget_max?: number;
  preferred_property_type?: string;
  preferred_locations?: string[];
  bedrooms_min?: number;
  bathrooms_min?: number;
  notes?: string;
  tags?: string[];
}

export interface SendMessageRequest {
  conversation_id: string;
  message_text: string;
  message_type?: 'text' | 'image' | 'document' | 'property_link';
  file_url?: string;
}

// API Response types
export interface ConversationWithMessages extends Conversation {
  messages: Message[];
  property?: {
    id: string;
    title: string;
    price: number;
    images: string[];
    city: string;
    state: string;
    bedrooms?: number;
    bathrooms?: number;
    property_type: string;
    street: string;
  };
  // Remove agent since users act as their own agents
  user?: {
    id: string;
    name: string;
  };
}

export interface ViewingWithDetails extends PropertyViewing {
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
    images: string[];
  };
  user: {
    id: string;
    full_name: string;
    phone?: string;
    email: string;
  };
}

export interface LeadWithActivities extends Lead {
  activities: LeadActivity[];
  // Remove agent since users act as their own agents
}