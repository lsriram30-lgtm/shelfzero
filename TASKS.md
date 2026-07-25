# ShelfZero — Project Tasks

**Repo:** https://github.com/lsriram30-lgtm/shelfzero
**What this is:** A phone app (for iPhone and Android) that helps a household track pantry
items, plan meals, and manage a shared shopping list — so less food gets thrown out.

This file is a plain-English list of what's done and what's left. Check boxes off as work
gets finished (edit this file, save, and push the change — see "How to update this file"
at the bottom).

---

## Done so far

- [x] Built out the app's screens: pantry list, add/scan items, recipes, meal planner,
      shopping list, household sharing, and account setup
- [x] Connected the app to the real backend (the server that stores your data)
- [x] Fixed startup errors in the code so the app actually builds and runs
- [x] Upgraded the app to match the version of the Expo Go app on your phone (this is
      why it wasn't opening before — versions have to match)
- [x] Fixed content getting hidden under the phone's notch / status bar
- [x] Put the code on GitHub, so changes are saved and multiple people can work on it
- [x] Added Laya as a collaborator on the GitHub repo, and set up separate branches
      so Laasya and Laya can each work on their own task at the same time

## Up next

**Who's who:** pink = Laasya, green = Laya

![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) ![Laya](https://img.shields.io/badge/Laya-B5EAD7)

Check the box when a task is done. The color badge stays next to it, so whoever
didn't do it can tell at a glance "oh, they finished that" and go review it.

### This week's progress

**Goal:** 10 tasks each by end of day 7/25.

| | Completed |
|---|---|
| ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) | 7 / 10 |
| ![Laya](https://img.shields.io/badge/Laya-B5EAD7) | 10 / 10 |

### Currently assigned

- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add more cuisine options
      and other choices to the onboarding questionnaire, and simplify/clean up the
      questionnaire flow (branch: `feature/questionnaire-cleanup`) — merged into `master`
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Clean up the overall look and
      feel of the app: spacing, colors, and a general polish pass
      (branch: `feature/app-polish`) — merged into `master`
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Build the "donate leftover food"
      feature (branch: `feature/donate-surplus`) — merged into `master`. Note: no backend
      endpoint exists for this yet, so it's a self-contained flow (pick expiring items,
      pick a placeholder partner, confirm) that removes items from the pantry for real
      and keeps a local donation history.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Audit every settings-style
      control in the app and confirm they persist across app re-entries (branch:
      `feature/notification-persistence`) — merged into `master`. Checked
      appearance/theme, onboarding profile, donation history, and the Household Hub
      notification toggles; the first three already persisted, the notification
      toggles were the only ones resetting on reload, so those now persist locally
      the same way (AsyncStorage).
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) (quick fix) Refine what
      the Dashboard shows when the pantry is empty (branch:
      `feature/dashboard-empty-state`) — merged into `master`. Replaced the
      misleading "100% Pantry health" ring with a proper empty-state prompt to
      add your first item.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add real sign-in/sign-up and
      fix the app-wide "401 Unauthorized" errors (branch: `feature/mobile-auth`, PR #2)
      — merged into `master` by Laya. The backend (GoDaddy's Airo AI Builder) requires
      login for every request, but the app never had one. Sign-up is now the
      questionnaire's first question (email + password only), rest unchanged; choosing
      "sign in" instead skips the rest of the questionnaire. Also bundled in: fixed
      403s caused by new accounts having no household (now auto-created), fixed the
      broken Household Hub invite link (resolves that task too), allowed pantry items
      to be added/edited/deleted, and fixed the Recipes tab crash. On top of that,
      added password-field polish (show/hide icon, confirm-password on sign-up,
      friendlier error messages, a fix for fields getting stuck under the phone's
      autofill suggestions, and email-format validation) and a "create new account
      anyway" option when an email's already taken.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) (quick fix) Set up
      GitHub Actions to automatically check the code on every push or Pull
      Request, so TypeScript type errors get caught before merging (branch:
      `feature/ci-actions`) — merged into `master`. Installs dependencies and
      runs the check; no automated tests exist yet to run alongside it.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Show a real error message
      (with "try again") when the app can't reach the server (branch:
      `feature/laya-app-improvements`) — merged into `master`. Added a shared
      `ErrorState` component
      and wired it into Dashboard, Pantry, Recipes, Meal Planner, and the
      Household Hub (invites + shopping list) — a failed connection now shows
      a clear message and a retry button instead of looking like an empty screen.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Audit every screen so loading,
      empty, and error states are each shown correctly (branch:
      `feature/laya-app-improvements`) — merged into `master`. Same pass as the
      error-message task above, covering the same set of screens.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add pull-to-refresh on the
      pantry and shopping list screens (branch: `feature/laya-app-improvements`)
      — merged into `master`. Pantry already had it; added it to the Household
      Hub's shopping list and invites sections too.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Let the pantry list be
      sorted/filtered by expiry date (branch: `feature/laya-app-improvements`)
      — merged into `master`. Added a Category / Expiry date toggle to the
      Pantry screen; Expiry date shows a flat list with soonest-expiring
      items first.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Auto-add an item to the
      shopping list when its pantry quantity hits zero (branch:
      `feature/laya-app-improvements`) — merged into `master`. Editing an
      item's quantity down to 0 now adds it to the shopping list automatically
      (quantity 0 was previously blocked by form validation, so that's relaxed
      for edits only — adding a brand-new item still requires quantity > 0).
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Bring more of the color palette
      (Blush Beet, Peach Protein) into the app's look (branch:
      `feature/laya-app-improvements`) — merged into `master`. Added a "Peach
      Protein" token (it didn't exist yet) and gave Pill a `highlight` tone;
      used it for the Dashboard's "USE IT UP" badge and cycled the Pantry
      Stats category bars through primary/Blush Beet/Peach Protein/secondary
      instead of one flat color.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add an offline/cached view
      that shows the last-known pantry state when the server can't be reached
      (branch: `feature/laya-app-improvements`) — merged into `master`. Pantry
      fetches are now cached to AsyncStorage on success; on a failed fetch,
      the cached list is shown with a "Showing last synced data" banner
      (Dashboard and Pantry) instead of a blank/error screen.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Make notifications actually
      get sent (branch: `feature/laya-app-improvements`) — merged into
      `master`. Installed `expo-notifications`; turning on either toggle now
      requests OS
      notification permission. Expiry reminders are locally scheduled (one per
      pantry item expiring within 3 days, timed for 9am 3 days before it
      expires, or shortly if already in that window) and kept in sync as the
      pantry changes. Invite alerts fire a local notification when a pending
      invite you sent flips to accepted. Note: this is local/client-side
      scheduling, not a push server — the app has to have run recently enough
      for the OS to have the reminder queued; a real push setup would need a
      backend to trigger notifications when the app isn't running at all.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add automated tests
      — right now there weren't any, so the only way to catch something broken
      was clicking through the app by hand (branch: `feature/automated-tests`)
      — merged into `master`. Added Jest (`jest-expo` preset) with 29 tests
      covering email validation, the pantry category/expiry-sort/days-until
      logic, dashboard health scoring, and the API client's error handling
      (bad responses, 401 token clearing, auth headers). Wired `npm test` into
      the GitHub Actions workflow alongside the typecheck. Two pure-logic
      modules (`pantryLogic.ts`, `dashboardLogic.ts`) were split out of their
      screen files so tests can import them without pulling in React
      Native/Expo UI code — no behavior change, same functions, just moved.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Validate the
      expiry-date field when adding or editing a pantry item (branch:
      `feature/expiry-date-validation`) — merged into `master`. It was a raw
      text box with no format checking, so a malformed date silently broke
      the days-until-expiry math elsewhere (a literal "NaNd left" badge,
      items miscounted in the health score, or dropped from "expiring soon").
      Replaced it with three numeric-only MM/DD/YYYY fields; submit is
      blocked with an inline error unless they form a real calendar date
      (correctly rejects things like Feb 30). Added 17 tests for the new
      date-combination logic, bringing the test suite to 46 total.

