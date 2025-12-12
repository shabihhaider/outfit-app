import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { SafeView } from '../../../components/SafeView';
import { AuthInput, AuthButton } from '../../../components/auth';
import { AvatarPicker } from '../../../components/profile';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile, ProfileUpdate } from '../../../hooks/useProfile';
import { uploadAvatar } from '../../../lib/storage';
import { profileSchema, ProfileFormData } from '../../../utils/validation';

export default function EditProfileScreen() {
    const { user } = useAuth();
    const { profile, isLoading, updateProfile, refetch } = useProfile();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, touchedFields, isDirty },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: '',
            full_name: '',
            bio: '',
        },
        mode: 'onBlur',
    });

    // Populate form when profile loads
    useEffect(() => {
        if (profile) {
            reset({
                username: profile.username || '',
                full_name: profile.full_name || '',
                bio: profile.bio || '',
            });
            setLocalAvatarUrl(profile.avatar_url);
        }
    }, [profile, reset]);

    const handleAvatarSelected = async (uri: string) => {
        if (!user?.id) return;

        setIsUploadingAvatar(true);
        setLocalAvatarUrl(uri); // Show preview immediately

        const result = await uploadAvatar(user.id, uri);

        if (result.success && result.url) {
            // Update profile with new avatar URL
            const updateResult = await updateProfile({ avatar_url: result.url });

            if (updateResult.success) {
                setLocalAvatarUrl(result.url);
                Toast.show({
                    type: 'success',
                    text1: 'Avatar Updated',
                    text2: 'Your profile photo has been changed.',
                });
            } else {
                // Revert to old avatar on failure
                setLocalAvatarUrl(profile?.avatar_url || null);
                Toast.show({
                    type: 'error',
                    text1: 'Upload Failed',
                    text2: updateResult.error || 'Could not save avatar.',
                });
            }
        } else {
            setLocalAvatarUrl(profile?.avatar_url || null);
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
                text2: result.error || 'Could not upload image.',
            });
        }

        setIsUploadingAvatar(false);
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);

        const updates: ProfileUpdate = {};

        // Only include changed fields
        if (data.username !== profile?.username) {
            updates.username = data.username || undefined;
        }
        if (data.full_name !== profile?.full_name) {
            updates.full_name = data.full_name || undefined;
        }
        if (data.bio !== profile?.bio) {
            updates.bio = data.bio || undefined;
        }

        // If nothing changed, just go back
        if (Object.keys(updates).length === 0) {
            router.back();
            return;
        }

        const result = await updateProfile(updates);

        if (result.success) {
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your changes have been saved.',
            });
            router.back();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: result.error || 'Could not save changes.',
            });
        }

        setIsSaving(false);
    };

    const handleCancel = () => {
        if (isDirty) {
            // Could show confirmation dialog here
        }
        router.back();
    };

    const displayName = profile?.full_name || profile?.username || 'User';

    return (
        <SafeView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={handleCancel} hitSlop={8}>
                        <Ionicons name="close" size={28} color="#1e3a5f" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Picker */}
                    <View style={styles.avatarSection}>
                        <AvatarPicker
                            currentUrl={localAvatarUrl}
                            name={displayName}
                            onImageSelected={handleAvatarSelected}
                            uploading={isUploadingAvatar}
                            size={120}
                        />
                        <Text style={styles.avatarHint}>Tap to change photo</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AuthInput
                                    label="Username"
                                    placeholder="Enter username"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.username?.message}
                                    touched={touchedFields.username}
                                    editable={!isSaving}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="full_name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AuthInput
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    autoCapitalize="words"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.full_name?.message}
                                    touched={touchedFields.full_name}
                                    editable={!isSaving}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="bio"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <AuthInput
                                    label="Bio"
                                    placeholder="Tell us about yourself"
                                    multiline
                                    numberOfLines={3}
                                    style={styles.bioInput}
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.bio?.message}
                                    touched={touchedFields.bio}
                                    editable={!isSaving}
                                />
                            )}
                        />

                        <View style={styles.infoBox}>
                            <Ionicons name="mail-outline" size={16} color="#6b7280" />
                            <Text style={styles.infoText}>
                                Email: {user?.email}
                            </Text>
                        </View>
                        <Text style={styles.infoHint}>
                            Email cannot be changed here. Contact support if needed.
                        </Text>
                    </View>

                    {/* Save Button */}
                    <View style={styles.buttonContainer}>
                        <AuthButton
                            title="Save Changes"
                            onPress={handleSubmit(onSubmit)}
                            loading={isSaving}
                            disabled={!isDirty && !isUploadingAvatar}
                        />
                        <AuthButton
                            title="Cancel"
                            onPress={handleCancel}
                            variant="outline"
                            disabled={isSaving}
                            style={styles.cancelButton}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a5f',
    },
    scrollContent: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarHint: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
    },
    form: {
        marginBottom: 24,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#374151',
    },
    infoHint: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
        marginLeft: 4,
    },
    buttonContainer: {
        gap: 12,
    },
    cancelButton: {
        marginTop: 0,
    },
});
