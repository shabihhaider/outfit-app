import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getColorInfo } from '../../constants/categories';

interface ColorPickerProps {
    value: string | null;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

export function ColorPicker({
    value,
    onChange,
    label = 'Primary Color',
    placeholder = 'Select color',
    error,
    disabled = false,
}: ColorPickerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const colorInfo = value ? getColorInfo(value) : null;

    const handleSelect = (colorValue: string) => {
        onChange(colorValue);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Pressable
                style={[
                    styles.selector,
                    error && styles.selectorError,
                    disabled && styles.selectorDisabled,
                ]}
                onPress={() => setModalVisible(true)}
                disabled={disabled}
            >
                <View style={styles.selectorContent}>
                    {colorInfo && (
                        <View
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: colorInfo.hex === '#RAINBOW' ? '#ccc' : colorInfo.hex },
                                colorInfo.hex === '#FFFFFF' && styles.whiteSwatch,
                            ]}
                        >
                            {colorInfo.hex === '#RAINBOW' && (
                                <Text style={styles.rainbowText}>🌈</Text>
                            )}
                        </View>
                    )}
                    <Text
                        style={[
                            styles.selectorText,
                            !value && styles.placeholderText,
                        ]}
                    >
                        {colorInfo?.label || placeholder}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </Pressable>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Color</Text>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6b7280" />
                            </Pressable>
                        </View>

                        <ScrollView contentContainerStyle={styles.colorGrid}>
                            {COLORS.map((color) => (
                                <Pressable
                                    key={color.value}
                                    style={[
                                        styles.colorOption,
                                        value === color.value && styles.colorOptionSelected,
                                    ]}
                                    onPress={() => handleSelect(color.value)}
                                >
                                    <View
                                        style={[
                                            styles.colorOptionSwatch,
                                            { backgroundColor: color.hex === '#RAINBOW' ? '#ccc' : color.hex },
                                            color.hex === '#FFFFFF' && styles.whiteSwatch,
                                        ]}
                                    >
                                        {color.hex === '#RAINBOW' && (
                                            <Text style={styles.rainbowText}>🌈</Text>
                                        )}
                                        {value === color.value && (
                                            <Ionicons
                                                name="checkmark"
                                                size={20}
                                                color={color.hex === '#FFFFFF' || color.hex === '#FFFF00' ? '#000' : '#fff'}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.colorOptionLabel}>{color.label}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    selectorError: {
        borderColor: '#ef4444',
    },
    selectorDisabled: {
        opacity: 0.5,
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    whiteSwatch: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    rainbowText: {
        fontSize: 14,
    },
    selectorText: {
        fontSize: 16,
        color: '#111827',
    },
    placeholderText: {
        color: '#9ca3af',
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
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
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 12,
    },
    colorOption: {
        alignItems: 'center',
        width: '22%',
        marginBottom: 8,
    },
    colorOptionSelected: {
        // Selected state handled by checkmark
    },
    colorOptionSwatch: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    colorOptionLabel: {
        fontSize: 11,
        color: '#374151',
        textAlign: 'center',
    },
});

export default ColorPicker;
