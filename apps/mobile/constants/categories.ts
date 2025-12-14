import {
    ItemCategory,
    WarmthLevel,
    WeatherResistance,
    ClassificationSource
} from '../types/wardrobe';

/**
 * Main clothing categories
 */
export const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
    { value: 'tops', label: 'Tops', icon: '👕' },
    { value: 'bottoms', label: 'Bottoms', icon: '👖' },
    { value: 'dresses', label: 'Dresses', icon: '👗' },
    { value: 'outerwear', label: 'Outerwear', icon: '🧥' },
    { value: 'shoes', label: 'Shoes', icon: '👟' },
    { value: 'accessories', label: 'Accessories', icon: '👜' },
    { value: 'activewear', label: 'Activewear', icon: '🏃' },
    { value: 'formal', label: 'Formal', icon: '🎩' },
    { value: 'other', label: 'Other', icon: '📦' },
];

/**
 * Subcategories by main category
 */
export const SUBCATEGORIES: Record<ItemCategory, string[]> = {
    tops: ['T-Shirts', 'Shirts', 'Blouses', 'Sweaters', 'Hoodies', 'Tank Tops', 'Crop Tops', 'Polos'],
    bottoms: ['Jeans', 'Pants', 'Shorts', 'Skirts', 'Leggings', 'Joggers', 'Chinos'],
    dresses: ['Casual', 'Formal', 'Maxi', 'Mini', 'Midi', 'Cocktail', 'Sundress'],
    outerwear: ['Jackets', 'Coats', 'Blazers', 'Cardigans', 'Vests', 'Parkas', 'Raincoats'],
    shoes: ['Sneakers', 'Boots', 'Heels', 'Sandals', 'Loafers', 'Flats', 'Oxford', 'Athletic'],
    accessories: ['Bags', 'Hats', 'Scarves', 'Belts', 'Jewelry', 'Watches', 'Sunglasses', 'Ties'],
    activewear: ['Sports Bras', 'Leggings', 'Shorts', 'Jerseys', 'Track Pants', 'Swimwear'],
    formal: ['Suits', 'Dress Shirts', 'Ties', 'Gowns', 'Tuxedos', 'Dress Pants'],
    other: ['Loungewear', 'Sleepwear', 'Underwear', 'Socks', 'Other'],
};

/**
 * ⚠️ WARMTH LEVELS (replaces SEASONS)
 * Used for temperature-based outfit recommendations
 * Works globally regardless of hemisphere/location
 */
export const WARMTH_LEVELS: {
    value: WarmthLevel;
    label: string;
    description: string;
    tempRange: string;
    icon: string;
}[] = [
        {
            value: 'ultralight',
            label: 'Ultralight',
            description: 'Very hot weather, maximum breathability',
            tempRange: '25°C+ (77°F+)',
            icon: '🌞'
        },
        {
            value: 'light',
            label: 'Light',
            description: 'Warm weather, light coverage',
            tempRange: '18-25°C (64-77°F)',
            icon: '🌤️'
        },
        {
            value: 'medium',
            label: 'Medium',
            description: 'Mild weather, moderate insulation',
            tempRange: '10-18°C (50-64°F)',
            icon: '🌥️'
        },
        {
            value: 'heavy',
            label: 'Heavy',
            description: 'Cold weather, good insulation',
            tempRange: '0-10°C (32-50°F)',
            icon: '❄️'
        },
        {
            value: 'very_heavy',
            label: 'Very Heavy',
            description: 'Very cold weather, maximum warmth',
            tempRange: 'Below 0°C (32°F)',
            icon: '🥶'
        },
    ];

/**
 * Weather resistance options
 */
export const WEATHER_RESISTANCE: {
    value: WeatherResistance;
    label: string;
    description: string;
}[] = [
        { value: 'none', label: 'None', description: 'No water resistance' },
        { value: 'water_resistant', label: 'Water Resistant', description: 'Light rain/splashes' },
        { value: 'waterproof', label: 'Waterproof', description: 'Heavy rain protection' },
    ];

/**
 * Classification source options
 */
export const CLASSIFICATION_SOURCES: {
    value: ClassificationSource;
    label: string;
    description: string;
}[] = [
        { value: 'fashionclip', label: 'FashionCLIP', description: 'AI image classification' },
        { value: 'vlm', label: 'Vision LLM', description: 'Advanced AI analysis' },
        { value: 'user', label: 'User Corrected', description: 'AI result edited by user' },
        { value: 'manual', label: 'Manual Entry', description: 'Manually entered by user' },
    ];

