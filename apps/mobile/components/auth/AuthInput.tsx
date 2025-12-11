import React, { forwardRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    StyleSheet,
} from 'react-native';

interface AuthInputProps extends TextInputProps {
    label: string;
    error?: string;
    touched?: boolean;
    containerStyle?: object;
}

export const AuthInput = forwardRef<TextInput, AuthInputProps>(
    ({ label, error, touched, containerStyle, style, ...props }, ref) => {
        const showError = !!error;

        return (
            <View style={[styles.container, containerStyle]}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    ref={ref}
                    style={[
                        styles.input,
                        showError && styles.inputError,
                        style,
                    ]}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    autoCorrect={false}
                    {...props}
                />
                {showError && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </View>
        );
    }
);

AuthInput.displayName = 'AuthInput';

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
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
        marginLeft: 4,
    },
});

export default AuthInput;
