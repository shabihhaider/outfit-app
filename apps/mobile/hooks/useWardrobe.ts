import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { deleteWardrobeImage } from '../lib/wardrobe-storage';
import {
    WardrobeItem,
    CreateWardrobeItemData,
    UpdateWardrobeItemData,
    WardrobeFilters,
    WardrobeSortOptions,
    ItemCategory,
    WarmthLevel,
} from '../types/wardrobe';

export interface UseWardrobeReturn {
    items: WardrobeItem[];
    isLoading: boolean;
    error: string | null;

    // CRUD operations
    addItem: (data: CreateWardrobeItemData) => Promise<{ success: boolean; item?: WardrobeItem; error?: string }>;
    updateItem: (id: string, data: UpdateWardrobeItemData) => Promise<{ success: boolean; error?: string }>;
    deleteItem: (id: string) => Promise<{ success: boolean; error?: string }>;
    fetchItems: () => Promise<void>;
    getItem: (id: string) => Promise<WardrobeItem | null>;

    // Queries
    refetch: () => Promise<void>;
    fetchByCategory: (category: ItemCategory) => Promise<WardrobeItem[]>;
    fetchByWarmthLevel: (warmthLevel: WarmthLevel) => Promise<WardrobeItem[]>;

    // Filters & sorting
    filters: WardrobeFilters;
    setFilters: (filters: WardrobeFilters) => void;
    sortOptions: WardrobeSortOptions;
    setSortOptions: (options: WardrobeSortOptions) => void;

    // Stats
    itemCount: number;
    categoryCount: Record<ItemCategory, number>;
}

