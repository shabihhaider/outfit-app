-- Drop old table if exists with wrong schema (CAREFUL in production!)
-- DROP TABLE IF EXISTS public.wardrobe_items;

-- Create wardrobe_items table with CORRECT schema
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT, -- Added
  
  -- Colors & Style
  primary_color TEXT,   -- Added
  secondary_color TEXT, -- Added
  pattern TEXT,
  material TEXT,
  brand TEXT,
  size TEXT,
  
  -- ⚠️ CRITICAL: Weather/Warmth fields (Verified)
  -- These enable temperature-based outfit recommendations
  warmth_level TEXT CHECK (warmth_level IN ('ultralight', 'light', 'medium', 'heavy', 'very_heavy')),
  weather_resistance TEXT CHECK (weather_resistance IN ('none', 'water_resistant', 'waterproof')),
  
  -- Tags (arrays)
  style_tags TEXT[] DEFAULT '{}', -- Added
  occasion TEXT[] DEFAULT '{}',   -- Added
  
  -- Images (Nullable as user might add item without image first)
  image_url TEXT,
  thumbnail_url TEXT,
  
  -- ⚠️ Classification tracking
  -- Tracks whether AI or user classified this item
  classification_source TEXT CHECK (classification_source IN ('fashionclip', 'vlm', 'user', 'manual')), -- Added 'manual'
  ai_confidence DECIMAL(3,2),
  
  -- Usage tracking
  is_favorite BOOLEAN DEFAULT FALSE,
  times_worn INTEGER DEFAULT 0,
  last_worn_at TIMESTAMP WITH TIME ZONE,
  
  -- Purchase info
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  
  -- Misc
  notes TEXT,
  ai_classification JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure Bucket Exists (Apps often need this created explicitly)
INSERT INTO storage.buckets (id, name, public)
VALUES ('wardrobe-items', 'wardrobe-items', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON public.wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_category ON public.wardrobe_items(category);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_warmth ON public.wardrobe_items(warmth_level);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_created_at ON public.wardrobe_items(created_at DESC);

-- Enable RLS
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Create policies for Table
CREATE POLICY "Users can view own wardrobe items"
  ON public.wardrobe_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wardrobe items"
  ON public.wardrobe_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobe items"
  ON public.wardrobe_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobe items"
  ON public.wardrobe_items FOR DELETE
  USING (auth.uid() = user_id);


-- STORAGE BUCKET SETUP
-- Note: You usually create the bucket in the Supabase Dashboard, but here are the Policies.

-- Policy 1: Public Read
CREATE POLICY "Public wardrobe item access"
ON storage.objects FOR SELECT
USING (bucket_id = 'wardrobe-items');

-- Policy 2: Authenticated Upload
CREATE POLICY "Users can upload own wardrobe items"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wardrobe-items' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Authenticated Update
CREATE POLICY "Users can update own wardrobe items"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'wardrobe-items' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Authenticated Delete
CREATE POLICY "Users can delete own wardrobe items"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'wardrobe-items' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
