import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../utils/validation';
import { AuthInput, AuthButton } from '../../components/auth';
import { SafeView } from '../../components/SafeView';

export default function ForgotPasswordScreen() {
    const { resetPassword, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, touchedFields },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setIsSubmitting(true);

            const result = await resetPassword(data.email);

            if (result.success) {
                setIsEmailSent(true);
                Toast.show({
                    type: 'success',
                    text1: 'Email Sent',
                    text2: 'Check your inbox for reset instructions.',
                    visibilityTime: 4000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to Send Email',
                    text2: result.error || 'Please try again.',
                    visibilityTime: 4000,
                });
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred.',
                visibilityTime: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = () => {
        setIsEmailSent(false);
    };

    const isButtonLoading = isLoading || isSubmitting;

    // Success State
    if (isEmailSent) {
        return (
            <SafeView style={styles.container}>
                <View style={styles.successContainer}>
                    <View style={styles.successIconContainer}>
                        <Ionicons name="mail-outline" size={64} color="#1e3a5f" />
                    </View>
                    <Text style={styles.successTitle}>Check Your Email</Text>
                    <Text style={styles.successMessage}>
                        We've sent password reset instructions to{'\n'}
                        <Text style={styles.emailText}>{getValues('email')}</Text>
                    </Text>
                    <Text style={styles.successHint}>
                        Didn't receive the email? Check your spam folder or try again.
                    </Text>

                    <AuthButton
                        title="Resend Email"
                        onPress={handleResend}
                        variant="outline"
                        style={styles.resendButton}
                    />

                    <Link href="/(auth)/login" asChild>
                        <Pressable style={styles.backToLogin}>
                            <Text style={styles.backToLoginText}>Back to Sign In</Text>
                        </Pressable>
                    </Link>
                </View>
            </SafeView>
        );
    }

    // Form State
    return (
        <SafeView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1e3a5f" />
                    </Pressable>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email address and we'll send you instructions to reset your password.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Email Input */}
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AuthInput
                                    label="Email"
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.email?.message}
                                    touched={touchedFields.email}
                                    editable={!isButtonLoading}
                                />
                            )}
                        />

                        {/* Submit Button */}
                        <AuthButton
                            title="Send Reset Link"
                            onPress={handleSubmit(onSubmit)}
                            loading={isButtonLoading}
                            style={styles.submitButton}
                        />

                        {/* Back to Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Remember your password? </Text>
                            <Link href="/(auth)/login" asChild>
                                <Pressable disabled={isButtonLoading}>
                                    <Text style={styles.loginLink}>Sign In</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        lineHeight: 24,
    },
    form: {
        flex: 1,
    },
    submitButton: {
        marginTop: 8,
        marginBottom: 24,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#6b7280',
    },
    loginLink: {
        fontSize: 14,
        color: '#1e3a5f',
        fontWeight: '600',
    },
    // Success state styles
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    successIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f9ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
    },
    emailText: {
        fontWeight: '600',
        color: '#1e3a5f',
    },
    successHint: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: 32,
    },
    resendButton: {
        width: '100%',
        marginBottom: 16,
    },
    backToLogin: {
        paddingVertical: 12,
    },
    backToLoginText: {
        fontSize: 14,
        color: '#1e3a5f',
        fontWeight: '600',
    },
});
