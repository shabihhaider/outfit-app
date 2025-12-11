import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Navigation component that handles auth-based routing
 */
function RootNavigator() {
    const { isLoading } = useAuth();

    useEffect(() => {
        // Hide splash screen once auth state is determined
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    // Show loading screen while checking auth
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e3a5f" />
            </View>
        );
    }

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                {/* Auth screens - shown when not authenticated */}
                <Stack.Screen
                    name="(auth)"
                    options={{
                        headerShown: false,
                        // Prevent going back to auth screens after login
                        gestureEnabled: false,
                    }}
                />

                {/* Main app screens - shown when authenticated */}
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                        // Prevent going back to auth screens
                        gestureEnabled: false,
                    }}
                />

                {/* Index handles redirect logic */}
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>
            <StatusBar style="auto" />
        </>
    );
}

/**
 * Root Layout Component
 * Provides auth context and error handling to entire app
 */
export default function RootLayout() {
    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <AuthProvider>
                    <RootNavigator />
                    <Toast />
                </AuthProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});
