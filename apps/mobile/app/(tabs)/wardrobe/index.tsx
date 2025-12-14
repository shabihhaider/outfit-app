import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { SafeView } from '../../../components/SafeView';
import { EmptyWardrobe } from '../../../components/wardrobe';
import { useWardrobe } from '../../../hooks/useWardrobe';

export default function WardrobeScreen() {
    const { items, isLoading, itemCount, fetchItems } = useWardrobe();

    // Ensure items are fetched on mount/focus
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleAddItem = () => {
        router.push('/(tabs)/wardrobe/add');
    };

    if (isLoading && items.length === 0) {
        return (
            <SafeView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1e3a5f" />
                </View>
            </SafeView>
        );
    }

    return (
        <SafeView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Wardrobe</Text>
                <Text style={styles.itemCount}>{itemCount} items</Text>
            </View>

            {/* Content */}
            {/* We use items.length === 0 because empty array is truthy */}
            {items.length === 0 ? (
                <EmptyWardrobe onAddItem={handleAddItem} />
            ) : (
                <View style={styles.content}>
                    <Text style={styles.placeholderText}>
                        {itemCount} items in wardrobe
                    </Text>
                    <Text style={styles.placeholderHint}>
                        Grid view coming in Task 2.3
                    </Text>
                    {/* Temporary List for verification */}
                    {items.slice(0, 5).map(item => (
                        <Text key={item.id} style={{ marginTop: 5, color: '#666' }}>
                            • {item.name} ({item.category})
                        </Text>
                    ))}
                </View>
            )}

            {/* FAB */}
            <Pressable style={styles.fab} onPress={handleAddItem}>
                <Ionicons name="add" size={28} color="#ffffff" />
            </Pressable>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e3a5f',
    },
    itemCount: {
        fontSize: 14,
        color: '#6b7280',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    placeholderHint: {
        fontSize: 14,
        color: '#6b7280',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1e3a5f',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