### Not yet assigned

- [ ] Improve the receipt scanning feature so it reads receipts more reliably
- [ ] Add a real "search recipes" feature — right now suggested recipes are a workaround
      since the backend doesn't have a proper recipe search yet
- [ ] Add a real backend for the donation feature (right now it's local-only, with
      no server endpoint or actual donation partner behind it)
- [ ] Add a real app icon and splash screen image (using a placeholder right now)
- [ ] Pick a real web domain for shareable invite links (currently a placeholder one)
- [ ] Test the full app on an actual Android phone and an actual iPhone
- [ ] Add a way to remove a household member, or leave a household yourself —
      right now you can invite people, but once someone's a member there's no
      way to remove them or leave
- [ ] Refine the app's icon visuals and general look so it feels more polished
      and professional overall
- [ ] Add a forgot-password / reset-password flow (sign-up and sign-in exist now,
      but there's no way to recover an account if someone forgets their password)
- [ ] Add household member roles (e.g. owner vs. member) — relevant once the
      "remove a member" task above exists, since removing people needs some
      notion of who's allowed to do it
- [ ] Add a "clear checked items" bulk action to the Household Hub shopping
      list — right now there's no way to clear things out once they're
      checked off, they just sit there with a strikethrough
- [ ] Add a search/filter box to the Pantry screen — right now there's no way
      to filter the list by name, only scrolling through category groups
- [ ] Save the generated meal plan so it doesn't disappear when you navigate
      away — right now "Generate 7-day plan" produces a real plan but it's
      never persisted
- [ ] Add an "add ingredients to shopping list" action on a planned meal —
      right now meals in the plan are just display-only, with no way to turn
      one into shopping list items
- [ ] Add a cuisine filter to the Recipes screen — right now onboarding
      collects a cuisine preference, but it isn't used to filter or sort the
      Recipes screen at all

---

## How to open the app on your phone

The app runs from a developer's computer while it's being built (this is normal for
apps still in progress — it's not live in the App Store yet). To open it:

1. Install the **Expo Go** app from the App Store or Google Play.
2. Ask whoever has the project open on their computer to run `npm start` and share the
   link it prints (it looks like `exp://something.exp.direct` or `exp://192.168.x.x:8081`).
3. Open Expo Go, tap **"Enter URL manually"**, and paste that link.

This link changes each time the app is restarted, so there's no single permanent link
to bookmark yet — that only happens once the app is published to the app stores.

## Beginner glossary

| Term | What it means |
|---|---|
| **Repo** (repository) | The project's folder, saved on GitHub so everyone has the same copy |
| **Commit** | A saved snapshot of changes, with a short note describing what changed |
| **Push** | Sending your saved commits up to GitHub so others can see them |
| **Pull** | Downloading the latest changes other people pushed |
| **Branch** | A separate copy of the project to try changes safely, without affecting everyone else |
| **Expo Go** | The app on your phone that lets you preview this project without installing it properly |
| **SDK version** | The "toolkit version" the app is built with — has to match between the code and Expo Go |
| **Backend** | The server that stores and manages your pantry/shopping data |
| **Pull Request (PR)** | A request to merge one branch's changes into `master`, so someone can review before it's official |
| **Automated tests** | Small scripts that check parts of the app still work correctly, without manually clicking through it |
| **CI** (Continuous Integration, e.g. GitHub Actions) | A robot that automatically re-checks the code every time it's pushed or a Pull Request is opened |

## How to update this file

1. On GitHub, open `TASKS.md` and click the pencil (edit) icon.
2. Change `- [ ]` to `- [x]` next to a finished task (or the reverse to un-finish one).
   Leave the colored name badge as-is — that's how the other person knows whose task
   it was, even after it's checked off.
3. Scroll down, add a short note of what you did, and click **"Commit changes"**.

If you're working from your own branch instead of editing on GitHub directly, just
check the box in your local copy of `TASKS.md`, commit it along with your other
changes, and it'll show up once your Pull Request is merged into `master`.
