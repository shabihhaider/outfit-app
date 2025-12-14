import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyWardrobeProps {
    onAddItem?: () => void;
    category?: string;
}

export function EmptyWardrobe({
    onAddItem,
    category
}: EmptyWardrobeProps): React.JSX.Element {
    const message = category
        ? `No ${category} items yet`
        : 'Your wardrobe is empty';

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="shirt-outline" size={64} color="#d1d5db" />
            </View>
            <Text style={styles.title}>{message}</Text>
            <Text style={styles.subtitle}>
                Add your first clothing item to get started
            </Text>
            {onAddItem && (
                <Pressable style={styles.button} onPress={onAddItem}>
                    <Ionicons name="add" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Add Item</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e3a5f',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});

export default EmptyWardrobe;
