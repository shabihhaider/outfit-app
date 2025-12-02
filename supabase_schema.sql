-- ============================================
-- OUTFIT APP DATABASE SCHEMA v1.0
-- Sprint 0, Step 2 - CORRECTED VERSION
-- ============================================

-- 1. Create Custom ENUMs
CREATE TYPE warmth_level_enum AS ENUM ('ultralight', 'light', 'medium', 'heavy', 'very_heavy');
CREATE TYPE weather_resistance_enum AS ENUM ('none', 'water_resistant', 'waterproof');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');
CREATE TYPE skin_undertone_enum AS ENUM ('warm', 'cool', 'neutral');
CREATE TYPE classification_source_enum AS ENUM ('fashionclip', 'vlm', 'user');
CREATE TYPE item_status_enum AS ENUM ('pending', 'classified', 'needs_review');
CREATE TYPE pattern_enum AS ENUM ('solid', 'striped', 'floral', 'plaid', 'abstract', 'checkered', 'polka_dot', 'other');

-- 2. Create Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender gender_enum,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Style Profiles Table
CREATE TABLE public.style_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  color_season TEXT,
  color_palette JSONB,
  skin_undertone skin_undertone_enum,
  body_type TEXT,
  style_preferences JSONB,
  excluded_brands JSONB,
  budget_min INTEGER,
  budget_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Wardrobe Items Table
CREATE TABLE public.wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  category TEXT,
  subcategory TEXT,
  primary_color TEXT,
  secondary_colors JSONB,
  pattern pattern_enum,
  style_tags JSONB,
  
  warmth_level warmth_level_enum,
  weather_resistance weather_resistance_enum DEFAULT 'none',
  
  occasions JSONB,
  brand TEXT,
  name TEXT,
  
  ai_confidence DECIMAL(3,2),
  classification_source classification_source_enum,
  status item_status_enum DEFAULT 'pending',
  user_verified BOOLEAN DEFAULT FALSE,
  
  times_worn INTEGER DEFAULT 0,
  last_worn_at DATE,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Shopping Products Table
CREATE TABLE public.shopping_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  retailer TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  product_url TEXT,
  affiliate_url TEXT,
  
  category TEXT,
  subcategory TEXT,
  primary_color TEXT,
  secondary_colors JSONB,
  pattern pattern_enum,
  style_tags JSONB,
  warmth_level warmth_level_enum,
  occasions JSONB,
  ai_confidence DECIMAL(3,2),
  
  in_stock BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create User Feedback Table
CREATE TABLE public.user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  wardrobe_item_id UUID REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
  original_category TEXT,
  corrected_category TEXT,
  original_attributes JSONB,
  corrected_attributes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Saved Outfits Tables (for Sprint 6)
CREATE TABLE public.outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  occasion TEXT,
  season TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.outfit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID REFERENCES public.outfits(id) ON DELETE CASCADE NOT NULL,
  wardrobe_item_id UUID REFERENCES public.wardrobe_items(id) ON DELETE CASCADE NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(outfit_id, wardrobe_item_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Style Profiles Policies
CREATE POLICY "Users can view own style profile" ON public.style_profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own style profile" ON public.style_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own style profile" ON public.style_profiles 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own style profile" ON public.style_profiles 
  FOR DELETE USING (auth.uid() = user_id);

-- Wardrobe Items Policies
CREATE POLICY "Users can view own wardrobe" ON public.wardrobe_items 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wardrobe" ON public.wardrobe_items 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wardrobe" ON public.wardrobe_items 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wardrobe" ON public.wardrobe_items 
  FOR DELETE USING (auth.uid() = user_id);

-- User Feedback Policies
CREATE POLICY "Users can view own feedback" ON public.user_feedback 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own feedback" ON public.user_feedback 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shopping Products (Public Read)
CREATE POLICY "Anyone can view products" ON public.shopping_products 
  FOR SELECT USING (true);

-- Outfits Policies
CREATE POLICY "Users can view own outfits" ON public.outfits 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own outfits" ON public.outfits 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own outfits" ON public.outfits 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own outfits" ON public.outfits 
  FOR DELETE USING (auth.uid() = user_id);

-- Outfit Items Policies (via outfit ownership)
CREATE POLICY "Users can view own outfit items" ON public.outfit_items 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can insert own outfit items" ON public.outfit_items 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete own outfit items" ON public.outfit_items 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_id AND user_id = auth.uid())
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_wardrobe_items
  BEFORE UPDATE ON public.wardrobe_items
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_style_profiles
  BEFORE UPDATE ON public.style_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at_outfits
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================
-- INDEXES (Performance)
-- ============================================

CREATE INDEX idx_wardrobe_items_user_id ON public.wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_items_category ON public.wardrobe_items(category);
CREATE INDEX idx_wardrobe_items_status ON public.wardrobe_items(status);
CREATE INDEX idx_wardrobe_items_created_at ON public.wardrobe_items(created_at DESC);
CREATE INDEX idx_wardrobe_items_is_archived ON public.wardrobe_items(is_archived);

CREATE INDEX idx_style_profiles_user_id ON public.style_profiles(user_id);

CREATE INDEX idx_shopping_products_category ON public.shopping_products(category);
CREATE INDEX idx_shopping_products_brand ON public.shopping_products(brand);
CREATE INDEX idx_shopping_products_source ON public.shopping_products(source);
CREATE INDEX idx_shopping_products_in_stock ON public.shopping_products(in_stock);

CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX idx_user_feedback_item_id ON public.user_feedback(wardrobe_item_id);

CREATE INDEX idx_outfits_user_id ON public.outfits(user_id);
CREATE INDEX idx_outfit_items_outfit_id ON public.outfit_items(outfit_id);
