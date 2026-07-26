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

**Goal:** 20 tasks each (total) by end of day 8/1.

| | Completed |
|---|---|
| ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) | 14 / 20 |
| ![Laya](https://img.shields.io/badge/Laya-B5EAD7) | 10 / 20 |

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
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Refine what
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
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Set up
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
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Correct Peach
      Protein's hex and use it/Blush Beet in a couple more places (branch:
      `feature/palette-colors`) — merged into `master`. The coded value
      (`#EFA36B`) didn't match the real design reference (`#EFD7CF`, a
      much paler peach); updated light mode to the correct value and
      derived a dark-mode variant (`#D7BDBA`) for contrast. Since the new
      color is pale, it's no longer safe as plain text — swapped the
      Recipes screen's match-score text for a `Pill` with `tone="highlight"`
      instead (dark text over the tone color, same safe pattern used
      elsewhere). Also gave the onboarding progress bar's active segments
      Blush Beet instead of the primary color.
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
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a "clear
      checked items" bulk action to the Household Hub shopping list (branch:
      `feature/shopping-list-clear-checked`) — merged into `master`. There
      was no bulk action at all; checked items just sat there with a
      strikethrough. Added a "Clear checked" link to the shopping list card
      header (shown only when something's checked), gated behind a confirm
      dialog matching the existing cancel-invite pattern.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a
      search/filter box to the Pantry screen (branch:
      `feature/pantry-search-filter`) — merged into `master`. There was no
      way to filter the list by name, only scrolling through category
      groups. Added a case-insensitive `filterByName` helper and wired a
      search field above the sort controls; both the category and
      expiry-date views filter through it, with separate messaging for a
      genuinely empty pantry vs. "no items match this search." Added 5
      tests, bringing the suite to 51 total.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a
      breakfast/lunch/dinner filter to the Recipes screen (branch:
      `feature/recipes-mealtype-filter`) — merged into `master`. Unlike
      cuisine, this was real data already returned by the meal-plan API
      (`meal.label`), just discarded when converting meals into recipes.
      Carried it through as `Recipe.mealType` and added filter pills above
      the grid; favorited recipes without a meal type (they don't come from
      the meal-plan response) simply won't match a specific filter. Added
      7 tests, bringing the suite to 58 total.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Let profile
      info be edited after onboarding (branch: `feature/edit-profile`) —
      merged into `master`. Name, location, household size, and
      cuisine/dietary prefs were read-only; the only way to change any of
      it was "Reset app (testing)," which wipes everything and signs you
      out. Added an EditProfile screen off Profile's "About you" card,
      reusing the same building blocks as onboarding (GroupedPillGrid,
      PillGrid, CustomOptionField, toggleValue) without the wizard chrome.
      No backend involved — the onboarding profile is AsyncStorage-only.
      Added 5 tests for `toggleValue`, which had none; suite is now 63
      total.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Save the
      generated meal plan so it doesn't disappear when you navigate away
      (branch: `feature/mealplan-persistence`) — merged into `master`.
      "Generate 7-day plan" produced a real plan but it was never
      persisted. Cached it to AsyncStorage on generate and loaded it back
      on mount, same pattern as the pantry offline cache. No backend
      involved.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Send meal-plan
      preferences and flag when a cached plan is stale (branch:
      `feature/mealplan-prefs-and-staleness`) — merged into `master`. Two
      related fixes: (1) `mealPlanApi.generate()` only ever sent pantry
      item names — `cuisinePrefs`/`dietaryPrefs`/`allergies` from
      onboarding are now sent too via the request's previously-unused
      `preferences` field, though whether the backend's generator
      actually honors them is unverified; (2) the persisted plan (see the
      task above) never accounted for the pantry changing after it was
      generated, so a warning banner with "Regenerate now" / "Leave as
      is" actions now appears when the current pantry no longer matches
      what the plan was built from. Added 10 tests, bringing the suite to
      73 total. Note: testing in Expo Go hit a `429` on
      `/api/meal-plan` ("AI service is busy"), so the actual generate
      flow itself is still unverified end to end — see the follow-up task
      below.

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
- [ ] Add an "add ingredients to shopping list" action on a planned meal —
      right now meals in the plan are just display-only, with no way to turn
      one into shopping list items. Turns out to be lower-value than it
      looks: since the meal plan is generated from the current pantry,
      most of a suggested meal's ingredients should already be on hand —
      the useful version of this feature is surfacing just the gap (the
      1-2 things you don't have), not the whole ingredient list. That's
      not buildable today: a meal's `ingredients` field is just the raw
      description text, not a parsed list, so there's nothing to diff
      against pantry contents. Revisit once the backend returns real
      structured ingredients per meal.
- [ ] Add a cuisine filter to the Recipes screen — right now onboarding
      collects a cuisine preference, but it isn't used to filter or sort the
      Recipes screen at all. Blocked on the "tag each meal with its cuisine"
      backend task below: recipes have no cuisine field today, and guessing
      one from title keywords would misclassify anything with a generic
      name, so this is on hold until that data actually exists.
- [ ] Have the meal-plan generator tag each meal with its cuisine (e.g.
      "Italian," "Thai") in the `/api/meal-plan` response — a backend
      change, the same way it already returns `title` and `description`.
      Whatever generates a meal like "Pad Thai" already implicitly knows
      its cuisine — it's just not returned today. Once it exists, a real
      (non-guessed) cuisine filter becomes possible on the Recipes screen.
- [ ] Add a "select all" / bulk-check option to the shopping list — pairs
      with the "clear checked" action, but right now items can only be
      checked off one at a time
- [ ] Add quantity +/- controls to shopping list items instead of just
      add/remove — worth double-checking first whether
      `PATCH /api/shopping-list/:id` accepts a `quantity` field, since
      today it's only ever called with `{ checked }`
- [ ] Show a brief "N items cleared — Undo" toast after clearing checked
      shopping list items, instead of just silently removing them
- [ ] Let individual pantry items opt out of the "auto-add to shopping
      list on zero stock" behavior — a one-time buy like a specialty
      ingredient or a gift basket item shouldn't keep landing back on the
      shopping list every time it's used up. Default should stay on for
      everything else; a global Settings toggle to flip that default could
      come later if needed.
- [ ] Add an edit step to the Scan review flow — after scanning, results
      show as read-only cards with no way to fix a misread name, wrong
      category, or missing expiry before adding them to the pantry.
- [ ] Make the category bars on Pantry Stats tappable, jumping to that
      category on the Pantry screen (which already has search/filter) —
      right now the two screens don't talk to each other.
- [ ] Explain the "Health score" (Dashboard and Pantry Stats) — it's just
      a bare percentage ring with no explanation of what it measures (%
      of items not expiring within 3 days) or what to do about it. Add an
      explanation, and when it's below some "good" threshold, actionable
      guidance (e.g. which items are dragging it down and what to do with
      them) instead of just a number.
- [ ] Fix or relabel "Waste savings" on Pantry Stats — the number
      (`(items.length - expiredCount) * 3.5`) is a flat, made-up $3.50
      per non-expired item with no connection to real prices, but the
      caption underneath ("Estimated value of food kept out of the trash
      this month") presents it as a real calculation. Either back it with
      actual cost data or reword the caption so it doesn't overclaim
      accuracy it doesn't have.
- [ ] Let a single day in the meal plan be regenerated instead of only
      the whole 7-day plan at once.
- [ ] Add a "send test notification" button to the Notifications settings,
      so you can confirm notifications actually work on your device
      without waiting for a real expiry or invite event.
- [ ] Extract three duplicated UI patterns into shared components: the
      confirm-dialog pattern (Cancel + destructive confirm), the "card
      title + action link" header row, and switch-toggle rows — all
      currently hand-rolled separately in HouseholdHubScreen and
      ProfileScreen. Pure refactor, no behavior change.
- [ ] **Before shipping to real users:** remove or hide testing-only
      features — the "Reset app (testing)" button on Profile (wipes
      everything and signs out) and the "send test notification" button
      above should never reach production users.
- [ ] Research the best distribution method for community/beta testing of
      the prototype — e.g. TestFlight for iOS, the Google Play internal
      or closed testing track, or continuing with Expo Go — as a step
      toward eventual App Store / Play Store submission. Related but
      separate from the readiness gaps noted elsewhere in this list (the
      testing-UI cleanup above, the real app icon, and account deletion,
      which Apple's guidelines require for any app with sign-up).
- [ ] Add in-app account deletion — there's currently no way to delete
      your account or data from within the app. Apple's App Store Review
      Guideline 5.1.1(v) requires this for any app with account creation,
      making it a real submission blocker, not just a nice-to-have.
- [ ] Write and host a privacy policy, then link it in the app — required
      by both Apple and Google at submission for any app collecting
      personal data (this one collects location, dietary/allergy info,
      and camera access), not optional.
- [ ] Figure out the `429` on `/api/meal-plan` — testing in Expo Go and a
      direct check from outside the app both got `{"error":"AI service is
      busy. Please wait a moment and try again."}`, even unauthenticated,
      so it's not account- or pantry-specific. Likely a rate limit or
      usage quota on whatever AI service the backend calls to generate
      plans. Needs checking in the Airo AI Builder dashboard directly
      (usage/billing page) — not something visible or fixable from this
      repo.

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
