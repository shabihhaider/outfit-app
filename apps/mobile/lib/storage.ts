import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';

export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Upload avatar image to Supabase Storage
 * @param userId - User's UUID
 * @param imageUri - Local image URI from picker
 * @returns Upload result with public URL
 */
export async function uploadAvatar(
    userId: string,
    imageUri: string
): Promise<UploadResult> {
    try {
        // Determine file extension
        const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${userId}/avatar.${fileExt}`;
        const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

        let arrayBuffer: ArrayBuffer;
        let finalContentType = contentType;

        if (Platform.OS === 'web') {
            // On web, fetch the blob/buffer directly to get the correct MIME type
            const response = await fetch(imageUri);
            const blob = await response.blob();
            arrayBuffer = await blob.arrayBuffer();
            finalContentType = blob.type || contentType; // Use blob type if available
            console.log('[Storage] Web Upload Type:', finalContentType);
        } else {
            // On native, read as base64
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: 'base64',
            });
            arrayBuffer = decode(base64);
        }

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, arrayBuffer, {
                contentType: finalContentType,
                upsert: true, // Overwrite if exists
            });

        if (error) {
            console.error('[Storage] Upload error:', error.message);
            return { success: false, error: error.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        // Add cache buster to force refresh
        const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('[Storage] Upload exception:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        };
    }
}

/**
 * Delete user's avatar from storage
 * @param userId - User's UUID
 */
export async function deleteAvatar(userId: string): Promise<boolean> {
    try {
        const { error } = await supabase.storage
            .from('avatars')
            .remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);

        if (error) {
            console.error('[Storage] Delete error:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('[Storage] Delete exception:', error);
        return false;
    }
}

/**
 * Get avatar URL for a user
 * @param userId - User's UUID
 * @returns Public URL or null
 */
export function getAvatarUrl(userId: string, fileName?: string): string | null {
    if (!userId) return null;

    const path = fileName || `${userId}/avatar.jpg`;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);

    return data.publicUrl;
}
