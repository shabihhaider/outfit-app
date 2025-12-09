import { useEffect, useState } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/**
 * Hook to listen to Supabase auth state changes
 * Handles session initialization, refresh, and cleanup
 */
export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state changed:", event, session?.user?.id);

        setSession(session);
        setIsLoading(false);

        // Handle specific auth events
        switch (event) {
          case "SIGNED_IN":
            console.log("User signed in:", session?.user?.email);
            break;
          case "SIGNED_OUT":
            console.log("User signed out");
            break;
          case "TOKEN_REFRESHED":
            console.log("Token refreshed");
            break;
          case "USER_UPDATED":
            console.log("User updated");
            break;
          case "PASSWORD_RECOVERY":
            console.log("Password recovery initiated");
            break;
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
    user: session?.user ?? null,
  };
}