import React, { createContext, useContext, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import Toast from "react-native-toast-message";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Wraps the app to provide authentication context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { session, isLoading, user } = useSupabaseAuth();

  /**
   * Sign up a new user with email and password
   * Also creates a profile entry in the database
   */
  const signUp = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: error.message,
        });
        return { error };
      }

      if (data.user) {
        // Create profile in database
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username,
          email,
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Note: User is created in auth but profile failed
          // Consider handling this edge case
        }

        Toast.show({
          type: "success",
          text1: "Account Created!",
          text2: "Welcome to Outfit App",
        });
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      Toast.show({
        type: "error",
        text1: "Sign Up Failed",
        text2: "An unexpected error occurred",
      });
      return { error: error as AuthError };
    }
  };

  /**
   * Sign in an existing user with email and password
   */
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        Toast.show({
          type: "error",
          text1: "Sign In Failed",
          text2: error.message,
        });
        return { error };
      }

      Toast.show({
        type: "success",
        text1: "Welcome Back!",
        text2: "You've successfully signed in",
      });

      return { error: null };
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      Toast.show({
        type: "error",
        text1: "Sign In Failed",
        text2: "An unexpected error occurred",
      });
      return { error: error as AuthError };
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
        Toast.show({
          type: "error",
          text1: "Sign Out Failed",
          text2: error.message,
        });
        return { error };
      }

      Toast.show({
        type: "success",
        text1: "Signed Out",
        text2: "See you next time!",
      });

      return { error: null };
    } catch (error) {
      console.error("Unexpected sign out error:", error);
      Toast.show({
        type: "error",
        text1: "Sign Out Failed",
        text2: "An unexpected error occurred",
      });
      return { error: error as AuthError };
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "outfitapp://reset-password",
      });

      if (error) {
        console.error("Password reset error:", error);
        Toast.show({
          type: "error",
          text1: "Reset Failed",
          text2: error.message,
        });
        return { error };
      }

      Toast.show({
        type: "success",
        text1: "Check Your Email",
        text2: "Password reset link has been sent",
      });

      return { error: null };
    } catch (error) {
      console.error("Unexpected password reset error:", error);
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: "An unexpected error occurred",
      });
      return { error: error as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}