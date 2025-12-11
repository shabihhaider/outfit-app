import { View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { SafeView } from "../../components/SafeView";

export default function WelcomeScreen() {
    return (
        <SafeView style={styles.container}>
            <View style={styles.content}>
                {/* Logo Placeholder */}
                <View style={styles.logo}>
                    <Text style={styles.logoText}>👗</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>
                    Outfit App
                </Text>
                <Text style={styles.subtitle}>
                    Your AI-powered wardrobe assistant
                </Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push("/(auth)/register")}
                    >
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text style={styles.secondaryButtonText}>I already have an account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e3a5f', // primary-950
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logo: {
        width: 96,
        height: 96,
        backgroundColor: '#3b82f6', // primary-500
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    logoText: {
        color: '#ffffff',
        fontSize: 36,
    },
    title: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#bfdbfe', // primary-200
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 48,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#3b82f6', // primary-500
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
    secondaryButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#60a5fa', // primary-400
        paddingVertical: 16,
        borderRadius: 12,
    },
    secondaryButtonText: {
        color: '#bfdbfe', // primary-200
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
});
