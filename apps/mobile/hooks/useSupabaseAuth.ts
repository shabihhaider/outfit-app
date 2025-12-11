import { useEffect, useState, useCallback } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}

/**
 * Low-level hook for Supabase authentication state management
 * Handles session listener and automatic token refresh
 */
export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Get current session from storage
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[useSupabaseAuth] Error getting session:', error.message);
          setSession(null);
          setUser(null);
        } else {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('[useSupabaseAuth] Initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        console.log('[useSupabaseAuth] Auth state changed:', event);

        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('[useSupabaseAuth] User signed in');
            break;
          case 'SIGNED_OUT':
            console.log('[useSupabaseAuth] User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('[useSupabaseAuth] Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('[useSupabaseAuth] User updated');
            break;
          case 'PASSWORD_RECOVERY':
            console.log('[useSupabaseAuth] Password recovery initiated');
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
    user,
    session,
    isLoading,
    isInitialized,
  };
}

/**
 * Hook to check if user's email is verified
 */
export function useEmailVerification(): {
  isVerified: boolean;
  checkVerification: () => Promise<boolean>;
} {
  const [isVerified, setIsVerified] = useState(false);

  const checkVerification = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const verified = user?.email_confirmed_at !== null;
    setIsVerified(verified);
    return verified;
  }, []);

  useEffect(() => {
    checkVerification();
  }, [checkVerification]);

  return { isVerified, checkVerification };
}