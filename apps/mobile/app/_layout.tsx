import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
    const { isLoading } = useAuth();

    useEffect(() => {
        // Hide splash screen after auth state is loaded
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    return (
        <>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <Toast />
        </>
    );
}

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <RootLayoutContent />
            </AuthProvider>
        </ErrorBoundary>
    );
}
