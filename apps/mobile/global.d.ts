/// <reference types="react-native" />

/**
 * Global type declarations for React Native environment
 * This file defines globals that are available in React Native but not in standard TypeScript
 */

declare global {
    /**
     * React Native global object
     * Available in React Native runtime, similar to window in browsers
     */
    var global: typeof globalThis;

    /**
     * Development mode flag
     * True when running in development, false in production
     */
    var __DEV__: boolean;

    /**
     * Hermes bytecode version (if using Hermes engine)
     */
    var HermesInternal: {
        hasPromise?: boolean;
        useEngineQueue?: boolean;
        enqueueJob?: (job: () => void) => void;
        getRuntimeProperties?: () => Record<string, unknown>;
    } | null;

    /**
     * Performance API polyfill
     */
    var performance: {
        now: () => number;
    };
}

/**
 * Module augmentation for React Native
 */
declare module 'react-native' {
    export interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        EXPO_PUBLIC_SUPABASE_URL?: string;
        EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    }
}

/**
 * Expo Router types
 */
declare module 'expo-router/entry';

/**
 * Crypto polyfill types
 */
declare module 'expo-crypto' {
    export function randomFillSync<T extends ArrayBufferView>(arr: T): T;
    export function getRandomBytes(length: number): Uint8Array;
    export function getRandomBytesAsync(length: number): Promise<Uint8Array>;
}

/**
 * Buffer polyfill
 */
declare module 'buffer' {
    export class Buffer extends Uint8Array {
        static from(data: unknown): Buffer;
        static alloc(size: number): Buffer;
    }
}

export {};
