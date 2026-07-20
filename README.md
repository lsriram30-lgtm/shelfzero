# ShelfZero (React Native / Expo)

A React Native scaffold for ShelfZero, wired against the live backend at
`https://rs1ilxb2il.preview.c24.airoapp.ai`.

**New here or non-technical?** See [`TASKS.md`](./TASKS.md) for a plain-English
rundown of what's done, what's next, and a beginner glossary.

## Prerequisites

This machine did not have Node.js installed when this scaffold was generated, so
none of the commands below have been run yet. Before doing anything else:

1. Install Node.js LTS (20.x or newer) — https://nodejs.org, or via `winget install OpenJS.NodeJS.LTS`.
2. Install the Expo Go app on your phone (iOS/Android) if you want to test on a
   physical device, or set up an iOS Simulator / Android emulator.

## Getting started

```bash
npm install
npm start        # opens Expo dev tools — scan the QR code with Expo Go
npm run ios      # or: run on iOS simulator (macOS only)
npm run android  # or: run on Android emulator
```

## Project structure

```
App.tsx                     Root component: fonts, theme, navigation container
src/
  api/                       fetch-based client + one module per backend resource
  components/                Design-system primitives (Card, Button, Pill, TextField, ...)
  context/                   ThemeContext (dark mode), OnboardingContext
  hooks/                     Data hooks (usePantry, useShoppingList, useInvites, ...)
  navigation/                Stack/tab navigators, route types, deep-link config
  screens/                   One folder per feature area
  theme/                     Colors, typography, spacing tokens
  types/                     Shared TypeScript types matching the backend schema
```

## Backend wiring

The API base URL lives in `app.json` under `expo.extra.apiBaseUrl` and is read via
`expo-constants` in `src/api/client.ts`. Change it there (or override per-environment
with an EAS build profile) if the backend URL changes.

Every backend endpoint from the reference doc has a typed wrapper in `src/api/`:

| Module | Endpoints |
|---|---|
| `pantry.ts` | `GET/POST /api/pantry`, `PUT/DELETE /api/pantry/:id` |
| `shoppingList.ts` | `GET/POST /api/shopping-list`, `PATCH/DELETE /api/shopping-list/:id` |
| `invites.ts` | `GET/POST /api/invites`, `POST /api/invites/accept`, `DELETE /api/invites/:id` |
| `favorites.ts` | `GET/POST /api/favorites` |
| `mealPlan.ts` | `POST /api/meal-plan` |
| `scan.ts` | `POST /api/scan` |

## Known gaps / assumptions

- **No recipe list/search endpoint exists yet.** The Recipes screen derives
  suggested recipes by calling `POST /api/meal-plan` with current pantry item
  names and flattening the returned meals into recipe cards
  (`src/hooks/useSuggestedRecipes.ts`). Swap this for a real `/api/recipes`
  call once the backend adds one. Recipe detail data is passed through
  navigation params rather than re-fetched by ID, since there's no
  `GET /api/recipes/:id`.
- **Donate and notification preferences aren't backed by any endpoint** in the
  reference doc. The Household Hub screen shows a "Coming soon" donate card
  and local-only (non-persisted) notification toggles as placeholders.
- **Manual "Add item" flow** (`src/screens/pantry/AddPantryItemScreen.tsx`) is
  fully wired to `POST /api/pantry` — name, category, quantity, unit, expiry
  (with quick shortcuts), and notes.
- Onboarding profile and theme preference are persisted locally via
  `AsyncStorage` only (no backend endpoint for user profile was provided).
- App icon/splash image assets are not included — `app.json` omits an `icon`
  path so `expo start` doesn't fail on a missing file. Add real assets to
  `assets/` and reference them in `app.json` when you have brand artwork.

## Deep linking

`shelfzero://join/:token` and `https://shelfzero.app/join/:token` both route to
the Join screen, which calls `POST /api/invites/accept`. Update the `prefixes`
list in `src/navigation/linking.ts` once you have a real production domain.

## Design tokens

Colors, spacing, radii, and shadows are centralized in `src/theme/` and match
the design system reference (Coconut Cream background, Savory Sage primary,
Avocado Smoothie secondary, Blush Beet accent, Oat Latte borders, DM Sans
typography, 12–20px card radii / 100px pills).
