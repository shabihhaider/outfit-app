// @ts-nocheck
/* eslint-disable @typescript-eslint/no-var-requires */

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// Get default config
const config = getDefaultConfig(projectRoot);

// ============================================
// MONOREPO CONFIGURATION
// ============================================

// 1. Watch workspace root for changes
config.watchFolders = [workspaceRoot];

// 2. Configure node_modules resolution paths
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
];

// 3. Enable package exports (REQUIRED for styleq)
config.resolver.unstable_enablePackageExports = true;

// 4. DO NOT disable hierarchical lookup for pnpm
config.resolver.disableHierarchicalLookup = false;

// 5. Add additional source extensions
config.resolver.sourceExts = [
    ...(config.resolver.sourceExts || []),
    'mjs',
    'cjs',
];

// ============================================
// STYLEQ RESOLUTION FIX
// ============================================

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Handle styleq subpath imports (e.g., 'styleq/transform-localize-style')
    if (moduleName.startsWith('styleq/')) {
        const subpath = moduleName.replace('styleq/', '');

        // Priority order for resolution - styleq 0.1.3 uses .js files directly
        const possiblePaths = [
            // 1. Hoisted in workspace root - dist folder
            path.resolve(workspaceRoot, `node_modules/styleq/dist/${subpath}.js`),
            // 2. Hoisted in workspace root - root folder
            path.resolve(workspaceRoot, `node_modules/styleq/${subpath}.js`),

            // 3. Local node_modules - dist folder
            path.resolve(projectRoot, `node_modules/styleq/dist/${subpath}.js`),
            // 4. Local node_modules - root folder
            path.resolve(projectRoot, `node_modules/styleq/${subpath}.js`),

            // 5. pnpm virtual store v0.1.3 (react-native-web uses this)
            path.resolve(workspaceRoot, `node_modules/.pnpm/styleq@0.1.3/node_modules/styleq/dist/${subpath}.js`),
            path.resolve(workspaceRoot, `node_modules/.pnpm/styleq@0.1.3/node_modules/styleq/${subpath}.js`),

            // 6. pnpm virtual store v0.2.1 (fallback)
            path.resolve(workspaceRoot, `node_modules/.pnpm/styleq@0.2.1/node_modules/styleq/dist/${subpath}.js`),
        ];

        for (const stylePath of possiblePaths) {
            if (fs.existsSync(stylePath)) {
                if (__DEV__) {
                    console.log(`✓ Resolved ${moduleName} -> ${stylePath}`);
                }
                return {
                    filePath: stylePath,
                    type: 'sourceFile',
                };
            }
        }

        // Debug logging for failed resolution
        if (__DEV__) {
            console.warn(`⚠️  Could not resolve: ${moduleName}`);
            console.warn('   Searched paths:');
            possiblePaths.forEach(p => console.warn(`   - ${p}`));
        }
    }

    // Default resolution
    if (originalResolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }

    return context.resolveRequest(context, moduleName, platform);
};

// ============================================
// EXPORT CONFIGURATION
// ============================================

// @ts-ignore - Metro config type inference issue
module.exports = config;