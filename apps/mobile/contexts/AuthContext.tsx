import React, { createContext, useContext, useCallback, useState, useMemo, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { AuthContextType, AuthResult, UserMetadata } from '../types/auth.types';

// Create context with undefined default (will be set by provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Wraps the app and provides authentication state and methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { user, session, isLoading: isAuthLoading, isInitialized } = useSupabaseAuth();
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combined loading state
  const isLoading = isAuthLoading || isOperationLoading || !isInitialized;

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async (
    email: string,
    password: string,
    metadata?: UserMetadata
  ): Promise<AuthResult> => {
    try {
      setIsOperationLoading(true);
      setError(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: undefined, // Handle in-app
        },
      });

      if (signUpError) {
        const errorMessage = getAuthErrorMessage(signUpError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // User created but needs to verify email
        return {
          success: true,
          data: { user: data.user },
          error: 'Please check your email to verify your account.',
        };
      }

      return {
        success: true,
        data: { user: data.user ?? undefined, session: data.session ?? undefined },
      };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign up.';
      setError(errorMessage);
      console.error('[AuthContext] Sign up error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsOperationLoading(false);
    }
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      setIsOperationLoading(true);
      setError(null);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const errorMessage = getAuthErrorMessage(signInError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return {
        success: true,
        data: { user: data.user, session: data.session },
      };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign in.';
      setError(errorMessage);
      console.error('[AuthContext] Sign in error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsOperationLoading(false);
    }
  }, []);

  /**
   * Sign out current user
   */
  const signOut = useCallback(async (): Promise<AuthResult> => {
    try {
      setIsOperationLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        const errorMessage = getAuthErrorMessage(signOutError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign out.';
      setError(errorMessage);
      console.error('[AuthContext] Sign out error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsOperationLoading(false);
    }
  }, []);

  /**
   * Request password reset email
   */
  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      setIsOperationLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined, // Handle in-app with deep link
      });

      if (resetError) {
        const errorMessage = getAuthErrorMessage(resetError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while sending reset email.';
      setError(errorMessage);
      console.error('[AuthContext] Reset password error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsOperationLoading(false);
    }
  }, []);

  /**
   * Update user's password (after reset or when logged in)
   */
  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResult> => {
    try {
      setIsOperationLoading(true);
      setError(null);

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        const errorMessage = getAuthErrorMessage(updateError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating password.';
      setError(errorMessage);
      console.error('[AuthContext] Update password error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsOperationLoading(false);
    }
  }, []);

  /**
   * Manually refresh the session
   */
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('[AuthContext] Session refresh error:', refreshError.message);
      }
    } catch (err) {
      console.error('[AuthContext] Session refresh error:', err);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    clearError,
  }), [
    user,
    session,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    clearError,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Convert Supabase error messages to user-friendly messages
 */
function getAuthErrorMessage(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please verify your email address before signing in.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters': 'Password must be at least 8 characters long.',
    'Email rate limit exceeded': 'Too many attempts. Please try again later.',
    'Invalid email': 'Please enter a valid email address.',
    'Signup disabled': 'New registrations are currently disabled.',
    'Email link is invalid or has expired': 'This link has expired. Please request a new one.',
  };

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return original message if no match (consider logging unknown errors)
  console.warn('[AuthContext] Unknown auth error:', message);
  return message;
}

// Export types for convenience
export type { AuthContextType, AuthResult, UserMetadata };