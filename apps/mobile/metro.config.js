const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the workspace root AND pnpm virtual store
config.watchFolders = [workspaceRoot];

// 2. Help Metro resolve pnpm's symlinked packages (including .pnpm folder)
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
];

// 3. Critical settings for Monorepos
config.resolver.disableHierarchicalLookup = true;
config.resolver.unstable_enablePackageExports = true;

// 4. Custom resolver for pnpm .pnpm folder subpath imports
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Handle styleq subpath imports for pnpm
    if (moduleName === 'styleq/transform-localize-style') {
        const styleqPath = path.resolve(projectRoot, 'node_modules/styleq/dist/transform-localize-style/index.js');
        if (fs.existsSync(styleqPath)) {
            return {
                filePath: styleqPath,
                type: 'sourceFile',
            };
        }
    }

    // Fall back to default resolver
    if (originalResolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
};

// 5. Wrap with NativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
