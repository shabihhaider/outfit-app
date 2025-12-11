import { Redirect } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
    const { user, isLoading } = useAuth();

    // Show loading screen while checking auth state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    // Redirect based on authentication status
    if (user) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
});
