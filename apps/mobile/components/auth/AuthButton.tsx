import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function AuthButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    style,
    textStyle,
}: AuthButtonProps) {
    const isDisabled = disabled || loading;

    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return [styles.button, styles.secondaryButton, isDisabled && styles.disabledButton];
            case 'outline':
                return [styles.button, styles.outlineButton, isDisabled && styles.disabledOutlineButton];
            default:
                return [styles.button, styles.primaryButton, isDisabled && styles.disabledButton];
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'secondary':
                return [styles.buttonText, styles.secondaryButtonText];
            case 'outline':
                return [styles.buttonText, styles.outlineButtonText];
            default:
                return [styles.buttonText, styles.primaryButtonText];
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                ...getButtonStyle(),
                pressed && !isDisabled && styles.pressed,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? '#1e3a5f' : '#ffffff'}
                    size="small"
                />
            ) : (
                <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    primaryButton: {
        backgroundColor: '#1e3a5f',
    },
    secondaryButton: {
        backgroundColor: '#3b82f6',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#1e3a5f',
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
    },
    disabledOutlineButton: {
        borderColor: '#9ca3af',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButtonText: {
        color: '#ffffff',
    },
    secondaryButtonText: {
        color: '#ffffff',
    },
    outlineButtonText: {
        color: '#1e3a5f',
    },
});

export default AuthButton;
