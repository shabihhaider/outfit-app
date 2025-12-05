# 👗 AI Outfit Recommendation App

An AI-powered wardrobe assistant that helps users organize their closet and get personalized outfit recommendations.

[![CI](https://github.com/shabihhaider/outfit-app/actions/workflows/ci.yml/badge.svg)](https://github.com/shabihhaider/outfit-app/actions/workflows/ci.yml)

## ✨ Features

- 📸 **Smart Wardrobe** - Upload photos, AI automatically categorizes your clothes
- 🎨 **Color Analysis** - Get personalized color recommendations based on your skin tone
- 👔 **Daily Outfits** - Weather-aware outfit suggestions for any occasion
- 🛍️ **Smart Shopping** - Product recommendations that match your existing wardrobe
- 🔄 **Cross-Platform** - Available on iOS, Android, and Web

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

- Node.js 20+
- pnpm 8+ (`npm install -g pnpm`)
- Python 3.11+ (for ML services)

### Installation

```bash
# Clone the repository
git clone https://github.com/shabihhaider/outfit-app.git
cd outfit-app

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example apps/web/.env.local
cp .env.example apps/mobile/.env.local
# Edit the .env.local files with your actual credentials
```

### Development

```bash
# Start all apps (web + mobile)
pnpm dev

# Start specific app
pnpm dev --filter=@outfit/web
pnpm dev --filter=@outfit/mobile
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