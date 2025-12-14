import { supabase } from './supabase';

export interface UploadResult {
    success: boolean;
    imageUrl?: string;
    thumbnailUrl?: string;
    error?: string;
}

/**
 * Upload wardrobe item image to Supabase Storage
 */
export async function uploadWardrobeImage(
    userId: string,
    imageUri: string,
    itemId?: string
): Promise<UploadResult> {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = itemId
            ? `${userId}/${itemId}.${fileExt}`
            : `${userId}/${timestamp}.${fileExt}`;

        // 2. Read file as ArrayBuffer (More reliable than Blob for RN + Supabase)
        const response = await fetch(imageUri);
        const arrayBuffer = await response.arrayBuffer();

        // 3. Upload to Supabase
        const { data, error } = await supabase.storage
            .from('wardrobe-items')
            .upload(fileName, arrayBuffer, {
                contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`, // Revert to reliable extension-based type for ArrayBuffer
                upsert: false,
            });

        if (error) {
            console.error('[WardrobeStorage] Upload error:', error.message);
            return { success: false, error: error.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('wardrobe-items')
            .getPublicUrl(fileName);

        // Add cache buster
        const imageUrl = `${urlData.publicUrl}?t=${timestamp}`;

        return {
            success: true,
            imageUrl,
            thumbnailUrl: imageUrl, // Could generate actual thumbnail later
        };
    } catch (error) {
        console.error('[WardrobeStorage] Exception:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

/**
 * Delete wardrobe item image from storage
 */
export async function deleteWardrobeImage(imageUrl: string): Promise<boolean> {
    try {
        // Extract path from URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/storage/v1/object/public/wardrobe-items/');

        if (pathParts.length < 2) {
            console.error('[WardrobeStorage] Invalid image URL format');
            return false;
        }

        const filePath = pathParts[1].split('?')[0]; // Remove query params

        const { error } = await supabase.storage
            .from('wardrobe-items')
            .remove([filePath]);

        if (error) {
            console.error('[WardrobeStorage] Delete error:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('[WardrobeStorage] Delete exception:', error);
        return false;
    }
}

/**
 * Get public URL for an image path
 */
export function getWardrobeImageUrl(path: string): string {
    const { data } = supabase.storage
        .from('wardrobe-items')
        .getPublicUrl(path);

    return data.publicUrl;
}
