import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerificationBannerProps {
    email: string;
    onResend?: () => void;
    onDismiss?: () => void;
}

export function VerificationBanner({
    email,
    onResend,
    onDismiss,
}: VerificationBannerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="mail-outline" size={20} color="#d97706" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Verify your email</Text>
                    <Text style={styles.message}>
                        We sent a verification link to {email}
                    </Text>
                </View>
            </View>
            <View style={styles.actions}>
                {onResend && (
                    <Pressable onPress={onResend} hitSlop={8}>
                        <Text style={styles.resendText}>Resend</Text>
                    </Pressable>
                )}
                {onDismiss && (
                    <Pressable onPress={onDismiss} hitSlop={8}>
                        <Ionicons name="close" size={20} color="#6b7280" />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fef3c7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#fcd34d',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    textContainer: {
        marginLeft: 12,
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400e',
    },
    message: {
        fontSize: 12,
        color: '#a16207',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#d97706',
    },
});

export default VerificationBanner;
