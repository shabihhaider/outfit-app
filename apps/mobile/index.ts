// Critical polyfills MUST be loaded FIRST (order matters!)
import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

// SharedArrayBuffer polyfill for Android runtime error
if (typeof global !== 'undefined' && typeof global.SharedArrayBuffer === 'undefined') {
    // @ts-ignore
    global.SharedArrayBuffer = ArrayBuffer;
}

import 'expo-router/entry';