export function useWardrobe(): UseWardrobeReturn {
    const { user } = useAuth();
    const [items, setItems] = useState<WardrobeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<WardrobeFilters>({});
    const [sortOptions, setSortOptions] = useState<WardrobeSortOptions>({
        sortBy: 'created_at',
        order: 'desc',
    });

    // Fetch all items
    const fetchItems = useCallback(async () => {
        if (!user?.id) {
            setItems([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            let query = supabase
                .from('wardrobe_items')
                .select('*')
                .eq('user_id', user.id);

            // Apply filters
            if (filters.category) {
                query = query.eq('category', filters.category);
            }
            if (filters.warmth_level) {
                query = query.eq('warmth_level', filters.warmth_level);
            }
            if (filters.weather_resistance) {
                query = query.eq('weather_resistance', filters.weather_resistance);
            }
            if (filters.favorite !== undefined) {
                query = query.eq('is_favorite', filters.favorite);
            }
            if (filters.color) {
                query = query.or(`primary_color.eq.${filters.color},secondary_color.eq.${filters.color}`);
            }
            if (filters.search) {
                query = query.ilike('name', `%${filters.search}%`);
            }

            // Apply sorting
            query = query.order(sortOptions.sortBy, { ascending: sortOptions.order === 'asc' });

            const { data, error: fetchError } = await query;

            if (fetchError) {
                throw fetchError;
            }

            setItems((data as unknown as WardrobeItem[]) || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch wardrobe';
            console.error('[useWardrobe] Fetch error:', message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, filters, sortOptions]);

    // Add new item
    const addItem = useCallback(async (
        data: CreateWardrobeItemData
    ): Promise<{ success: boolean; item?: WardrobeItem; error?: string }> => {
        if (!user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const { data: newItem, error: insertError } = await supabase
                .from('wardrobe_items')
                .insert({
                    ...data,
                    user_id: user.id,
                } as any)
                .select()
                .single();

            if (insertError) {
                console.error('[useWardrobe] Insert error:', insertError.message);
                return { success: false, error: insertError.message };
            }

            // Update local state
            const typedItem = newItem as unknown as WardrobeItem;
            setItems(prev => [typedItem, ...prev]);

            return { success: true, item: typedItem };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add item';
            return { success: false, error: message };
        }
    }, [user?.id]);

    // Update item
    const updateItem = useCallback(async (
        id: string,
        data: UpdateWardrobeItemData
    ): Promise<{ success: boolean; error?: string }> => {
        if (!user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const { data: updated, error: updateError } = await supabase
                .from('wardrobe_items')
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                } as any)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (updateError) {
                console.error('[useWardrobe] Update error:', updateError.message);
                return { success: false, error: updateError.message };
            }

            // Update local state
            const typedUpdated = updated as unknown as WardrobeItem;
            setItems(prev => prev.map(item => item.id === id ? typedUpdated : item));

            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update item';
            return { success: false, error: message };
        }
    }, [user?.id]);

    // Delete item
    const deleteItem = useCallback(async (
        id: string
    ): Promise<{ success: boolean; error?: string }> => {
        if (!user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            // Get item to delete image
            const itemToDelete = items.find(i => i.id === id);

            const { error: deleteError } = await supabase
                .from('wardrobe_items')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (deleteError) {
                console.error('[useWardrobe] Delete error:', deleteError.message);
                return { success: false, error: deleteError.message };
            }

            // Delete image from storage
            if (itemToDelete?.image_url) {
                await deleteWardrobeImage(itemToDelete.image_url);
            }

            // Update local state
            setItems(prev => prev.filter(item => item.id !== id));

            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete item';
            return { success: false, error: message };
        }
    }, [user?.id, items]);

    // Get single item
    const getItem = useCallback(async (id: string): Promise<WardrobeItem | null> => {
        if (!user?.id) return null;

        try {
            const { data, error: fetchError } = await supabase
                .from('wardrobe_items')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (fetchError) {
                console.error('[useWardrobe] Get item error:', fetchError.message);
                return null;
            }

            return data as unknown as WardrobeItem;
        } catch (err) {
            console.error('[useWardrobe] Get item exception:', err);
            return null;
        }
    }, [user?.id]);

    // Fetch by category
    const fetchByCategory = useCallback(async (
        category: ItemCategory
    ): Promise<WardrobeItem[]> => {
        if (!user?.id) return [];

        try {
            const { data, error: fetchError } = await supabase
                .from('wardrobe_items')
                .select('*')
                .eq('user_id', user.id)
                .eq('category', category)
                .order('created_at', { ascending: false });

            if (fetchError) {
                console.error('[useWardrobe] Fetch by category error:', fetchError.message);
                return [];
            }

            return (data as unknown as WardrobeItem[]) || [];
        } catch (err) {
            console.error('[useWardrobe] Fetch by category exception:', err);
            return [];
        }
    }, [user?.id]);

    // Fetch by warmth level (for weather-based recommendations)
    const fetchByWarmthLevel = useCallback(async (
        warmthLevel: WarmthLevel
    ): Promise<WardrobeItem[]> => {
        if (!user?.id) return [];

        try {
            const { data, error: fetchError } = await supabase
                .from('wardrobe_items')
                .select('*')
                .eq('user_id', user.id)
                .eq('warmth_level', warmthLevel)
                .order('created_at', { ascending: false });

            if (fetchError) {
                console.error('[useWardrobe] Fetch by warmth error:', fetchError.message);
                return [];
            }

            return (data as unknown as WardrobeItem[]) || [];
        } catch (err) {
            console.error('[useWardrobe] Fetch by warmth exception:', err);
            return [];
        }
    }, [user?.id]);

    // Calculate category counts
    const categoryCount = items.reduce((acc, item) => {
        const cat = item.category as ItemCategory;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<ItemCategory, number>);

    // Fetch on mount and when dependencies change
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        items,
        isLoading,
        error,
        addItem,
        updateItem,
        deleteItem,
        fetchItems, // Added fetchItems here as per instruction
        getItem,
        refetch: fetchItems,
        fetchByCategory,
        fetchByWarmthLevel,
        filters,
        setFilters,
        sortOptions,
        setSortOptions,
        itemCount: items.length,
        categoryCount,
    };
}

export default useWardrobe;
