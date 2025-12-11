import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '../contexts/AuthContext';

/**
 * Index screen - handles initial routing based on auth state
 * Redirects to:
 * - (auth)/welcome if not authenticated
 * - (tabs) if authenticated
 */
export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading while determining auth state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#1e3a5f" />
            </View>
        );
    }

    // Redirect based on authentication status
    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});
