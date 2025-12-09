# Task 1.1 Testing Checklist

## 🎯 What We Built

✅ **Authentication Context** - Manages user auth state across the app
✅ **Validation Schemas** - Zod schemas for email, password, username
✅ **Error Boundary** - Catches crashes and shows fallback UI
✅ **Auth Hooks** - `useAuth()` for accessing auth state
✅ **Supabase Integration** - Session management with Expo Secure Store
✅ **Toast Notifications** - Ready for success/error messages

---

## 📱 Testing Instructions

### Prerequisites
- ☐ Expo server is running (`npx expo start`)
- ☐ You have Expo Go app installed on your phone, OR
- ☐ You have Android/iOS emulator running

---

## Test 1: ✅ App Starts Without Errors

**Expected Result:**
- App loads without crashing
- Welcome screen appears
- No red error screens

**How to Test:**
1. Open app on device/emulator
2. Wait for app to load
3. Check terminal for logs

**Success Criteria:**
- ✅ App shows "Outfit App" welcome screen
- ✅ Terminal shows: `Auth state changed: INITIAL null`
- ✅ No error messages

---

## Test 2: ✅ Auth State Detection

**Expected Result:**
- App detects you're not logged in
- Automatically redirects to Welcome screen
- Loading screen appears briefly

**How to Test:**
1. Launch app
2. Watch for loading indicator
3. Observe redirect to Welcome

**Success Criteria:**
- ✅ Brief loading spinner appears
- ✅ Redirects to Welcome screen (not tabs)
- ✅ Terminal logs: `Auth state changed: INITIAL null`

---

## Test 3: ✅ Navigation Works

**Expected Result:**
- Buttons navigate to correct screens
- Can go back to Welcome

**How to Test:**
1. Tap "Get Started" button
2. Should see "Register Screen" placeholder
3. Go back (swipe or back button)
4. Tap "I already have an account"
5. Should see "Login Screen" placeholder

**Success Criteria:**
- ✅ "Get Started" → Register Screen
- ✅ "I already have an account" → Login Screen
- ✅ Back navigation works
- ✅ No crashes

---

## Test 4: ✅ Error Boundary Catches Crashes

**Expected Result:**
- If component crashes, Error Boundary shows fallback UI
- "Try Again" button resets error

**How to Test:**
We'll test this in Task 1.2 when we have forms that can fail.

For now, check:
- ✅ No unexpected crashes occur
- ✅ App is wrapped in ErrorBoundary (check `app/_layout.tsx`)

---

## Test 5: ✅ Validation Schemas Work

**Expected Result:**
- Validation functions exist
- Can validate email, password, username

**How to Test:**
Run the test file I created:

```bash
# From apps/mobile directory
npx tsx __tests__/auth.test.ts
```

**Success Criteria:**
- ✅ All validation tests pass
- ✅ Valid inputs are accepted
- ✅ Invalid inputs are rejected

---

## Test 6: ✅ Auth Context Provides Functions

**Expected Result:**
- `useAuth()` hook is available
- Provides: `signUp`, `signIn`, `signOut`, `resetPassword`

**How to Test:**
Check in React DevTools or add console.log in Welcome screen:

```tsx
// Temporary test code in app/(auth)/welcome.tsx
import { useAuth } from "../../../contexts/AuthContext";

export default function WelcomeScreen() {
  const auth = useAuth();
  console.log("Auth functions available:", {
    hasSignUp: typeof auth.signUp === 'function',
    hasSignIn: typeof auth.signIn === 'function',
    hasSignOut: typeof auth.signOut === 'function',
    hasResetPassword: typeof auth.resetPassword === 'function',
  });
  // ... rest of component
}
```

**Success Criteria:**
- ✅ All auth functions are available
- ✅ No TypeScript errors
- ✅ Console shows all functions = true

---

## Test 7: ✅ Supabase Client Works

**Expected Result:**
- Supabase client is configured
- Environment variables load correctly

**How to Test:**
Check terminal output when app starts:

```
env: load .env.local
env: export EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY
```

**Success Criteria:**
- ✅ Environment variables are loaded
- ✅ No Supabase connection errors
- ✅ Can import `{ supabase }` from '../lib/supabase'

---

## Test 8: ✅ Toast Notifications Setup

**Expected Result:**
- Toast component is rendered
- Ready to show notifications (will test in Task 1.2)

**How to Test:**
Check that `<Toast />` is in `app/_layout.tsx`:

```tsx
<Toast />
```

**Success Criteria:**
- ✅ Toast component is in layout
- ✅ No import errors
- ✅ App renders without issues

---

## Test 9: ✅ TypeScript Types Work

**Expected Result:**
- No TypeScript errors in IDE
- All imports resolve correctly

**How to Test:**
Run type check:

```bash
cd apps/mobile
npx tsc --noEmit
```

**Success Criteria:**
- ✅ Zero TypeScript errors
- ✅ All imports resolve
- ✅ Zod types infer correctly

---

## Test 10: ✅ Splash Screen Behavior

**Expected Result:**
- Splash screen shows while loading auth state
- Hides after auth is initialized

**How to Test:**
1. Close and reopen app
2. Watch for splash screen
3. Should disappear after ~1 second

**Success Criteria:**
- ✅ Splash screen appears on launch
- ✅ Disappears after auth loads
- ✅ No flashing/flickering

---

## 🐛 Common Issues & Fixes

### Issue: Metro bundler cache errors
**Fix:** Run `npx expo start --clear`

### Issue: TypeScript errors in IDE
**Fix:** Reload VSCode window: Ctrl+Shift+P → "Reload Window"

### Issue: Module not found errors
**Fix:**
```bash
cd apps/mobile
pnpm install
cd ../..
pnpm install
```

### Issue: Expo Go can't connect
**Fix:**
- Ensure phone and computer are on same WiFi
- Check firewall isn't blocking port 8081

---

## ✅ Task 1.1 Complete When:

- ☐ App starts without errors
- ☐ Welcome screen appears
- ☐ Navigation works (Welcome → Login/Register)
- ☐ Auth context is available via `useAuth()`
- ☐ Validation schemas exist and work
- ☐ Error boundary is in place
- ☐ TypeScript has zero errors
- ☐ Environment variables load correctly
- ☐ Toast component is rendered
- ☐ Splash screen behavior is correct

---

## 📊 Test Results

Fill this in as you test:

| Test | Status | Notes |
|------|--------|-------|
| App Starts | ☐ Pass / ☐ Fail | |
| Auth State Detection | ☐ Pass / ☐ Fail | |
| Navigation | ☐ Pass / ☐ Fail | |
| Error Boundary | ☐ Pass / ☐ Fail | |
| Validation Schemas | ☐ Pass / ☐ Fail | |
| Auth Context | ☐ Pass / ☐ Fail | |
| Supabase Client | ☐ Pass / ☐ Fail | |
| Toast Setup | ☐ Pass / ☐ Fail | |
| TypeScript | ☐ Pass / ☐ Fail | |
| Splash Screen | ☐ Pass / ☐ Fail | |

---

## 🚀 Next Steps

Once all tests pass:
- Move to **Task 1.2: Auth UI Screens**
- Implement login/register forms
- Add real authentication flows
- Test actual sign up/sign in

---

**Ready to proceed?** Let me know if any tests fail and I'll help debug!