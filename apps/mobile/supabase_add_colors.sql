-- Add missing columns for colors and subcategory if they don't exist
-- This fixes the "Could not find 'secondary_color'" error

ALTER TABLE public.wardrobe_items ADD COLUMN IF NOT EXISTS primary_color TEXT;
ALTER TABLE public.wardrobe_items ADD COLUMN IF NOT EXISTS secondary_color TEXT;
ALTER TABLE public.wardrobe_items ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE public.wardrobe_items ADD COLUMN IF NOT EXISTS style_tags TEXT[] DEFAULT '{}';
ALTER TABLE public.wardrobe_items ADD COLUMN IF NOT EXISTS occasion TEXT[] DEFAULT '{}';
