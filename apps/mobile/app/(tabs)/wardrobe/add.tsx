import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { SafeView } from '../../../components/SafeView';
import { AuthButton } from '../../../components/auth';
import { ImageCapture, ItemForm, ItemFormData } from '../../../components/wardrobe';
import { useWardrobe } from '../../../hooks/useWardrobe';
import { useAuth } from '../../../contexts/AuthContext';
import { uploadWardrobeImage } from '../../../lib/wardrobe-storage';

const initialFormData: ItemFormData = {
    name: '',
    category: null,
    subcategory: null,
    primary_color: null,
    secondary_color: null,
    warmth_level: null,
    weather_resistance: null,
    notes: '',
};

export default function AddItemScreen() {
    const { user } = useAuth();
    const { addItem } = useWardrobe();

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [formData, setFormData] = useState<ItemFormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof ItemFormData, string>>>({});
    const [isSaving, setIsSaving] = useState(false);

    const handleFormChange = (updates: Partial<ItemFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
        // Clear errors for changed fields
        const clearedErrors = { ...errors };
        Object.keys(updates).forEach((key) => {
            delete clearedErrors[key as keyof ItemFormData];
        });
        setErrors(clearedErrors);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ItemFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Item name is required';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all required fields.',
            });
            return;
        }

        if (!user?.id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'You must be logged in to add items.',
            });
            return;
        }

        setIsSaving(true);

        try {
            let imageUrl: string | undefined;

            // Upload image if selected
            if (imageUri) {
                const uploadResult = await uploadWardrobeImage(user.id, imageUri);
                if (uploadResult.success) {
                    imageUrl = uploadResult.imageUrl;
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Image Upload Failed',
                        text2: uploadResult.error || 'Could not upload image.',
                    });
                    setIsSaving(false);
                    return;
                }
            }

            // Add item to database
            const result = await addItem({
                name: formData.name.trim(),
                category: formData.category!,
                subcategory: formData.subcategory || undefined,
                primary_color: formData.primary_color || undefined,
                secondary_color: formData.secondary_color || undefined,
                warmth_level: formData.warmth_level || undefined,
                weather_resistance: formData.weather_resistance || undefined,
                notes: formData.notes.trim() || undefined,
                image_url: imageUrl,
                // Manual entry metadata
                classification_source: 'manual',
                ai_confidence: 1.0,
            });

            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Item Added!',
                    text2: `${formData.name} has been added to your wardrobe.`,
                });
                router.back();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to Add Item',
                    text2: result.error || 'Something went wrong.',
                });
            }
        } catch (error) {
            console.error('[AddItem] Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (imageUri || formData.name || formData.category) {
            Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to go back?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: () => router.back() },
                ]
            );
        } else {
            router.back();
        }
    };

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
                    <Text style={styles.headerTitle}>Add Item</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image Capture */}
                    <ImageCapture
                        imageUri={imageUri}
                        onImageSelected={setImageUri}
                        onImageRemove={() => setImageUri(null)}
                        disabled={isSaving}
                    />

                    {/* Form */}
                    <ItemForm
                        data={formData}
                        onChange={handleFormChange}
                        errors={errors}
                        disabled={isSaving}
                    />

                    {/* Save Button */}
                    <View style={styles.buttonContainer}>
                        <AuthButton
                            title="Add to Wardrobe"
                            onPress={handleSave}
                            loading={isSaving}
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
        paddingBottom: 40,
    },
    buttonContainer: {
        marginTop: 24,
    },
});
