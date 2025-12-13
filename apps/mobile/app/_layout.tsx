import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import * as Linking from 'expo-linking';
import { AuthProvider } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
    // Handle deep links for password reset
    useEffect(() => {
        const handleDeepLink = async (event: { url: string }) => {
            const url = event.url;
            console.log('[DeepLink] Received:', url);

            // Check if it's a password reset link
            if (url.includes('type=recovery') || url.includes('access_token')) {
                // Navigate to reset password screen
                // Note: supabase automatically handles the session update if the link is valid
                router.replace('/(auth)/reset-password');
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink({ url });
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Also handle Supabase auth URL events explicitly
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                router.replace('/(auth)/reset-password');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
            <Toast />
        </AuthProvider>
    );
}
