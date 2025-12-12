import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
    url?: string | null;
    name?: string | null;
    size?: number;
    style?: object;
}

export function Avatar({
    url,
    name,
    size = 80,
    style
}: AvatarProps) {
    const initials = React.useMemo(() => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }, [name]);

    const backgroundColor = React.useMemo(() => {
        // Generate consistent color from name
        if (!name) return '#9ca3af';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        return colors[Math.abs(hash) % colors.length];
    }, [name]);

    const containerStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    const textStyle = {
        fontSize: size * 0.4,
    };

    if (url) {
        return (
            <Image
                source={{ uri: url }}
                style={[styles.image, containerStyle, style]}
                resizeMode="cover"
            />
        );
    }

    return (
        <View style={[styles.placeholder, containerStyle, { backgroundColor }, style]}>
            <Text style={[styles.initials, textStyle]}>{initials}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        backgroundColor: '#e5e7eb',
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: '#ffffff',
        fontWeight: '600',
    },
});

export default Avatar;
