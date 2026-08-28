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

- **Recipe suggestions still derive from meal-plan, not a browsable catalog.**
  The Recipes screen's suggested list calls `POST /api/meal-plan` with
  current pantry item names and flattens the returned meals into recipe
  cards (`src/hooks/useSuggestedRecipes.ts`). A real `GET /api/recipes?q=`
  search endpoint exists and powers the explicit "Search all recipes"
  action, but there's still no general catalog endpoint to swap the
  suggestions list onto, and recipe detail data is passed through
  navigation params rather than re-fetched by ID, since there's still no
  `GET /api/recipes/:id`.
- **Donations are backed by a real endpoint** (household-scoped
  `POST`/`GET /api/donations`, `src/api/donations.ts`). Notification
  preferences (expiry/invite toggles) have no backend endpoint — they're
  persisted locally per-account via AsyncStorage
  (`NotificationPreferencesContext`) and gate real local notification
  scheduling, not just placeholder UI state.
- **Manual "Add item" flow** (`src/screens/pantry/AddPantryItemScreen.tsx`) is
  fully wired to `POST /api/pantry` — name, category, quantity, unit, expiry
  (with quick shortcuts), and notes.
- Onboarding profile and theme preference are persisted locally via
  `AsyncStorage` only (no backend endpoint for user profile was provided).

## Deep linking

`shelfzero://join/:token` and `https://shelfzero.app/join/:token` both route to
the Join screen, which calls `POST /api/invites/accept`. Update the `prefixes`
list in `src/navigation/linking.ts` once you have a real production domain.

## Building for TestFlight / production

`eas.json` defines three build profiles:

| Profile | Use for | `__DEV__` |
|---|---|---|
| `development` | A dev client for local testing (`developmentClient: true`) | `true` |
| `preview` | Internal/ad-hoc testing builds, not through the App Store | `false` |
| `production` | The real App Store / TestFlight submission | `false` |

**Always use `production` for an actual TestFlight build.** Testing-only UI
(the "Reset app" button on Profile, "send test notification" on
Notifications) is gated behind `__DEV__` in the code — that gate only holds
if the build itself is a real release build. A `development`-profile build
would leave those visible.

```bash
npm run build:preview      # internal testing build
npm run build:production   # TestFlight / App Store build
```

The EAS project is already linked (`app.json`'s `extra.eas.projectId`, under
the `laasyass-team` account) — `eas login` with an account that has access
to that team is all that's needed before building.

### Distribution method for beta testing

**Recommendation: TestFlight (iOS) + Google Play's Internal Testing track
(Android), not Expo Go, once there's a real group of testers beyond
whoever's actively developing.**

Expo Go is the right tool for the current dev loop (instant reload, no
build/upload wait) but a poor fit for actual beta distribution:

- Every tester needs Expo Go installed, then has to manually paste a link
  that changes each time the dev server restarts and stops working the
  moment the developer's phone/computer switches networks (this happened
  more than once during this project's own testing sessions).
- Expo Go always shows its own icon/splash screen, never the real app's —
  testers can't evaluate what the app will actually look/feel like.
- Push/local notifications are only partially supported in Expo Go as of
  SDK 53+ (confirmed while building the notifications feature — see the
  `expo-notifications` warnings logged at startup); a real build is the
  only way to test that feature properly.
- Dev-only UI (the `__DEV__`-gated "Reset app" and "send test notification"
  buttons) is only actually hidden in a real release build, so Expo Go
  testing can't validate what a production build looks like.

TestFlight and Google Play's Internal Testing are both effectively free to
start at this scale and don't require going through a full store review:

| | TestFlight (iOS) | Play Internal Testing (Android) |
|---|---|---|
| Cost | Apple Developer Program, $99/year | Google Play Developer, $25 one-time |
| Testers (no review needed) | Up to 100, added by email | Up to 100, via a shareable opt-in link |
| Review wait | None for internal testing | None |
| What testers install | The real TestFlight app, then the real build | The real app directly, no separate app needed |

**Concrete next steps**, building on the EAS setup above:

1. Whoever will own this needs an Apple Developer Program membership and a
   Google Play Developer account (one-time setup, real money, so this is a
   deliberate decision for a person to make, not something to automate).
2. `eas login` / `eas init` (already noted above) to link the EAS project.
3. Configure `eas submit` credentials for each store (an App Store Connect
   API key for Apple; a service account JSON key for Google) — `eas submit
   --platform ios` / `--platform android` walks through generating these
   interactively the first time.
4. `npm run build:production`, then `eas submit` to each store's internal
   testing track, and add testers by email (TestFlight) or via the
   internal-testing opt-in link (Play).

Once there's a reason to go beyond ~100 known testers, TestFlight's
external testing (up to 10,000, but requires a first-time Apple review,
typically 1–2 days) or Play's Closed/Open testing tracks are the next step
up — not needed yet at this project's current stage.

## Design tokens

Colors, spacing, radii, and shadows are centralized in `src/theme/` and match
the design system reference (Coconut Cream background, Savory Sage primary,
Avocado Smoothie secondary, Blush Beet accent, Oat Latte borders, DM Sans
typography, 12–20px card radii / 100px pills).
