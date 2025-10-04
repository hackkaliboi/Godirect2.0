export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  status: string | null;
  user_type: string;
  updated_at: string | null;
}

export type Database = {
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          reference_id: string | null
          reference_table: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          reference_id?: string | null
          reference_table?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          reference_id?: string | null
          reference_table?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          experience: number | null
          id: string
          image: string | null
          listings: number | null
          name: string
          phone: string | null
          ratings: number | null
          reviews: number | null
          sales: number | null
          specializations: string[]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          experience?: number | null
          id?: string
          image?: string | null
          listings?: number | null
          name: string
          phone?: string | null
          ratings?: number | null
          reviews?: number | null
          sales?: number | null
          specializations?: string[]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          experience?: number | null
          id?: string
          image?: string | null
          listings?: number | null
          name?: string
          phone?: string | null
          ratings?: number | null
          reviews?: number | null
          sales?: number | null
          specializations?: string[]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          agent_id: string | null
          bathrooms: string | null
          bedrooms: string | null
          budget: string | null
          created_at: string | null
          email: string
          id: string
          last_contact: string | null
          location: string | null
          name: string
          phone: string | null
          price_range: string | null
          type: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          budget?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_contact?: string | null
          location?: string | null
          name: string
          phone?: string | null
          price_range?: string | null
          type?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          budget?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_contact?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          price_range?: string | null
          type?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_stats: {
        Row: {
          compare_text: string | null
          id: string
          stat_change: number | null
          stat_name: string
          stat_value: string
          trend: string | null
          updated_at: string | null
        }
        Insert: {
          compare_text?: string | null
          id?: string
          stat_change?: number | null
          stat_name: string
          stat_value: string
          trend?: string | null
          updated_at?: string | null
        }
        Update: {
          compare_text?: string | null
          id?: string
          stat_change?: number | null
          stat_name?: string
          stat_value?: string
          trend?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          message: string
          property_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          property_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      market_trends: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          title: string
          trend: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          trend: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          trend?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      payment_method_stats: {
        Row: {
          created_at: string | null
          id: string
          method_key: string | null
          reference_date: string
          transaction_count: number | null
          transaction_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          method_key?: string | null
          reference_date?: string
          transaction_count?: number | null
          transaction_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          method_key?: string | null
          reference_date?: string
          transaction_count?: number | null
          transaction_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_method_stats_method_key_fkey"
            columns: ["method_key"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["method_key"]
          },
        ]
      }
      payment_methods: {
        Row: {
          configuration: Json | null
          created_at: string | null
          description: string | null
          display_name: string
          icon_name: string
          id: string
          is_active: boolean | null
          method_key: string
          method_name: string
          updated_at: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon_name: string
          id?: string
          is_active?: boolean | null
          method_key: string
          method_name: string
          updated_at?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          method_key?: string
          method_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_date: string | null
          payment_method: string
          property_id: string | null
          reference: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method: string
          property_id?: string | null
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string
          property_id?: string | null
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          agent_id: string | null
          features: string[]
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[]
          price: number
          type: string
          square_feet: number | null
          state: string
          status: string
          street: string | null
          title: string
          updated_at: string | null
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          agent_id?: string | null
          features?: string[]
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[]
          price: number
          property_type: string
          square_feet?: number | null
          state: string
          status: string
          street?: string | null
          title: string
          updated_at?: string | null
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          agent_id?: string | null
          features?: string[]
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[]
          price?: number
          property_type?: string
          square_feet?: number | null
          state?: string
          status?: string
          street?: string | null
          title?: string
          updated_at?: string | null
          year_built?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          property_id: string | null
          user_id: string | null
          view_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          property_id?: string | null
          user_id?: string | null
          view_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          property_id?: string | null
          user_id?: string | null
          view_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_metrics: {
        Row: {
          average_value: number | null
          change_percentage: number | null
          completion_percentage: number | null
          created_at: string | null
          id: string
          metric_date: string
          metric_type: string
          revenue: number
          sales_count: number | null
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          average_value?: number | null
          change_percentage?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          metric_date: string
          metric_type: string
          revenue?: number
          sales_count?: number | null
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          average_value?: number | null
          change_percentage?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          metric_date?: string
          metric_type?: string
          revenue?: number
          sales_count?: number | null
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          agent_id: string | null
          buyer_id: string | null
          commission_amount: number | null
          created_at: string | null
          id: string
          property_id: string | null
          sale_date: string | null
          sale_price: number
          seller_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          buyer_id?: string | null
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          property_id?: string | null
          sale_date?: string | null
          sale_price: number
          seller_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          buyer_id?: string | null
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          property_id?: string | null
          sale_date?: string | null
          sale_price?: number
          seller_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          location: string | null
          name: string
          rating: number
          testimonial: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          location?: string | null
          name: string
          rating: number
          testimonial: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          location?: string | null
          name?: string
          rating?: number
          testimonial?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          id: string
          property_id: string | null
          user_id: string
          agent_id: string
          title: string | null
          status: string
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id: string
          agent_id: string
          title?: string | null
          status?: string
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string
          agent_id?: string
          title?: string | null
          status?: string
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_type: string
          message_text: string
          message_type: string
          file_url: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_type: string
          message_text: string
          message_type: string
          file_url?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          sender_type?: string
          message_text?: string
          message_type?: string
          file_url?: string | null
          read_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      property_viewings: {
        Row: {
          id: string
          property_id: string
          user_id: string
          agent_id: string
          viewing_date: string
          viewing_type: string
          status: string
          duration_minutes: number
          notes: string | null
          attendees_count: number
          meeting_link: string | null
          reminder_sent: boolean
          user_notes: string | null
          agent_notes: string | null
          rating: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          agent_id: string
          viewing_date: string
          viewing_type: string
          status?: string
          duration_minutes?: number
          notes?: string | null
          attendees_count?: number
          meeting_link?: string | null
          reminder_sent?: boolean
          user_notes?: string | null
          agent_notes?: string | null
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          agent_id?: string
          viewing_date?: string
          viewing_type?: string
          status?: string
          duration_minutes?: number
          notes?: string | null
          attendees_count?: number
          meeting_link?: string | null
          reminder_sent?: boolean
          user_notes?: string | null
          agent_notes?: string | null
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          source: string | null
          status: string
          score: number
          budget_min: number | null
          budget_max: number | null
          preferred_property_type: string | null
          preferred_locations: string[] | null
          bedrooms_min: number | null
          bathrooms_min: number | null
          assigned_agent_id: string | null
          last_contact_date: string | null
          next_followup_date: string | null
          conversion_date: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          source?: string | null
          status?: string
          score?: number
          budget_min?: number | null
          budget_max?: number | null
          preferred_property_type?: string | null
          preferred_locations?: string[] | null
          bedrooms_min?: number | null
          bathrooms_min?: number | null
          assigned_agent_id?: string | null
          last_contact_date?: string | null
          next_followup_date?: string | null
          conversion_date?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          source?: string | null
          status?: string
          score?: number
          budget_min?: number | null
          budget_max?: number | null
          preferred_property_type?: string | null
          preferred_locations?: string[] | null
          bedrooms_min?: number | null
          bathrooms_min?: number | null
          assigned_agent_id?: string | null
          last_contact_date?: string | null
          next_followup_date?: string | null
          conversion_date?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          agent_id: string | null
          activity_type: string
          title: string
          description: string | null
          outcome: string | null
          scheduled_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          agent_id?: string | null
          activity_type: string
          title: string
          description?: string | null
          outcome?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          agent_id?: string | null
          activity_type?: string
          title?: string
          description?: string | null
          outcome?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          agent_id: string | null
          name: string | null
          email: string | null
          phone: string | null
          inquiry_type: string
          message: string
          urgency: string
          status: string
          response_text: string | null
          responded_at: string | null
          responded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string | null
          agent_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          inquiry_type: string
          message: string
          urgency?: string
          status?: string
          response_text?: string | null
          responded_at?: string | null
          responded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string | null
          agent_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          inquiry_type?: string
          message?: string
          urgency?: string
          status?: string
          response_text?: string | null
          responded_at?: string | null
          responded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          recipient_type: string
          type: string
          title: string
          message: string
          property_id: string | null
          viewing_id: string | null
          inquiry_id: string | null
          is_read: boolean
          read_at: string | null
          delivery_method: string[]
          email_sent: boolean
          sms_sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          recipient_type: string
          type: string
          title: string
          message: string
          property_id?: string | null
          viewing_id?: string | null
          inquiry_id?: string | null
          is_read?: boolean
          read_at?: string | null
          delivery_method?: string[]
          email_sent?: boolean
          sms_sent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          recipient_type?: string
          type?: string
          title?: string
          message?: string
          property_id?: string | null
          viewing_id?: string | null
          inquiry_id?: string | null
          is_read?: boolean
          read_at?: string | null
          delivery_method?: string[]
          email_sent?: boolean
          sms_sent?: boolean
          created_at?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          name: string
          search_criteria: Json
          alerts_enabled: boolean
          alert_frequency: string
          last_alert_sent: string | null
          results_count: number
          last_run: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          search_criteria: Json
          alerts_enabled?: boolean
          alert_frequency?: string
          last_alert_sent?: string | null
          results_count?: number
          last_run?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          search_criteria?: Json
          alerts_enabled?: boolean
          alert_frequency?: string
          last_alert_sent?: string | null
          results_count?: number
          last_run?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          id: string
          user_id: string | null
          property_id: string | null
          agent_id: string | null
          transaction_type: string
          amount: number
          currency: string
          payment_method: string
          payment_reference: string | null
          gateway_reference: string | null
          status: string
          payment_date: string | null
          description: string | null
          fees: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          agent_id?: string | null
          transaction_type: string
          amount: number
          currency: string
          payment_method: string
          payment_reference?: string | null
          gateway_reference?: string | null
          status?: string
          payment_date?: string | null
          description?: string | null
          fees?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          agent_id?: string | null
          transaction_type?: string
          amount?: number
          currency?: string
          payment_method?: string
          payment_reference?: string | null
          gateway_reference?: string | null
          status?: string
          payment_date?: string | null
          description?: string | null
          fees?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_analytics: {
        Row: {
          id: string
          property_id: string
          date: string
          views_count: number
          unique_views: number
          inquiries_count: number
          favorites_count: number
          shares_count: number
          viewing_requests: number
          leads_generated: number
          viewings_scheduled: number
          viewings_completed: number
          offers_received: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          date: string
          views_count?: number
          unique_views?: number
          inquiries_count?: number
          favorites_count?: number
          shares_count?: number
          viewing_requests?: number
          leads_generated?: number
          viewings_scheduled?: number
          viewings_completed?: number
          offers_received?: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          date?: string
          views_count?: number
          unique_views?: number
          inquiries_count?: number
          favorites_count?: number
          shares_count?: number
          viewing_requests?: number
          leads_generated?: number
          viewings_scheduled?: number
          viewings_completed?: number
          offers_received?: number
          created_at?: string
        }
        Relationships: []
      }
      global_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json | null
          setting_type: string | null
          category: string | null
          description: string | null
          is_active: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: Json | null
          setting_type?: string | null
          category?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json | null
          setting_type?: string | null
          category?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          id: string
          user_id: string
          document_type: string
          document_number: string | null
          document_url: string
          verification_status: string
          verified_by: string | null
          verified_at: string | null
          rejection_reason: string | null
          expiry_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_type: string
          document_number?: string | null
          document_url: string
          verification_status?: string
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          expiry_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: string
          document_number?: string | null
          document_url?: string
          verification_status?: string
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          expiry_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          id: string
          user_id: string | null
          agent_id: string | null
          property_id: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string
          status: string
          location: string | null
          meeting_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          agent_id?: string | null
          property_id?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time: string
          status?: string
          location?: string | null
          meeting_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          agent_id?: string | null
          property_id?: string | null
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          status?: string
          location?: string | null
          meeting_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_users: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      is_user_type: {
        Args: { requested_type: string }
        Returns: boolean
      }
      increment_property_analytics: {
        Args: {
          p_property_id: string;
          p_date: string;
          p_metric: string;
        }
        Returns: undefined;
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
