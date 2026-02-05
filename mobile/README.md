# Skiu Mobile App

React Native (Expo) app for browsing products, cart, and orders. Consumes the REST API from the web app.

## Setup

```bash
# From repo root (with workspaces)
npm install
npm run mobile

# Or from this folder
cd apps/mobile
npm install
npm start
```

Set `EXPO_PUBLIC_API_URL` in `.env` (e.g. `http://localhost:3000` or your deployed web API URL).

## Scripts

- `npm start` — Start Expo dev server
- `npm run ios` — Run on iOS simulator
- `npm run android` — Run on Android emulator

See this folder’s original README for more detail.
