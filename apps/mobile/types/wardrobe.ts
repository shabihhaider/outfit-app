/**
 * ⚠️ IMPORTANT: This uses warmth_level instead of season
 * This enables temperature-based outfit recommendations
 */

/**
 * Warmth level for temperature-based matching
 * Maps to actual temperature ranges for global compatibility
 */
export type WarmthLevel = 'ultralight' | 'light' | 'medium' | 'heavy' | 'very_heavy';

/**
 * Weather resistance properties
 */
export type WeatherResistance = 'none' | 'water_resistant' | 'waterproof';

/**
 * Source of classification (AI vs manual)
 */
export type ClassificationSource = 'fashionclip' | 'vlm' | 'user';

/**
 * Category types
 */
export type ItemCategory =
    | 'tops'
    | 'bottoms'
    | 'dresses'
    | 'outerwear'
    | 'shoes'
    | 'accessories'
    | 'activewear'
    | 'formal'
    | 'other';

/**
 * Main wardrobe item interface
 */
export interface WardrobeItem {
    id: string;
    user_id: string;

    // Basic Info
    name: string;
    category: ItemCategory;
    subcategory: string | null;

    // Colors & Style
    primary_color: string | null;
    secondary_color: string | null;
    pattern: string | null;
    material: string | null;
    brand: string | null;
    size: string | null;

    // ⚠️ Weather/Warmth (NOT season!)
    warmth_level: WarmthLevel | null;
    weather_resistance: WeatherResistance | null;

    // Tags
    style_tags: string[] | null;
    occasion: string[] | null;

    // Images
    image_url: string | null;
    thumbnail_url: string | null;

    // Classification tracking
    classification_source: ClassificationSource | null;
    ai_confidence: number | null;

    // Usage
    is_favorite: boolean;
    times_worn: number;
    last_worn_at: string | null;

    // Purchase
    purchase_date: string | null;
    purchase_price: number | null;

    // Misc
    notes: string | null;
    ai_classification: AIClassification | null;

    // Timestamps
    created_at: string;
    updated_at: string;
}

/**
 * Data for creating a new item
 */
export interface CreateWardrobeItemData {
    name: string;
    category: ItemCategory;
    subcategory?: string;
    primary_color?: string;
    secondary_color?: string;
    pattern?: string;
    material?: string;
    brand?: string;
    size?: string;
    warmth_level?: WarmthLevel;
    weather_resistance?: WeatherResistance;
    style_tags?: string[];
    occasion?: string[];
    image_url?: string;
    thumbnail_url?: string;
    classification_source?: ClassificationSource;
    ai_confidence?: number;
    notes?: string;
    ai_classification?: AIClassification;
}

/**
 * Data for updating an item
 */
export interface UpdateWardrobeItemData extends Partial<CreateWardrobeItemData> {
    is_favorite?: boolean;
    times_worn?: number;
    last_worn_at?: string;
    purchase_date?: string;
    purchase_price?: number;
}

/**
 * AI classification result
 */
export interface AIClassification {
    category: string;
    subcategory: string | null;
    primary_color: string;
    secondary_color: string | null;
    pattern: string | null;
    warmth_level: WarmthLevel | null;
    weather_resistance: WeatherResistance | null;
    style_tags: string[];
    confidence: number;
    source: ClassificationSource;
    raw_response?: unknown;
}

/**
 * Filter options for wardrobe queries
 */
export interface WardrobeFilters {
    category?: ItemCategory;
    warmth_level?: WarmthLevel;
    weather_resistance?: WeatherResistance;
    color?: string;
    favorite?: boolean;
    search?: string;
}

/**
 * Sort options
 */
export type WardrobeSortBy = 'created_at' | 'name' | 'times_worn' | 'last_worn_at';
export type SortOrder = 'asc' | 'desc';

export interface WardrobeSortOptions {
    sortBy: WardrobeSortBy;
    order: SortOrder;
}
