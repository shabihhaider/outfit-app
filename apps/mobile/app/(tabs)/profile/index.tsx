import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { SafeView } from '../../../components/SafeView';
import { Avatar } from '../../../components/profile';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../hooks/useProfile';
import { useEmailVerification } from '../../../hooks/useSupabaseAuth';
import { VerificationBanner } from '../../../components/common/VerificationBanner';

export default function ProfileScreen() {
    const { user, signOut, isLoading: authLoading } = useAuth();
    const { profile, isLoading: profileLoading, refetch } = useProfile();
    const { isVerified, resendVerification } = useEmailVerification();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);

    const isLoading = authLoading || profileLoading;

    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleResendVerification = async () => {
        const success = await resendVerification();
        if (success) {
            Toast.show({
                type: 'success',
                text1: 'Email Sent',
                text2: 'Check your inbox for verification link.',
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Could not send verification email.',
            });
        }
    };

    const handleEditProfile = () => {
        router.push('/(tabs)/profile/edit');
    };

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        setIsSigningOut(true);
                        const result = await signOut();
                        if (result.success) {
                            Toast.show({
                                type: 'success',
                                text1: 'Signed Out',
                                text2: 'See you next time!',
                            });
                            setIsSigningOut(false);
                            router.replace('/(auth)/welcome');
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: result.error || 'Failed to sign out',
                            });
                            setIsSigningOut(false);
                        }
                    },
                },
            ]
        );
    };

    if (isLoading && !profile) {
        return (
            <SafeView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1e3a5f" />
                </View>
            </SafeView>
        );
    }

    const displayName = profile?.full_name || profile?.username || 'User';

    return (
        <SafeView style={styles.container}>
            {!isVerified && !bannerDismissed && user?.email && (
                <VerificationBanner
                    email={user.email}
                    onResend={handleResendVerification}
                    onDismiss={() => setBannerDismissed(true)}
                />
            )}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#1e3a5f"
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <Pressable onPress={handleEditProfile} hitSlop={8}>
                        <Ionicons name="create-outline" size={24} color="#1e3a5f" />
                    </Pressable>
                </View>

                {/* Avatar & Name */}
                <View style={styles.profileSection}>
                    <Avatar
                        url={profile?.avatar_url}
                        name={displayName}
                        size={100}
                    />
                    <Text style={styles.displayName}>{displayName}</Text>
                    {profile?.username && profile.username !== displayName && (
                        <Text style={styles.username}>@{profile.username}</Text>
                    )}
                    {profile?.bio && (
                        <Text style={styles.bio}>{profile.bio}</Text>
                    )}
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#6b7280" />
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={20} color="#6b7280" />
                        <Text style={styles.infoLabel}>Username</Text>
                        <Text style={styles.infoValue}>{profile?.username || 'Not set'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                        <Text style={styles.infoLabel}>Joined</Text>
                        <Text style={styles.infoValue}>
                            {profile?.created_at
                                ? new Date(profile.created_at).toLocaleDateString()
                                : 'Unknown'}
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsSection}>
                    <Pressable
                        style={styles.editButton}
                        onPress={handleEditProfile}
                    >
                        <Ionicons name="create-outline" size={20} color="#1e3a5f" />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </Pressable>

                    <Pressable
                        style={styles.signOutButton}
                        onPress={handleSignOut}
                        disabled={isSigningOut}
                    >
                        {isSigningOut ? (
                            <ActivityIndicator size="small" color="#ef4444" />
                        ) : (
                            <>
                                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                                <Text style={styles.signOutButtonText}>Sign Out</Text>
                            </>
                        )}
                    </Pressable>
                </View>

                {/* Version */}
                <Text style={styles.version}>Outfit App v1.0.0</Text>
            </ScrollView>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e3a5f',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    displayName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
    },
    username: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    bio: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    infoSection: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9ca3af',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    infoLabel: {
        fontSize: 16,
        color: '#374151',
        marginLeft: 12,
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        color: '#6b7280',
    },
    actionsSection: {
        gap: 12,
        marginBottom: 24,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
    },
    editButtonText: {
        fontSize: 16,
        color: '#1e3a5f',
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    signOutButtonText: {
        fontSize: 16,
        color: '#ef4444',
        fontWeight: '500',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9ca3af',
    },
});
