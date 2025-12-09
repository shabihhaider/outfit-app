# 🛠️ Developer Setup Guide

Complete guide to set up your development environment for the Outfit App.

**Estimated time:** 10-15 minutes

## 📋 Prerequisites

Before starting, ensure you have:

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| pnpm | 8+ | `npm install -g pnpm` |
| Python | 3.11+ | [python.org](https://python.org/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Optional (for mobile development)

| Tool | Purpose |
|------|---------|
| Xcode | iOS Simulator (Mac only) |
| Android Studio | Android Emulator |
| Expo Go | Physical device testing |

## 🚀 Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/shabihhaider/outfit-app.git
cd outfit-app

# Install all dependencies
pnpm install
```

**Expected output:**
```
Scope: all 8 workspace projects
...
Done in X.Xs
```

## 🔐 Step 2: Environment Setup

### 2.1 Get Credentials

Contact the **Tech Lead** for:
- Supabase Project URL
- Supabase Anon Key
- (Optional) Other API keys

### 2.2 Create Environment Files

```bash
# Copy template to web app
cp .env.example apps/web/.env.local

# Copy template to mobile app
cp .env.example apps/mobile/.env.local
```

### 2.3 Update Values

Edit both `.env.local` files and replace placeholder values:

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=actual-anon-key-here

# apps/mobile/.env.local
EXPO_PUBLIC_SUPABASE_URL=https://actual-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=actual-anon-key-here
```

## 🐍 Step 3: ML Services Setup (Optional)

Only needed if working on AI/ML features.

```bash
# Navigate to ML services
cd services/ml

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Authenticate with Modal
python -m modal setup
# Follow the browser prompt to log in

# Verify setup
modal run main.py::health_check
```

**Expected output:**
```
✅ GPU Detected: Tesla T4
{'status': 'healthy', 'gpu_available': True, ...}
```

Return to root when done:
```bash
cd ../..
```

## 🏃 Step 4: Run Development Server

```bash
# From root directory
pnpm dev
```

This starts:
- **Web app** at http://localhost:3000
- **Mobile app** via Expo (scan QR code)

### Running Individual Apps

```bash
# Web only
pnpm dev --filter=@outfit/web

# Mobile only
pnpm dev --filter=@outfit/mobile
```

## ✅ Step 5: Verify Setup

Run the quality checks:

```bash
# Should all pass with no errors
pnpm format:check
pnpm lint
pnpm type-check --filter=!@outfit/db
```

## 🔧 Troubleshooting

### "Module not found" errors

If you encounter "Unable to resolve module" errors, try these steps:

```bash
# 1. Clear all caches
cd apps/mobile
npx expo start --clear

# 2. If still failing, clear node_modules and reinstall
rm -rf node_modules
cd ../..
pnpm clean
pnpm install

# 3. Restart Metro bundler
cd apps/mobile
npx expo start --clear
```

**Common missing dependencies that may need manual installation:**
```bash
cd apps/mobile
pnpm add abort-controller stacktrace-parser @ungap/structured-clone \
  base64-js query-string nanoid fast-deep-equal regenerator-runtime
```

### Metro Config TypeScript Errors

If you see TypeScript errors in `metro.config.js`:

**Error:** "The inferred type of config cannot be named without a reference..."

**Solution:** For NativeWind v4, do NOT use `withNativeWind` wrapper:

```javascript
// ❌ Wrong (NativeWind v3 syntax)
const { withNativeWind } = require("nativewind/metro");
module.exports = withNativeWind(config, { input: "./global.css" });

// ✅ Correct (NativeWind v4 syntax)
module.exports = config;
```

The NativeWind preset should be in `tailwind.config.js` instead:
```javascript
// tailwind.config.js
presets: [require("nativewind/preset")]
```

### Supabase Storage Errors on Web

**Error:** "ExpoSecureStore.default.getValueWithKeyAsync is not a function"

**Cause:** `expo-secure-store` doesn't work on web platform.

**Solution:** This is already fixed in `lib/supabase.ts` with platform detection:
```typescript
// Platform-specific storage adapter
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        if (Platform.OS === "web") {
            return AsyncStorage.getItem(key);  // Web uses AsyncStorage
        }
        return SecureStore.getItemAsync(key);  // Native uses SecureStore
    },
    // ...
};
```

If you still see this error, ensure `@react-native-async-storage/async-storage` is installed:
```bash
cd apps/mobile
pnpm add @react-native-async-storage/async-storage
```

### Database types are missing

```bash
# Regenerate Supabase types
npx supabase login
npx supabase gen types typescript --project-id "your-project-id" --schema public > packages/db/database.types.ts
```

### Expo not starting

```bash
# Clear Expo cache
cd apps/mobile
npx expo start --clear
```

### Modal.com authentication failed

```bash
cd services/ml
.venv\Scripts\activate  # or source .venv/bin/activate
python -m modal setup   # Re-authenticate
```

### Port already in use (Port 8081)

**Problem:** Metro bundler can't start because port 8081 is in use.

**Solution:**

```bash
# Windows - Kill all Node processes
taskkill /F /IM node.exe /T

# macOS/Linux
killall node

# Then restart Expo
cd apps/mobile
npx expo start --clear
```

### NativeWind Styles Not Applying

**Problem:** Tailwind CSS classes not working.

**Checklist:**
1. ✅ `global.css` imported in `app/_layout.tsx`:
   ```typescript
   import "../global.css";
   ```

2. ✅ `tailwind.config.js` has NativeWind v4 preset:
   ```javascript
   presets: [require("nativewind/preset")]
   ```

3. ✅ Metro cache is cleared:
   ```bash
   npx expo start --clear
   ```

### Bundling Fails with Dependency Errors

If bundling fails with missing dependencies, they need to be installed in the mobile app:

```bash
cd apps/mobile

# Install the missing package
pnpm add <package-name>

# Clear cache and restart
npx expo start --clear
```

**Already Installed Dependencies (57 total):**
Core dependencies for React Native, Expo, Supabase, and NativeWind are pre-installed. If you encounter issues, verify all dependencies in `apps/mobile/package.json`.

## 📚 Next Steps

After setup is complete:

1. Read the [Contributing Guide](../CONTRIBUTING.md)
2. Review the [Sprint Planning Document](./SPRINTS.md)
3. Pick up your first task from the current sprint

## 🆘 Getting Help

- **Slack:** #outfit-app-dev channel
- **GitHub:** Open an issue with the `question` label
- **Tech Lead:** Direct message for urgent issues

---

Setup not working? Please open an issue with:
- Your operating system
- Error message (full output)
- Steps you've tried