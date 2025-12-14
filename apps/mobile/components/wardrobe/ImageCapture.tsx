import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Modal,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

interface ImageCaptureProps {
    imageUri: string | null;
    onImageSelected: (uri: string) => void;
    onImageRemove: () => void;
    disabled?: boolean;
}

export function ImageCapture({
    imageUri,
    onImageSelected,
    onImageRemove,
    disabled = false,
}: ImageCaptureProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [processing, setProcessing] = useState(false);

    const requestPermission = async (type: 'camera' | 'gallery'): Promise<boolean> => {
        if (type === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            return status === 'granted';
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            return status === 'granted';
        }
    };

    const processImage = async (uri: string): Promise<string> => {
        // Resize image to max 1024px and compress
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1024 } }],
            {
                compress: 0.8,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return result.uri;
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        setModalVisible(false);

        const hasPermission = await requestPermission(source);
        if (!hasPermission) {
            console.log('[ImageCapture] Permission denied for', source);
            return;
        }

        // Define common options for image picking
        const commonOptions: ImagePicker.ImagePickerOptions = {
            allowsEditing: true,
            aspect: [1, 1], // Square aspect ratio for wardrobe items
            quality: 0.8,
        };

        setProcessing(true);

        try {
            let result;
            if (source === 'camera') {
                result = await ImagePicker.launchCameraAsync(commonOptions);
            } else {
                result = await ImagePicker.launchImageLibraryAsync(commonOptions);
            }

            if (!result.canceled && result.assets[0]) {
                const processedUri = await processImage(result.assets[0].uri);
                onImageSelected(processedUri);
            }
        } catch (error) {
            console.error('[ImageCapture] Error:', error);
        } finally {
            setProcessing(false);
        }
    };

    if (processing) {
        return (
            <View style={styles.container}>
                <View style={styles.processingContainer}>
                    <ActivityIndicator size="large" color="#1e3a5f" />
                    <Text style={styles.processingText}>Processing image...</Text>
                </View>
            </View>
        );
    }

    if (imageUri) {
        return (
            <View style={styles.container}>
                <View style={styles.previewContainer}>
                    <Image source={{ uri: imageUri }} style={styles.preview} />
                    <Pressable
                        style={styles.removeButton}
                        onPress={onImageRemove}
                        disabled={disabled}
                    >
                        <Ionicons name="close-circle" size={32} color="#ef4444" />
                    </Pressable>
                    <Pressable
                        style={styles.changeButton}
                        onPress={() => setModalVisible(true)}
                        disabled={disabled}
                    >
                        <Ionicons name="camera" size={20} color="#ffffff" />
                        <Text style={styles.changeButtonText}>Change</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.placeholderContainer}
                onPress={() => setModalVisible(true)}
                disabled={disabled}
            >
                <View style={styles.iconCircle}>
                    <Ionicons name="camera-outline" size={48} color="#9ca3af" />
                </View>
                <Text style={styles.placeholderTitle}>Add Photo</Text>
                <Text style={styles.placeholderSubtitle}>
                    Take a photo or choose from gallery
                </Text>
            </Pressable>

            {/* Selection Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Photo</Text>

                        <Pressable
                            style={styles.modalOption}
                            onPress={() => pickImage('camera')}
                        >
                            <Ionicons name="camera-outline" size={24} color="#1e3a5f" />
                            <Text style={styles.modalOptionText}>Take Photo</Text>
                        </Pressable>

                        <Pressable
                            style={styles.modalOption}
                            onPress={() => pickImage('gallery')}
                        >
                            <Ionicons name="images-outline" size={24} color="#1e3a5f" />
                            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalOption, styles.cancelOption]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    placeholderContainer: {
        height: 200,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    placeholderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    placeholderSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    previewContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    preview: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: '#e5e7eb',
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    changeButton: {
        position: 'absolute',
        bottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    changeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    processingContainer: {
        height: 200,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    processingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6b7280',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40, // Extra padding for SafeArea on iOS usually handled by View but good here
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        marginBottom: 12,
    },
    modalOptionText: {
        fontSize: 16,
        color: '#1e3a5f',
        marginLeft: 12,
        fontWeight: '500',
    },
    cancelOption: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginTop: 8,
    },
    cancelText: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '500',
    },
});

export default ImageCapture;
