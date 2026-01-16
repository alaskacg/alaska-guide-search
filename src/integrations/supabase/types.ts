export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      guide_applications: {
        Row: {
          address_line1: string
          address_line2: string | null
          admin_notes: string | null
          bio: string | null
          business_license_number: string | null
          business_name: string | null
          city: string
          cpr_first_aid_cert_url: string | null
          created_at: string
          date_of_birth: string
          full_legal_name: string
          government_id_url: string | null
          guide_license_url: string | null
          id: string
          insurance_certificate_url: string | null
          phone_number: string
          references_info: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          service_areas: string[]
          service_types: Database["public"]["Enums"]["guide_service_type"][]
          social_media_links: Json | null
          state: string
          status: Database["public"]["Enums"]["guide_application_status"]
          updated_at: string
          user_id: string
          website_url: string | null
          years_of_experience: number
          zip_code: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          admin_notes?: string | null
          bio?: string | null
          business_license_number?: string | null
          business_name?: string | null
          city: string
          cpr_first_aid_cert_url?: string | null
          created_at?: string
          date_of_birth: string
          full_legal_name: string
          government_id_url?: string | null
          guide_license_url?: string | null
          id?: string
          insurance_certificate_url?: string | null
          phone_number: string
          references_info?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_areas: string[]
          service_types: Database["public"]["Enums"]["guide_service_type"][]
          social_media_links?: Json | null
          state: string
          status?: Database["public"]["Enums"]["guide_application_status"]
          updated_at?: string
          user_id: string
          website_url?: string | null
          years_of_experience: number
          zip_code: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          admin_notes?: string | null
          bio?: string | null
          business_license_number?: string | null
          business_name?: string | null
          city?: string
          cpr_first_aid_cert_url?: string | null
          created_at?: string
          date_of_birth?: string
          full_legal_name?: string
          government_id_url?: string | null
          guide_license_url?: string | null
          id?: string
          insurance_certificate_url?: string | null
          phone_number?: string
          references_info?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_areas?: string[]
          service_types?: Database["public"]["Enums"]["guide_service_type"][]
          social_media_links?: Json | null
          state?: string
          status?: Database["public"]["Enums"]["guide_application_status"]
          updated_at?: string
          user_id?: string
          website_url?: string | null
          years_of_experience?: number
          zip_code?: string
        }
        Relationships: []
      }
      guide_availability: {
        Row: {
          created_at: string
          date: string
          end_time: string
          guide_profile_id: string
          id: string
          is_available: boolean | null
          notes: string | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          guide_profile_id: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          guide_profile_id?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_availability_guide_profile_id_fkey"
            columns: ["guide_profile_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_blocked_dates: {
        Row: {
          created_at: string
          end_date: string
          guide_profile_id: string
          id: string
          reason: string | null
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          guide_profile_id: string
          id?: string
          reason?: string | null
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          guide_profile_id?: string
          id?: string
          reason?: string | null
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_blocked_dates_guide_profile_id_fkey"
            columns: ["guide_profile_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_media: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          file_path: string
          file_type: string
          guide_profile_id: string
          id: string
          is_cover_image: boolean | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          file_path: string
          file_type: string
          guide_profile_id: string
          id?: string
          is_cover_image?: boolean | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          file_path?: string
          file_type?: string
          guide_profile_id?: string
          id?: string
          is_cover_image?: boolean | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_media_guide_profile_id_fkey"
            columns: ["guide_profile_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_profiles: {
        Row: {
          application_id: string
          avatar_url: string | null
          average_rating: number | null
          bio: string | null
          business_name: string | null
          cover_image_url: string | null
          created_at: string
          display_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          service_areas: string[]
          service_types: Database["public"]["Enums"]["guide_service_type"][]
          tagline: string | null
          total_bookings: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verified_at: string | null
          website_url: string | null
          years_of_experience: number
        }
        Insert: {
          application_id: string
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          business_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          service_areas: string[]
          service_types: Database["public"]["Enums"]["guide_service_type"][]
          tagline?: string | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          website_url?: string | null
          years_of_experience: number
        }
        Update: {
          application_id?: string
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          business_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          service_areas?: string[]
          service_types?: Database["public"]["Enums"]["guide_service_type"][]
          tagline?: string | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          website_url?: string | null
          years_of_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "guide_profiles_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "guide_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_recurring_availability: {
        Row: {
          created_at: string
          day_of_week: number
          effective_from: string | null
          effective_until: string | null
          end_time: string
          guide_profile_id: string
          id: string
          is_active: boolean | null
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          effective_from?: string | null
          effective_until?: string | null
          end_time: string
          guide_profile_id: string
          id?: string
          is_active?: boolean | null
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          effective_from?: string | null
          effective_until?: string | null
          end_time?: string
          guide_profile_id?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_recurring_availability_guide_profile_id_fkey"
            columns: ["guide_profile_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      guide_application_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
      guide_service_type: "adventure" | "eco" | "hunting" | "fishing" | "pilot"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      guide_application_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
      ],
      guide_service_type: ["adventure", "eco", "hunting", "fishing", "pilot"],
    },
  },
} as const
