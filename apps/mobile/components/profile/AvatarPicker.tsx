import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';

interface AvatarPickerProps {
    currentUrl?: string | null;
    name?: string | null;
    onImageSelected: (uri: string) => void;
    uploading?: boolean;
    size?: number;
}

export function AvatarPicker({
    currentUrl,
    name,
    onImageSelected,
    uploading = false,
    size = 120,
}: AvatarPickerProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const requestPermission = async (
        type: 'camera' | 'gallery'
    ): Promise<boolean> => {
        if (type === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            return status === 'granted';
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            return status === 'granted';
        }
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        setModalVisible(false);

        const hasPermission = await requestPermission(source);
        if (!hasPermission) {
            // Could show alert here
            console.log('[AvatarPicker] Permission denied for', source);
            return;
        }

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        };

        let result;
        if (source === 'camera') {
            result = await ImagePicker.launchCameraAsync(options);
        } else {
            result = await ImagePicker.launchImageLibraryAsync(options);
        }

        if (!result.canceled && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => setModalVisible(true)}
                disabled={uploading}
                style={styles.avatarButton}
            >
                <Avatar url={currentUrl} name={name} size={size} />

                {/* Edit overlay */}
                <View style={[styles.editBadge, { right: size * 0.05, bottom: size * 0.05 }]}>
                    {uploading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Ionicons name="camera" size={16} color="#ffffff" />
                    )}
                </View>
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
                        <Text style={styles.modalTitle}>Change Photo</Text>

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
        alignItems: 'center',
    },
    avatarButton: {
        position: 'relative',
    },
    editBadge: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1e3a5f',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
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
        paddingBottom: 40,
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

export default AvatarPicker;
