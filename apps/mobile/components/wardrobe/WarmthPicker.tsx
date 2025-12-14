import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WarmthLevel } from '../../types/wardrobe';
import { WARMTH_LEVELS } from '../../constants/categories';

interface WarmthPickerProps {
    value: WarmthLevel | null;
    onChange: (value: WarmthLevel) => void;
    error?: string;
    disabled?: boolean;
}

export function WarmthPicker({
    value,
    onChange,
    error,
    disabled = false,
}: WarmthPickerProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Warmth Level</Text>
            <Text style={styles.hint}>How warm is this item?</Text>

            <View style={styles.optionsContainer}>
                {WARMTH_LEVELS.map((level) => (
                    <Pressable
                        key={level.value}
                        style={[
                            styles.option,
                            value === level.value && styles.optionSelected,
                            disabled && styles.optionDisabled,
                        ]}
                        onPress={() => onChange(level.value)}
                        disabled={disabled}
                    >
                        <Text style={styles.optionIcon}>{level.icon}</Text>
                        <Text
                            style={[
                                styles.optionLabel,
                                value === level.value && styles.optionLabelSelected,
                            ]}
                        >
                            {level.label}
                        </Text>
                        <Text style={styles.optionTemp}>{level.tempRange}</Text>
                    </Pressable>
                ))}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
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
        marginBottom: 4,
    },
    hint: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
    },
    optionsContainer: {
        gap: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
    },
    optionSelected: {
        backgroundColor: '#e0f2fe',
        borderColor: '#1e3a5f',
    },
    optionDisabled: {
        opacity: 0.5,
    },
    optionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    optionLabel: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
        flex: 1,
    },
    optionLabelSelected: {
        color: '#1e3a5f',
    },
    optionTemp: {
        fontSize: 12,
        color: '#6b7280',
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
    },
});

export default WarmthPicker;
