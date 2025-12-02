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
      outfit_items: {
        Row: {
          created_at: string | null
          id: string
          outfit_id: string
          position: number | null
          wardrobe_item_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          outfit_id: string
          position?: number | null
          wardrobe_item_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          outfit_id?: string
          position?: number | null
          wardrobe_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfit_items_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfit_items_wardrobe_item_id_fkey"
            columns: ["wardrobe_item_id"]
            isOneToOne: false
            referencedRelation: "wardrobe_items"
            referencedColumns: ["id"]
          },
        ]
      }
      outfits: {
        Row: {
          created_at: string | null
          id: string
          is_favorite: boolean | null
          name: string | null
          occasion: string | null
          season: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string | null
          occasion?: string | null
          season?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string | null
          occasion?: string | null
          season?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outfits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shopping_products: {
        Row: {
          affiliate_url: string | null
          ai_confidence: number | null
          brand: string | null
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          external_id: string
          id: string
          image_url: string | null
          in_stock: boolean | null
          last_synced_at: string | null
          name: string
          occasions: Json | null
          pattern: Database["public"]["Enums"]["pattern_enum"] | null
          price: number | null
          primary_color: string | null
          product_url: string | null
          retailer: string | null
          secondary_colors: Json | null
          source: string
          style_tags: Json | null
          subcategory: string | null
          warmth_level: Database["public"]["Enums"]["warmth_level_enum"] | null
        }
        Insert: {
          affiliate_url?: string | null
          ai_confidence?: number | null
          brand?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_id: string
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          last_synced_at?: string | null
          name: string
          occasions?: Json | null
          pattern?: Database["public"]["Enums"]["pattern_enum"] | null
          price?: number | null
          primary_color?: string | null
          product_url?: string | null
          retailer?: string | null
          secondary_colors?: Json | null
          source: string
          style_tags?: Json | null
          subcategory?: string | null
          warmth_level?: Database["public"]["Enums"]["warmth_level_enum"] | null
        }
        Update: {
          affiliate_url?: string | null
          ai_confidence?: number | null
          brand?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_id?: string
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          last_synced_at?: string | null
          name?: string
          occasions?: Json | null
          pattern?: Database["public"]["Enums"]["pattern_enum"] | null
          price?: number | null
          primary_color?: string | null
          product_url?: string | null
          retailer?: string | null
          secondary_colors?: Json | null
          source?: string
          style_tags?: Json | null
          subcategory?: string | null
          warmth_level?: Database["public"]["Enums"]["warmth_level_enum"] | null
        }
        Relationships: []
      }
      style_profiles: {
        Row: {
          body_type: string | null
          budget_max: number | null
          budget_min: number | null
          color_palette: Json | null
          color_season: string | null
          created_at: string | null
          excluded_brands: Json | null
          id: string
          skin_undertone:
            | Database["public"]["Enums"]["skin_undertone_enum"]
            | null
          style_preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          body_type?: string | null
          budget_max?: number | null
          budget_min?: number | null
          color_palette?: Json | null
          color_season?: string | null
          created_at?: string | null
          excluded_brands?: Json | null
          id?: string
          skin_undertone?:
            | Database["public"]["Enums"]["skin_undertone_enum"]
            | null
          style_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          body_type?: string | null
          budget_max?: number | null
          budget_min?: number | null
          color_palette?: Json | null
          color_season?: string | null
          created_at?: string | null
          excluded_brands?: Json | null
          id?: string
          skin_undertone?:
            | Database["public"]["Enums"]["skin_undertone_enum"]
            | null
          style_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "style_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          corrected_attributes: Json | null
          corrected_category: string | null
          created_at: string | null
          id: string
          original_attributes: Json | null
          original_category: string | null
          user_id: string | null
          wardrobe_item_id: string | null
        }
        Insert: {
          corrected_attributes?: Json | null
          corrected_category?: string | null
          created_at?: string | null
          id?: string
          original_attributes?: Json | null
          original_category?: string | null
          user_id?: string | null
          wardrobe_item_id?: string | null
        }
        Update: {
          corrected_attributes?: Json | null
          corrected_category?: string | null
          created_at?: string | null
          id?: string
          original_attributes?: Json | null
          original_category?: string | null
          user_id?: string | null
          wardrobe_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_wardrobe_item_id_fkey"
            columns: ["wardrobe_item_id"]
            isOneToOne: false
            referencedRelation: "wardrobe_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wardrobe_items: {
        Row: {
          ai_confidence: number | null
          brand: string | null
          category: string | null
          classification_source:
            | Database["public"]["Enums"]["classification_source_enum"]
            | null
          created_at: string | null
          id: string
          image_url: string
          is_archived: boolean | null
          is_favorite: boolean | null
          last_worn_at: string | null
          name: string | null
          occasions: Json | null
          pattern: Database["public"]["Enums"]["pattern_enum"] | null
          primary_color: string | null
          secondary_colors: Json | null
          status: Database["public"]["Enums"]["item_status_enum"] | null
          style_tags: Json | null
          subcategory: string | null
          thumbnail_url: string | null
          times_worn: number | null
          updated_at: string | null
          user_id: string
          user_verified: boolean | null
          warmth_level: Database["public"]["Enums"]["warmth_level_enum"] | null
          weather_resistance:
            | Database["public"]["Enums"]["weather_resistance_enum"]
            | null
        }
        Insert: {
          ai_confidence?: number | null
          brand?: string | null
          category?: string | null
          classification_source?:
            | Database["public"]["Enums"]["classification_source_enum"]
            | null
          created_at?: string | null
          id?: string
          image_url: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          last_worn_at?: string | null
          name?: string | null
          occasions?: Json | null
          pattern?: Database["public"]["Enums"]["pattern_enum"] | null
          primary_color?: string | null
          secondary_colors?: Json | null
          status?: Database["public"]["Enums"]["item_status_enum"] | null
          style_tags?: Json | null
          subcategory?: string | null
          thumbnail_url?: string | null
          times_worn?: number | null
          updated_at?: string | null
          user_id: string
          user_verified?: boolean | null
          warmth_level?: Database["public"]["Enums"]["warmth_level_enum"] | null
          weather_resistance?:
            | Database["public"]["Enums"]["weather_resistance_enum"]
            | null
        }
        Update: {
          ai_confidence?: number | null
          brand?: string | null
          category?: string | null
          classification_source?:
            | Database["public"]["Enums"]["classification_source_enum"]
            | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          last_worn_at?: string | null
          name?: string | null
          occasions?: Json | null
          pattern?: Database["public"]["Enums"]["pattern_enum"] | null
          primary_color?: string | null
          secondary_colors?: Json | null
          status?: Database["public"]["Enums"]["item_status_enum"] | null
          style_tags?: Json | null
          subcategory?: string | null
          thumbnail_url?: string | null
          times_worn?: number | null
          updated_at?: string | null
          user_id?: string
          user_verified?: boolean | null
          warmth_level?: Database["public"]["Enums"]["warmth_level_enum"] | null
          weather_resistance?:
            | Database["public"]["Enums"]["weather_resistance_enum"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "wardrobe_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      classification_source_enum: "fashionclip" | "vlm" | "user"
      gender_enum: "male" | "female" | "non_binary" | "prefer_not_to_say"
      item_status_enum: "pending" | "classified" | "needs_review"
      pattern_enum:
        | "solid"
        | "striped"
        | "floral"
        | "plaid"
        | "abstract"
        | "checkered"
        | "polka_dot"
        | "other"
      skin_undertone_enum: "warm" | "cool" | "neutral"
      warmth_level_enum:
        | "ultralight"
        | "light"
        | "medium"
        | "heavy"
        | "very_heavy"
      weather_resistance_enum: "none" | "water_resistant" | "waterproof"
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
      classification_source_enum: ["fashionclip", "vlm", "user"],
      gender_enum: ["male", "female", "non_binary", "prefer_not_to_say"],
      item_status_enum: ["pending", "classified", "needs_review"],
      pattern_enum: [
        "solid",
        "striped",
        "floral",
        "plaid",
        "abstract",
        "checkered",
        "polka_dot",
        "other",
      ],
      skin_undertone_enum: ["warm", "cool", "neutral"],
      warmth_level_enum: [
        "ultralight",
        "light",
        "medium",
        "heavy",
        "very_heavy",
      ],
      weather_resistance_enum: ["none", "water_resistant", "waterproof"],
    },
  },
} as const
