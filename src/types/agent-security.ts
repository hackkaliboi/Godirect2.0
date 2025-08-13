// Enhanced Agent Security and KYC Types

export interface AgentKYC {
  id: string;
  agent_id: string;
  // Personal Information
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  
  // Contact Information
  email: string;
  phone: string;
  alternative_phone?: string;
  
  // Address Information
  residential_address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  office_address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  
  // Professional Information
  real_estate_license_number: string;
  license_expiry_date: string;
  professional_certification?: string;
  years_of_experience: number;
  specialization_areas: string[];
  
  // Identity Documents
  identity_document_type: 'national_id' | 'passport' | 'drivers_license';
  identity_document_number: string;
  identity_document_expiry: string;
  identity_document_front_url: string;
  identity_document_back_url?: string;
  
  // Professional Documents
  license_document_url: string;
  certificate_document_url?: string;
  
  // Financial Information
  bank_account_number: string;
  bank_name: string;
  bank_code: string;
  account_holder_name: string;
  tax_identification_number?: string;
  
  // Emergency Contact
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Verification Status
  verification_status: 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';
  verification_level: 'basic' | 'intermediate' | 'advanced';
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  
  // Background Check
  background_check_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  background_check_provider?: string;
  background_check_reference?: string;
  background_check_completed_at?: string;
  
  // Compliance
  compliance_training_completed: boolean;
  compliance_training_date?: string;
  anti_money_laundering_cleared: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

export interface AgentProfile {
  id: string;
  user_id: string;
  kyc_id?: string;
  
  // Profile Status
  profile_status: 'incomplete' | 'pending_kyc' | 'active' | 'suspended' | 'deactivated';
  can_receive_leads: boolean;
  can_schedule_viewings: boolean;
  can_process_payments: boolean; // Only true after full KYC verification
  
  // Professional Details
  agent_code: string; // Unique identifier for commission tracking
  commission_rate: number; // Percentage
  performance_rating: number;
  total_sales: number;
  total_commission_earned: number;
  
  // Activity Tracking
  last_active_at?: string;
  total_properties_sold: number;
  total_leads_converted: number;
  average_response_time_minutes: number;
  
  // Account Limits (until fully verified)
  max_monthly_leads: number;
  max_concurrent_viewings: number;
  commission_hold_period_days: number; // Commission held until cleared
  
  created_at: string;
  updated_at: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  provider: 'paystack' | 'flutterwave' | 'interswitch' | 'razorpay';
  
  // Configuration (encrypted)
  public_key: string;
  private_key_encrypted: string; // Encrypted with system key
  webhook_url: string;
  
  // Settings
  supported_currencies: string[];
  supported_countries: string[];
  transaction_fee_percentage: number;
  fixed_fee_amount: number;
  
  // Admin Controls
  is_active: boolean;
  is_default: boolean;
  admin_only: boolean; // Only admins can use this gateway
  
  // Security
  created_by_admin_id: string;
  last_modified_by_admin_id: string;
  
  created_at: string;
  updated_at: string;
}

export interface AgentCommissionTransaction {
  id: string;
  agent_id: string;
  payment_transaction_id: string;
  agent_tracking_code: string; // Unique code to track agent involvement
  
  // Transaction Details
  base_amount: number; // Original transaction amount
  commission_rate: number; // Rate at time of transaction
  commission_amount: number;
  
  // Status
  status: 'pending' | 'calculated' | 'approved' | 'paid' | 'disputed' | 'cancelled';
  
  // Payment Schedule
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  payment_reference?: string;
  
  // Verification
  requires_manual_approval: boolean;
  approved_by_admin_id?: string;
  approved_at?: string;
  
  // Dispute Management
  dispute_reason?: string;
  dispute_resolved_at?: string;
  dispute_resolution?: string;
  
  created_at: string;
  updated_at: string;
}

export interface AgentTrackingCode {
  id: string;
  agent_id: string;
  tracking_code: string; // Format: AG-XXXX-YYYY-ZZZZ
  
  // Usage Context
  property_id?: string;
  client_email?: string;
  client_phone?: string;
  
  // Metadata
  expires_at: string;
  used_at?: string;
  payment_transaction_id?: string;
  
  created_at: string;
}

export interface SecurityAuditLog {
  id: string;
  entity_type: 'agent' | 'payment_gateway' | 'commission' | 'kyc';
  entity_id: string;
  
  action: 'created' | 'updated' | 'deleted' | 'verified' | 'suspended' | 'payment_processed';
  actor_id: string;
  actor_type: 'admin' | 'system' | 'agent';
  
  // Security Context
  ip_address: string;
  user_agent: string;
  location?: string;
  
  // Change Details
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  
  // Risk Assessment
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  
  created_at: string;
}

// API Request Types
export interface CreateAgentKYCRequest {
  personal_info: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    nationality: string;
  };
  
  contact_info: {
    email: string;
    phone: string;
    alternative_phone?: string;
  };
  
  addresses: {
    residential: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
    office?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
  };
  
  professional_info: {
    license_number: string;
    license_expiry: string;
    certification?: string;
    experience_years: number;
    specializations: string[];
  };
  
  identity_documents: {
    type: 'national_id' | 'passport' | 'drivers_license';
    number: string;
    expiry_date: string;
    front_image: File;
    back_image?: File;
  };
  
  professional_documents: {
    license_document: File;
    certificate_document?: File;
  };
  
  financial_info: {
    bank_account_number: string;
    bank_name: string;
    bank_code: string;
    account_holder_name: string;
    tax_id?: string;
  };
  
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
}

export interface GenerateAgentTrackingCodeRequest {
  agent_id: string;
  property_id?: string;
  client_email?: string;
  client_phone?: string;
  expires_in_hours?: number; // Default 24 hours
}
