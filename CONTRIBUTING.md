# Contributing to Outfit App

Thank you for contributing to the Outfit App! This document outlines our development workflow and coding standards.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🚀 Getting Started

1. Read the [Setup Guide](./docs/SETUP.md)
2. Ensure all tests pass locally before making changes
3. Create a new branch for your work

## 🌲 Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New features | `feature/auth-screens` |
| `fix/` | Bug fixes | `fix/login-validation` |
| `refactor/` | Code refactoring | `refactor/wardrobe-api` |
| `docs/` | Documentation | `docs/api-reference` |
| `chore/` | Maintenance | `chore/update-deps` |

### Creating a Branch

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create your branch
git checkout -b feature/your-feature-name
```

## 📝 Code Standards

### TypeScript

- **Strict mode** is enabled - no implicit `any`
- Use interfaces for object shapes
- Export types from dedicated `.types.ts` files when shared

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
const user: any = { ... };
```

### Formatting

We use **Prettier** for consistent formatting.

```bash
# Check formatting
pnpm format:check

# Fix formatting issues
pnpm format
```

### Linting

We use **ESLint** with TypeScript rules.

```bash
# Run linter
pnpm lint
```

### File Organization

```
feature/
├── components/       # React components
│   ├── Button.tsx
│   └── Button.test.tsx
├── hooks/           # Custom hooks
│   └── useFeature.ts
├── utils/           # Helper functions
│   └── helpers.ts
└── types.ts         # TypeScript types
```

## 💬 Commit Guidelines

We follow a modified **Conventional Commits** format that ties to our Sprint planning.

### Format

```
Sprint X, Step Y: Short description

- Detailed change 1
- Detailed change 2
```

### Examples

```bash
# Feature
git commit -m "Sprint 1, Step 2: Implement login screen UI

- Add email and password input fields
- Add social login buttons (Google, Apple)
- Implement form validation with zod"

# Bug fix
git commit -m "Sprint 1, Fix: Resolve auth token refresh issue

- Fix race condition in token refresh
- Add retry logic for failed refreshes"

# Chore
git commit -m "Chore: Update dependencies to latest versions"
```

## 🔄 Pull Request Process

### Before Opening a PR

1. **Ensure CI passes locally:**
   ```bash
   pnpm format:check
   pnpm lint
   pnpm type-check
   ```

2. **Rebase on latest main:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

3. **Test your changes** manually on relevant platforms

### PR Title Format

```
Sprint X, Step Y: Brief description
```

### PR Description Template

Your PR description should include:

- **What** - Brief description of changes
- **Why** - Reason for the changes
- **How** - Implementation approach
- **Testing** - How you tested the changes
- **Screenshots** - If UI changes (mobile + web)

### Review Process

1. Open PR against `main` branch
2. Automated CI checks must pass
3. Request review from Tech Lead
4. Address feedback and update PR
5. Squash and merge once approved

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=@outfit/ui

# Run with coverage
pnpm test -- --coverage
```

## 📚 Additional Resources

- [Sprint Planning Document](./docs/SPRINTS.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)

---

Questions? Reach out to the Tech Lead or open a discussion on GitHub.