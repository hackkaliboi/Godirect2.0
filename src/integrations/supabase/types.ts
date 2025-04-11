export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          property_type: string | null
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
          property_type?: string | null
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
          property_type?: string | null
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
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          agent_id: string | null
          amenities: string[]
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[]
          price: number
          property_type: string
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
          amenities?: string[]
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
          amenities?: string[]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_user_type: {
        Args: { requested_type: string }
        Returns: boolean
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
