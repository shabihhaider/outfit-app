import React, { forwardRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    StyleSheet,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
    label: string;
    error?: string;
    touched?: boolean;
    containerStyle?: object;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
    ({ label, error, touched, containerStyle, style, ...props }, ref) => {
        const [isVisible, setIsVisible] = useState(false);
        const showError = !!error;

        const toggleVisibility = () => {
            setIsVisible(!isVisible);
        };

        return (
            <View style={[styles.container, containerStyle]}>
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.inputContainer, showError && styles.inputError]}>
                    <TextInput
                        ref={ref}
                        style={[styles.input, style]}
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={!isVisible}
                        {...props}
                    />
                    <Pressable
                        onPress={toggleVisibility}
                        style={styles.toggleButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="#6b7280"
                        />
                    </Pressable>
                </View>
                {showError && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </View>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        paddingRight: 12,
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    toggleButton: {
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
        marginLeft: 4,
    },
});

export default PasswordInput;
