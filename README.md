# 👗 AI Outfit Recommendation App

An AI-powered wardrobe assistant that helps users organize their closet and get personalized outfit recommendations.

[![CI](https://github.com/shabihhaider/outfit-app/actions/workflows/ci.yml/badge.svg)](https://github.com/shabihhaider/outfit-app/actions/workflows/ci.yml)

## ✨ Features

- 📸 **Smart Wardrobe** - Upload photos, AI automatically categorizes your clothes
- 🎨 **Color Analysis** - Get personalized color recommendations based on your skin tone
- 👔 **Daily Outfits** - Weather-aware outfit suggestions for any occasion
- 🛍️ **Smart Shopping** - Product recommendations that match your existing wardrobe
- 🔄 **Cross-Platform** - Available on iOS, Android, and Web

## 🎯 Current Status

### ✅ Completed (Sprint 1 - Task 1.1)
- ✅ Authentication Foundation
  - ✅ Supabase client configuration with platform-specific storage
  - ✅ Auth context provider with session management
  - ✅ Platform detection (Native: SecureStore, Web: AsyncStorage)
  - ✅ Welcome screen with routing
  - ✅ Form validation schemas (Zod)
  - ✅ TypeScript types for authentication
  - ✅ Error boundary and toast notifications
  - ✅ Expo Router v6 file-based routing
  - ✅ NativeWind v4 styling setup

### 🚧 In Progress
- 🔄 Authentication UI (Task 1.2)
  - Login screen
  - Registration screen
  - Password recovery

### 📋 Upcoming
- Profile management
- Wardrobe upload & categorization
- AI outfit recommendations
- Weather-aware suggestions

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Mobile** | React Native (Expo) |
| **Web** | Next.js 14 |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| **AI/ML** | Modal.com (FashionCLIP, Background Removal) |
| **Styling** | TailwindCSS / NativeWind |
| **Monorepo** | Turborepo + pnpm |

## 📂 Repository Structure

```
outfit-app/
├── apps/
│   ├── mobile/          # React Native app (Expo)
│   ├── web/             # Next.js web application
│   └── api/             # API routes (Vercel Edge Functions)
├── packages/
│   ├── ui/              # Shared UI components
│   ├── db/              # Supabase client & TypeScript types
│   ├── api-client/      # tRPC client
│   └── utils/           # Shared utilities
├── services/
│   └── ml/              # Python ML services (Modal.com)
└── docs/                # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (Recommended: 20.x LTS)
- **pnpm** 8+ - Install: `npm install -g pnpm`
- **Expo CLI** - Install: `npm install -g expo-cli`
- **Android Studio** (for Android development) or **Xcode** (for iOS development)
- **Python** 3.11+ (for ML services)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/outfit-app.git
cd outfit-app

# Install dependencies (this may take a few minutes)
pnpm install

# Set up environment variables
cp apps/mobile/.env.example apps/mobile/.env.local
# Edit apps/mobile/.env.local with your Supabase credentials:
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Development

**Mobile App:**
```bash
# Navigate to mobile app
cd apps/mobile

# Start Expo development server
npx expo start

# Options:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Press 'w' for web browser
# - Scan QR code with Expo Go app on your phone
```

**Web App:**
```bash
# Start web development server
pnpm dev --filter=@outfit/web

# Or from root:
cd apps/web
pnpm dev
```

**All Apps (Turborepo):**
```bash
# Start all apps simultaneously
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development servers |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript checks |
| `pnpm format` | Format code with Prettier |
| `pnpm clean` | Clean all build artifacts |

## 📖 Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed installation instructions
- [Contributing](./CONTRIBUTING.md) - How to contribute to this project
- [Sprint Planning](./docs/SPRINTS.md) - Development roadmap

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for required environment variables.

**Required for development:**
- Supabase URL and Anon Key
- (Optional) Anthropic API Key for AI features

## 👥 Team

- **Tech Lead** - Architecture & Code Review
- **Full Stack Developers** - Feature Development
- **ML Engineer** - AI/ML Pipeline

## 📄 License

This project is proprietary and confidential.

---

Built with ❤️ using React Native, Next.js, and Supabase