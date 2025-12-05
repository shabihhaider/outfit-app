import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// For client-side (browser/mobile) - uses anon key
export function createBrowserClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

// For server-side (API routes) - uses service role key
export function createServerClient(
  supabaseUrl: string,
  supabaseServiceKey: string,
) {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Re-export types for convenience
export type { Database } from "./database.types";
export type Tables = Database["public"]["Tables"];
export type WardrobeItem = Tables["wardrobe_items"]["Row"];
export type Profile = Tables["profiles"]["Row"];
export type StyleProfile = Tables["style_profiles"]["Row"];
export type ShoppingProduct = Tables["shopping_products"]["Row"];
export type UserFeedback = Tables["user_feedback"]["Row"];
