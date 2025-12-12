import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdate {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
}

export interface UseProfileReturn {
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateProfile: (updates: ProfileUpdate) => Promise<{ success: boolean; error?: string }>;
}

export function useProfile(): UseProfileReturn {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user?.id) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (fetchError) {
                // If profile doesn't exist, create one
                if (fetchError.code === 'PGRST116') {
                    const { data: newProfile, error: createError } = await supabase
                        .from('profiles')
                        .insert({
                            id: user.id,
                            username: user.email?.split('@')[0] || null,
                            full_name: null,
                            avatar_url: null,
                            bio: null,
                        } as any)
                        .select()
                        .single();

                    if (createError) {
                        throw createError;
                    }

                    setProfile(newProfile as unknown as Profile);
                } else {
                    throw fetchError;
                }
            } else {
                setProfile(data as unknown as Profile);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load profile';
            console.error('[useProfile] Fetch error:', message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    const updateProfile = useCallback(async (
        updates: ProfileUpdate
    ): Promise<{ success: boolean; error?: string }> => {
        if (!user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                } as any)
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) {
                console.error('[useProfile] Update error:', updateError.message);
                return { success: false, error: updateError.message };
            }

            setProfile(data as unknown as Profile);
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Update failed';
            console.error('[useProfile] Update exception:', message);
            return { success: false, error: message };
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        isLoading,
        error,
        refetch: fetchProfile,
        updateProfile,
    };
}

export default useProfile;
