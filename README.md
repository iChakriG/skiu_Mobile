# Skiu Mobile

React Native (Expo) mobile app for the Skiu e‑commerce storefront. iOS and Android only. Connects to the same backend API and Supabase auth as the web app.

## Requirements

- Node.js 18+
- Expo Go (device/simulator) or EAS Build for production
- Backend API and Supabase project (see [skiu](../skiu) for the API)

## Setup

```bash
cd skiu_Mobile
npm install
cp .env.example .env
# Edit .env with your EXPO_PUBLIC_API_URL, EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
npm start
```

Then press `i` for iOS simulator or `a` for Android emulator, or scan the QR code with Expo Go.

## iOS local build (simulator / device)

**Xcode (required):** You must use the **full Xcode app** (install from the App Store), not only Command Line Tools. The iOS SDK (`iphoneos`) is only provided by Xcode.app. If you see `SDK "iphoneos" cannot be located` or glog configure errors, run:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Open Xcode once to accept the license if prompted. Then run `npm run ios:pod` again.

The iOS app also needs **CocoaPods** and installed pods. If you see `Unable to open base configuration reference file ... Pods-Skiu.debug.xcconfig`, do this once:

1. **Install Homebrew** (if you don’t have it): [brew.sh](https://brew.sh)  
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. **Install CocoaPods:**  
   ```bash
   brew install cocoapods
   ```
3. **Install iOS pods** (from `skiu_Mobile`):  
   ```bash
   npm run ios:pod
   ```
4. **Run the app:**  
   ```bash
   npm run ios
   ```

## Scripts

| Script          | Description                    |
| --------------- | ------------------------------ |
| `npm start`     | Start Expo dev server          |
| `npm run ios`   | Run on iOS simulator           |
| `npm run ios:pod` | Install iOS CocoaPods (run once if needed) |
| `npm run android` | Run on Android emulator      |

## Environment

See `.env.example`. Required:

- **EXPO_PUBLIC_API_URL** — Base URL of the e‑commerce API (e.g. `http://localhost:3000`)
- **EXPO_PUBLIC_SUPABASE_URL** — Supabase project URL (same as web app)
- **EXPO_PUBLIC_SUPABASE_ANON_KEY** — Supabase anon key (same as web app)

## Project structure (mobile)

```
skiu_Mobile/
├── App.tsx                 # Root component, AuthProvider + navigator
├── app.json                # Expo config (iOS/Android, EAS projectId)
├── eas.json                # EAS Build / Submit profiles
├── src/
│   ├── api/                # API client and endpoints (products, cart, orders)
│   ├── context/            # AuthContext (Supabase auth)
│   ├── lib/                # Supabase client
│   ├── navigation/         # React Navigation stack + screens
│   ├── screens/            # App screens (products, cart, orders, auth, settings)
│   └── types/              # Shared TypeScript types
└── assets/                # Images, fonts (if any)
```

## Features

- **Products** — List (grid) and detail, search
- **Auth** — Sign in / Sign up (Supabase), sign out in Settings
- **Cart** — View cart, add from product detail (requires sign-in)
- **Orders** — List and detail (requires sign-in)
- **Checkout** — Place order with shipping address

No admin features; use the web app for admin.

## EAS (Expo Application Services)

Project is linked to EAS via `app.json` → `expo.extra.eas.projectId`. Builds run in the cloud.

### First-time Android credentials (required for workflows)

EAS cannot generate a new Android keystore in non-interactive mode (e.g. when running the workflow or CI). You must create credentials once from your machine:

```bash
eas login
eas build --platform android --profile production
```

When prompted **"Generate a new Android Keystore?"** choose **Yes**. EAS will create and store the keystore. After that, workflow and non-interactive builds will reuse it.

Alternatively, set up credentials only (no full build):

```bash
eas credentials --platform android
# Follow prompts to generate a new keystore
```

**Deploy (build for iOS + Android):**

```bash
eas login
npm run build:eas
# or: eas build --platform all --profile production
```

For CI (e.g. no interactive login), set `EXPO_TOKEN` and run:

```bash
npm run deploy
```

Submit to stores after a successful build:

```bash
eas submit --platform ios --platform android
```

Build profiles (development, preview, production) are in `eas.json`.

**Run the production-builds workflow (Android + iOS in parallel):**

```bash
eas login
npx eas-cli@latest workflow:run create-production-builds.yml
```

The workflow is defined in `.eas/workflows/create-production-builds.yml`. After it starts, you’ll see it on the EAS Workflows page.
