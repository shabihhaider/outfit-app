import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';

import { SafeView } from '../../components/SafeView';
import { PasswordInput, AuthButton } from '../../components/auth';
import { useAuth } from '../../contexts/AuthContext';
import { resetPasswordSchema, ResetPasswordFormData } from '../../utils/validation';

export default function ResetPasswordScreen() {
    const { updatePassword, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // params might contain token info if handling manually, but usually handled by supbase auth state
    const params = useLocalSearchParams();

    const {
        control,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            setIsSubmitting(true);

            const result = await updatePassword(data.password);

            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Password Updated',
                    text2: 'You can now sign in with your new password.',
                    visibilityTime: 4000,
                });
                router.replace('/(auth)/login');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                    text2: result.error || 'Could not update password.',
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
                        <Text style={styles.title}>Set New Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your new password below. Make sure it's secure!
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PasswordInput
                                    label="New Password"
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    returnKeyType="next"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.password?.message}
                                    touched={touchedFields.password}
                                    editable={!isButtonLoading}
                                />
                            )}
                        />

                        <View style={styles.passwordHint}>
                            <Text style={styles.passwordHintText}>
                                Password must be at least 8 characters with uppercase, lowercase, and number
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PasswordInput
                                    label="Confirm Password"
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.confirmPassword?.message}
                                    touched={touchedFields.confirmPassword}
                                    editable={!isButtonLoading}
                                />
                            )}
                        />

                        <AuthButton
                            title="Update Password"
                            onPress={handleSubmit(onSubmit)}
                            loading={isButtonLoading}
                            style={styles.submitButton}
                        />
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
        paddingTop: 60,
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
    submitButton: {
        marginTop: 16,
    },
});
