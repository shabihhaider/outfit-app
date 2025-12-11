import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../contexts/AuthContext';
import { signUpSchema, SignUpFormData } from '../../utils/validation';
import { AuthInput, PasswordInput, AuthButton, Checkbox } from '../../components/auth';
import { SafeView } from '../../components/SafeView';

export default function RegisterScreen() {
    const { signUp, isLoading, clearError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs for input focus management
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, touchedFields },
        setError,
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false as any,
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            setIsSubmitting(true);
            clearError();

            const result = await signUp(data.email, data.password);

            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Account Created!',
                    text2: result.error || 'Welcome to Outfit App!',
                    visibilityTime: 3000,
                });
                // If email verification required, result.error contains the message
                // Navigation handled by auth state change if auto-confirmed
            } else {
                // Handle specific errors
                if (result.error?.toLowerCase().includes('email')) {
                    setError('email', { message: result.error });
                } else if (result.error?.toLowerCase().includes('password')) {
                    setError('password', { message: result.error });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Registration Failed',
                        text2: result.error || 'Please try again.',
                        visibilityTime: 4000,
                    });
                }
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

    const isButtonLoading = isLoading || isSubmitting;

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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join Outfit App and organize your wardrobe
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
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                    blurOnSubmit={false}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.email?.message}
                                    touched={touchedFields.email}
                                    editable={!isButtonLoading}
                                />
                            )}
                        />

                        {/* Password Input */}
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PasswordInput
                                    ref={passwordRef}
                                    label="Password"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                    blurOnSubmit={false}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.password?.message}
                                    touched={touchedFields.password}
                                    editable={!isButtonLoading}
                                />
                            )}
                        />

                        {/* Password Requirements Hint */}
                        <View style={styles.passwordHint}>
                            <Text style={styles.passwordHintText}>
                                Password must be at least 8 characters with uppercase, lowercase, and number
                            </Text>
                        </View>

                        {/* Confirm Password Input */}
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PasswordInput
                                    ref={confirmPasswordRef}
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    returnKeyType="done"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.confirmPassword?.message}
                                    touched={touchedFields.confirmPassword}
                                    editable={!isButtonLoading}
                                />
                            )}
                        />

                        {/* Terms Checkbox */}
                        <Controller
                            control={control}
                            name="acceptTerms"
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    checked={value}
                                    onChange={onChange}
                                    label={
                                        <Text>
                                            I agree to the{' '}
                                            <Text style={styles.linkText}>Terms of Service</Text>
                                            {' '}and{' '}
                                            <Text style={styles.linkText}>Privacy Policy</Text>
                                        </Text>
                                    }
                                    error={errors.acceptTerms?.message}
                                    touched={touchedFields.acceptTerms}
                                />
                            )}
                        />

                        {/* Sign Up Button */}
                        <AuthButton
                            title="Create Account"
                            onPress={handleSubmit(onSubmit)}
                            loading={isButtonLoading}
                            style={styles.submitButton}
                        />

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
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
        paddingTop: 40,
        paddingBottom: 24,
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
    passwordHint: {
        marginTop: -12,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    passwordHintText: {
        fontSize: 12,
        color: '#9ca3af',
        lineHeight: 16,
    },
    linkText: {
        color: '#3b82f6',
        fontWeight: '500',
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
});
