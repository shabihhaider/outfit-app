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
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../contexts/AuthContext';
import { signInSchema, SignInFormData } from '../../utils/validation';
import { AuthInput, PasswordInput, AuthButton } from '../../components/auth';
import { SafeView } from '../../components/SafeView';

export default function LoginScreen() {
    const { signIn, isLoading, clearError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs for input focus management
    const passwordRef = useRef<TextInput>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            setIsSubmitting(true);
            clearError();

            const result = await signIn(data.email, data.password);

            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Welcome back!',
                    text2: 'You have successfully signed in.',
                    visibilityTime: 2000,
                });
                // Navigation is handled automatically by auth state change
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Sign In Failed',
                    text2: result.error || 'Please check your credentials.',
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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>
                            Sign in to continue to your wardrobe
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
                                    placeholder="Enter your password"
                                    autoComplete="password"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.password?.message}
                                    touched={touchedFields.password}
                                    editable={!isButtonLoading}
                                />
                            )}
                        />

                        {/* Forgot Password Link */}
                        <View style={styles.forgotPasswordContainer}>
                            <Link href="/(auth)/forgot-password" asChild>
                                <Pressable disabled={isButtonLoading}>
                                    <Text style={styles.forgotPasswordText}>
                                        Forgot your password?
                                    </Text>
                                </Pressable>
                            </Link>
                        </View>

                        {/* Sign In Button */}
                        <AuthButton
                            title="Sign In"
                            onPress={handleSubmit(onSubmit)}
                            loading={isButtonLoading}
                            style={styles.submitButton}
                        />

                        {/* Register Link */}
                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <Link href="/(auth)/register" asChild>
                                <Pressable disabled={isButtonLoading}>
                                    <Text style={styles.registerLink}>Sign Up</Text>
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
        marginBottom: 40,
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
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
        marginTop: -8,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
    },
    submitButton: {
        marginBottom: 24,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        color: '#6b7280',
    },
    registerLink: {
        fontSize: 14,
        color: '#1e3a5f',
        fontWeight: '600',
    },
});
