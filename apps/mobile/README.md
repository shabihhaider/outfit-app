# Outfit App (Mobile)

## Setup & Configuration

### Prerequisites
1.  **Node.js** & **pnpm** installed.
2.  **Supabase Account** with a new project.

### Environment Variables
Create a `.env.local` file in `apps/mobile/`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Setup (Critical)

#### 1. Authentication
*   Enable **Email Provider**.
*   (Optional) Disable "Confirm Email" for easier development testing.

#### 2. Database Schema
Run this SQL in your Supabase SQL Editor to support the Profile features:

```sql
-- Create Profiles table if it doesn't exist (or add columns)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text unique,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);
```

#### 3. Storage
*   Create a bucket named **`avatars`**.
*   Add these **RLS Policies** to the Storage bucket (Storage -> Policies):
    *   **Give users access to own folder**:
        *   Allowed operations: SELECT, INSERT, UPDATE, DELETE
        *   Target roles: authenticated
        *   Bucket: avatars
        *   Policy definition: `(bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)`
    *   **Public Read** (Optional for simpler setups):
        *   Allowed operations: SELECT
        *   Target roles: public/anon

## Features Implemented
*   **Authentication**: Login, Register, Forgot Password, Sign Out (with navigation redirects).
*   **Deep Linking**: Configured scheme `outfitapp://` for password resets and redirection.
*   **Profile Management**: View Profile, Edit details (Username, Bio, Name), Email Verification Banner.
*   **Avatar Upload**: Supports Camera & Gallery.
    *   *Note*: Uses `fetch` for Web and `expo-file-system/legacy` for Mobile to handle upload compatibility.

## Running the App
```bash
# Start Metro Bundler
npx expo start

# Run on Web directly
npx expo start --web

## Testing Deep Links
To test deep links on Android Emulator:
```bash
npx uri-scheme open outfitapp://reset-password --android
```

