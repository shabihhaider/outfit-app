-- Create the 'wardrobe-items' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('wardrobe-items', 'wardrobe-items', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure the bucket is public (in case it existed but was private)
UPDATE storage.buckets
SET public = true
WHERE id = 'wardrobe-items';

-- Verify it exists
-- SELECT * FROM storage.buckets WHERE id = 'wardrobe-items';
