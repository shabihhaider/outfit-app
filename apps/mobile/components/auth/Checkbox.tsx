import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string | React.ReactNode;
    error?: string;
    touched?: boolean;
}

export function Checkbox({
    checked,
    onChange,
    label,
    error,
    touched,
}: CheckboxProps) {
    const showError = !!error;

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.checkboxRow}
                onPress={() => onChange(!checked)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <View
                    style={[
                        styles.checkbox,
                        checked && styles.checkboxChecked,
                        showError && styles.checkboxError,
                    ]}
                >
                    {checked && (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                    )}
                </View>
                <Text style={styles.label}>{label}</Text>
            </Pressable>
            {showError && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#d1d5db',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#1e3a5f',
        borderColor: '#1e3a5f',
    },
    checkboxError: {
        borderColor: '#ef4444',
    },
    label: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
        marginLeft: 36,
    },
});

export default Checkbox;
