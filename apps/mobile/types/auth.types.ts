import { Session, User } from '@supabase/supabase-js';

/**
 * Authentication state interface
 */
export interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

/**
 * Authentication context interface
 */
export interface AuthContextType extends AuthState {
    // Auth methods
    signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<AuthResult>;
    signIn: (email: string, password: string) => Promise<AuthResult>;
    signOut: () => Promise<AuthResult>;
    resetPassword: (email: string) => Promise<AuthResult>;
    updatePassword: (newPassword: string) => Promise<AuthResult>;

    // Session methods
    refreshSession: () => Promise<void>;

    // State helpers
    clearError: () => void;
    error: string | null;
}

/**
 * User metadata for registration
 */
export interface UserMetadata {
    username?: string;
    full_name?: string;
    avatar_url?: string;
}

/**
 * Auth operation result
 */
export interface AuthResult {
    success: boolean;
    error?: string;
    data?: {
        user?: User;
        session?: Session;
    };
}

/**
 * Sign up form data
 */
export interface SignUpFormData {
    email: string;
    password: string;
    confirmPassword: string;
    username?: string;
    acceptTerms: boolean;
}

/**
 * Sign in form data
 */
export interface SignInFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Forgot password form data
 */
export interface ForgotPasswordFormData {
    email: string;
}

/**
 * Profile update form data
 */
export interface ProfileFormData {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
}
