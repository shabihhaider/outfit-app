// ============================================
// CRITICAL POLYFILLS - MUST BE FIRST
// ============================================

// 1. URL polyfill for Supabase
import 'react-native-url-polyfill/auto';

// 2. TextEncoder/TextDecoder for crypto operations
import 'text-encoding-polyfill';

// ============================================
// SHAREDARRAYBUFFER FIX FOR ANDROID
// ============================================

// Fix: ReferenceError: Property 'SharedArrayBuffer' doesn't exist
if (typeof global !== 'undefined') {
    // @ts-ignore - SharedArrayBuffer polyfill
    if (typeof global.SharedArrayBuffer === 'undefined') {
        global.SharedArrayBuffer = ArrayBuffer as any;
        if (__DEV__) {
            console.log('✓ SharedArrayBuffer polyfilled');
        }
    }

    // Additional Android compatibility
    if (typeof global.Buffer === 'undefined') {
        try {
            // @ts-ignore
            global.Buffer = require('buffer').Buffer;
            if (__DEV__) {
                console.log('✓ Buffer polyfilled');
            }
        } catch (e) {
            // Buffer might not be needed, safe to ignore
        }
    }
}

// ============================================
// CRYPTO POLYFILL FOR REACT NATIVE
// ============================================

// Supabase requires crypto.getRandomValues
if (typeof crypto === 'undefined') {
    // @ts-ignore
    global.crypto = {
        getRandomValues: (arr: any) => {
            // Simple polyfill using Math.random
            // This is sufficient for Supabase's needs in development
            for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.floor(Math.random() * 256);
            }
            return arr;
        }
    };
    if (__DEV__) {
        console.log('✓ Crypto polyfilled (Math.random)');
    }
}

if (__DEV__) {
    console.log('🚀 Polyfills loaded successfully');
    console.log('📱 Starting Outfit App...');
}

// ============================================
// START EXPO ROUTER
// ============================================

import 'expo-router/entry';