/**
 * Color options
 */
export const COLORS: { value: string; label: string; hex: string }[] = [
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'gray', label: 'Gray', hex: '#808080' },
    { value: 'navy', label: 'Navy', hex: '#000080' },
    { value: 'blue', label: 'Blue', hex: '#0000FF' },
    { value: 'light_blue', label: 'Light Blue', hex: '#ADD8E6' },
    { value: 'red', label: 'Red', hex: '#FF0000' },
    { value: 'burgundy', label: 'Burgundy', hex: '#800020' },
    { value: 'pink', label: 'Pink', hex: '#FFC0CB' },
    { value: 'orange', label: 'Orange', hex: '#FFA500' },
    { value: 'yellow', label: 'Yellow', hex: '#FFFF00' },
    { value: 'green', label: 'Green', hex: '#008000' },
    { value: 'olive', label: 'Olive', hex: '#808000' },
    { value: 'brown', label: 'Brown', hex: '#8B4513' },
    { value: 'beige', label: 'Beige', hex: '#F5F5DC' },
    { value: 'cream', label: 'Cream', hex: '#FFFDD0' },
    { value: 'purple', label: 'Purple', hex: '#800080' },
    { value: 'lavender', label: 'Lavender', hex: '#E6E6FA' },
    { value: 'teal', label: 'Teal', hex: '#008080' },
    { value: 'coral', label: 'Coral', hex: '#FF7F50' },
    { value: 'gold', label: 'Gold', hex: '#FFD700' },
    { value: 'silver', label: 'Silver', hex: '#C0C0C0' },
    { value: 'multi', label: 'Multi-color', hex: '#RAINBOW' },
];

/**
 * Pattern options
 */
export const PATTERNS: string[] = [
    'Solid',
    'Striped',
    'Plaid',
    'Floral',
    'Polka Dot',
    'Checkered',
    'Animal Print',
    'Geometric',
    'Abstract',
    'Camouflage',
    'Tie-Dye',
    'Other',
];

/**
 * Style tags
 */
export const STYLE_TAGS: string[] = [
    'Casual',
    'Formal',
    'Business Casual',
    'Sporty',
    'Streetwear',
    'Bohemian',
    'Vintage',
    'Minimalist',
    'Preppy',
    'Elegant',
    'Edgy',
    'Romantic',
    'Classic',
    'Trendy',
];

/**
 * Occasion options
 */
export const OCCASIONS: string[] = [
    'Everyday',
    'Work',
    'Formal Event',
    'Party',
    'Date Night',
    'Workout',
    'Beach',
    'Travel',
    'Wedding',
    'Interview',
    'Casual Outing',
    'Business Meeting',
];

/**
 * Material options
 */
export const MATERIALS: string[] = [
    'Cotton',
    'Polyester',
    'Wool',
    'Silk',
    'Linen',
    'Denim',
    'Leather',
    'Suede',
    'Cashmere',
    'Velvet',
    'Nylon',
    'Spandex',
    'Rayon',
    'Fleece',
    'Other',
];

/**
 * Size options
 */
export const SIZES: string[] = [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
    // Numeric sizes
    '0', '2', '4', '6', '8', '10', '12', '14', '16',
    // Shoe sizes
    '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13',
    'One Size',
];

/**
 * Get category by value
 */
export function getCategoryInfo(value: ItemCategory) {
    return CATEGORIES.find(c => c.value === value);
}

/**
 * Get color by value
 */
export function getColorInfo(value: string) {
    return COLORS.find(c => c.value === value);
}

/**
 * Get subcategories for a category
 */
export function getSubcategories(category: ItemCategory): string[] {
    return SUBCATEGORIES[category] || [];
}

/**
 * Get warmth level info
 */
export function getWarmthLevelInfo(value: WarmthLevel) {
    return WARMTH_LEVELS.find(w => w.value === value);
}

/**
 * Get weather resistance info
 */
export function getWeatherResistanceInfo(value: WeatherResistance) {
    return WEATHER_RESISTANCE.find(w => w.value === value);
}

/**
 * Map temperature to warmth level
 * Used by recommendation engine
 */
export function temperatureToWarmthLevel(tempCelsius: number): WarmthLevel {
    if (tempCelsius >= 25) return 'ultralight';
    if (tempCelsius >= 18) return 'light';
    if (tempCelsius >= 10) return 'medium';
    if (tempCelsius >= 0) return 'heavy';
    return 'very_heavy';
}
