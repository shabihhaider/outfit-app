import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { AuthInput } from '../auth';
import { CategoryPicker } from './CategoryPicker';
import { ColorPicker } from './ColorPicker';
import { WarmthPicker } from './WarmthPicker';
import { ItemCategory, WarmthLevel, WeatherResistance } from '../../types/wardrobe';

export interface ItemFormData {
    name: string;
    category: ItemCategory | null;
    subcategory: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    warmth_level: WarmthLevel | null;
    weather_resistance: WeatherResistance | null;
    notes: string;
}

interface ItemFormProps {
    data: ItemFormData;
    onChange: (data: Partial<ItemFormData>) => void;
    errors?: Partial<Record<keyof ItemFormData, string>>;
    disabled?: boolean;
}

export function ItemForm({
    data,
    onChange,
    errors = {},
    disabled = false,
}: ItemFormProps) {
    return (
        <View style={styles.container}>
            <AuthInput
                label="Item Name *"
                placeholder="e.g., Blue Oxford Shirt"
                value={data.name}
                onChangeText={(name) => onChange({ name })}
                error={errors.name}
                editable={!disabled}
            />

            <CategoryPicker
                category={data.category}
                subcategory={data.subcategory}
                onCategoryChange={(category) => onChange({ category })}
                onSubcategoryChange={(subcategory) => onChange({ subcategory })}
                error={errors.category}
                disabled={disabled}
            />

            <View style={styles.colorRow}>
                <View style={styles.colorHalf}>
                    <ColorPicker
                        label="Primary Color"
                        value={data.primary_color}
                        onChange={(primary_color) => onChange({ primary_color })}
                        error={errors.primary_color}
                        disabled={disabled}
                    />
                </View>
                <View style={styles.colorHalf}>
                    <ColorPicker
                        label="Secondary Color"
                        value={data.secondary_color}
                        onChange={(secondary_color) => onChange({ secondary_color })}
                        placeholder="Optional"
                        disabled={disabled}
                    />
                </View>
            </View>

            <WarmthPicker
                value={data.warmth_level}
                onChange={(warmth_level) => onChange({ warmth_level })}
                error={errors.warmth_level}
                disabled={disabled}
            />

            {/* NEW: Weather Resistance Picker */}
            <View style={styles.section}>
                <Text style={styles.label}>Weather Resistance</Text>
                <View style={styles.resistanceRow}>
                    {['none', 'water_resistant', 'waterproof'].map((res) => (
                        <Pressable
                            key={res}
                            style={[
                                styles.resistanceOption,
                                data.weather_resistance === res && styles.resistanceOptionSelected,
                                disabled && styles.disabledOption
                            ]}
                            onPress={() => onChange({ weather_resistance: res as WeatherResistance })}
                            disabled={disabled}
                        >
                            <Text style={[
                                styles.resistanceText,
                                data.weather_resistance === res && styles.resistanceTextSelected
                            ]}>
                                {res.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <AuthInput
                label="Notes"
                placeholder="Any additional details..."
                value={data.notes}
                onChangeText={(notes) => onChange({ notes })}
                multiline
                numberOfLines={3}
                style={styles.notesInput}
                editable={!disabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Container styles
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    colorRow: {
        flexDirection: 'row',
        gap: 12,
    },
    colorHalf: {
        flex: 1,
    },
    notesInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    resistanceRow: {
        flexDirection: 'row',
        gap: 8,
    },
    resistanceOption: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    resistanceOptionSelected: {
        backgroundColor: '#e0f2fe',
        borderColor: '#1e3a5f',
    },
    resistanceText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
    },
    resistanceTextSelected: {
        color: '#1e3a5f',
    },
    disabledOption: {
        opacity: 0.5,
    }
});

export default ItemForm;
