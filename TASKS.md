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

| | Completed |
|---|---|
| ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) | 82 / 70 |
| ![Laya](https://img.shields.io/badge/Laya-B5EAD7) | 60 / 70 |

**Goal:** 70 tasks each (total) by end of day 9/5.

**Note:** the goal increases by 10 each week. This isn't automatic;
whoever updates this file should apply it, and it's fine to adjust
the pace if that week doesn't actually support it.

**NOTE (from Laya):** I'll be on my trip next week so I'll probably
finish extra tasks this week but you should definetly go at your own
pace I just won't be able to work much next week <3

**Past Goals:** 10 each by 7/25, 20 each by 8/1, 30 each by 8/8, 40 each by 8/15,
50 each by 8/22, 60 each by 8/29.

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
      preferences and flag stale plans (branch:
      `feature/mealplan-prefs-and-staleness`) — merged into `master`.
      Meal-plan requests now include your cuisine/dietary/allergy
      preferences (previously only pantry items were sent); unverified
      whether the backend honors them. Also warns when the pantry items
      have changed since the cached plan was made, with "Regenerate now"
      and "Leave as is" actions. 10 tests added, suite at 73. Note:
      generating currently hits a `429`.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a
      pantry-size check and app-wide plain-English errors (branches:
      `feature/mealplan-min-items`, `feature/error-code-prefix`) — merged
      into `master`. Blocks generating with too few pantry items (clear
      message instead of a wasted request), and fixes error messages
      across the app to show real text instead of a bare status code —
      `client.ts` was only checking for a `message` field, missing the
      backend's `error`-keyed messages entirely. Errors also now show
      their status code up front (e.g. "429 Error: ..."), easier to
      correlate with what happened over the network while testing —
      worth revisiting before shipping. 19 tests added, suite at 92.
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
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Fix
      singular/plural grammar in the Dashboard's expiring-soon briefing
      (branch: `feature/dashboard-briefing-grammar`) — merged into
      `master`. "1 item expiring soon — use them up before they go to
      waste" used plural pronouns even for a single item. Extracted the
      message building into `buildExpiringSoonBriefing()` in
      `dashboardLogic.ts` so singular vs. plural wording is covered by
      tests. Added 3 tests, bringing the suite to 95 total.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Draft a
      privacy policy and link it from Profile (branch:
      `feature/privacy-policy-link`) — merged into `master`. Wrote a
      privacy policy grounded in what the app actually collects and does,
      and added a "Privacy Policy" link on the Profile screen that opens
      it. It's hosted as a Claude Artifact; the Artifact was shared
      publicly, and real users can now actually view it.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Improve the receipt scanning
      feature so it reads receipts more reliably (branch:
      `feature/laya-app-improvements-2`) — merged into `master`. Bumped
      capture quality (0.5 → 0.85), turned on continuous autofocus (was off
      by default — likely a big source of blurry, hard-to-OCR photos), and
      added a flashlight toggle for dim rooms. Reviewed scan items are also
      no longer read-only: a pencil icon opens the existing Add/Edit item
      screen prefilled with the scanned data so a bad OCR read can be
      corrected, and a trash icon drops it entirely. **Correction, found
      2026-07-29 while live-testing:** those were real improvements, but
      scanning still doesn't work end-to-end, and it's not the "AI busy"
      429 issue — it's worse. Confirmed live against the backend: `POST
      /api/scan` rejects both the receipt payload (`imageBase64`, 400
      `"Provide \"text\" (receipt string) or \"lines\" (array of
      strings)"`) and the barcode payload (`code`, same rejection).
      Sending the barcode number as `lines` *is* accepted (200) but
      returns 0 items — this endpoint is a receipt-line text parser, not
      a barcode lookup. So: receipt scanning needs on-device OCR (there
      is none today — the app sends a raw photo, the backend wants
      already-extracted text) to ever work at all, and barcode scanning
      isn't really supported by this backend regardless of payload shape.
      Real fix is a new task: add an OCR step (e.g.
      `expo-text-recognition`/ML Kit or similar) before calling
      `/api/scan`, then adjust the response mapping too (actual shape is
      `{success, itemCount, items:[{id, rawText, name, quantity: string,
      category, expiresAt, confidence, selected}]}` — no `unit` field,
      and `quantity` is a string, neither of which match `NewPantryItem`
      today). Deliberately not attempting that OCR integration in this
      session — it's a real new dependency and needs its own careful
      pass, not a bolt-on.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add icons to the
      empty-state component so it's visually consistent with the
      error-state component from an earlier task (branch:
      `feature/laya-app-improvements-2`) — merged into `master`.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add accessibility
      labels to icon-only buttons (branch: `feature/laya-app-improvements-2`)
      — merged into `master`. The password show/hide toggle and several
      icon-only buttons (profile, copy invite link, cancel invite, remove
      shopping item, scan torch/edit/remove) had no `accessibilityLabel`,
      so a screen reader just announced "button".
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Make the
      category bars on Pantry Stats tappable, jumping to that category on
      the Pantry screen (branch: `feature/pantry-stats-tappable-categories`)
      — merged into `master`. The two screens didn't talk to each other
      before; tapping a bar now navigates to Pantry, switches to category
      sort, clears any active search, collapses every other category, and
      scrolls the tapped one into view.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Let individual
      pantry items opt out of the "auto-add to shopping list on zero stock"
      behavior (branch: `feature/pantry-auto-add-opt-out`) — merged into
      `master`. Added an "Auto-add to shopping list when it runs out"
      switch (default on) to the Add/Edit item form, for one-time buys
      (a gift basket item, a specialty ingredient) that shouldn't keep
      landing back on the list. No backend field for this, so the
      preference is stored locally per item ID; `usePantry`'s zero-quantity
      auto-add now checks it first. 4 tests added, suite at 99.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Extract three
      duplicated UI patterns into shared components (branch:
      `feature/shared-ui-patterns`) — merged into `master`. The
      confirm-dialog (Cancel + destructive confirm), card-title-with-
      action-link header row, and switch-toggle row were each hand-rolled
      separately in HouseholdHubScreen, ProfileScreen, and (for the switch
      row) AddPantryItemScreen. Pulled into `confirmDestructiveAction()`
      and two new components, `CardHeader`/`CardHeaderLink` and
      `SwitchRow`. Pure refactor; the only visual side effect is the two
      Household Hub notification switch labels now match the medium-weight
      text already used on the pantry auto-add switch, and card titles in
      a header row no longer carry a stray bottom margin that occasionally
      nudged them off-center against their action.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix the brief flash
      of default/misleading stats before real pantry data loads (branch:
      `feature/laya-batch3`) — merged into `master`. Dashboard and Pantry
      Stats each mount their own `usePantry()` instance, so `items` starts
      at `[]` and `computeHealth([])` returns 100 — every visit briefly
      showed a perfect "100% health" ring (and Pantry Stats flashed "$0
      waste savings") regardless of real data. Added a real loading state,
      distinct from both "empty" and "has data," to both screens.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Explain the "Health
      score" with actionable guidance (branch: `feature/laya-batch3`) —
      merged into `master`. Added a caption under the ring on both
      Dashboard and Pantry Stats explaining it's the share of items not
      expiring within 3 days; when it's below 70%, Pantry Stats also names
      how many items are dragging it down and points at sorting by expiry
      to find them.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix or relabel
      "Waste savings" on Pantry Stats (branch: `feature/laya-batch3`) —
      merged into `master`. Retitled it "Estimated waste savings" and
      reworded the caption to say plainly that the $3.50/item figure is a
      rough placeholder, not based on what you actually paid — no real
      cost data exists to back it with, so honesty was the fix rather
      than a fake calculation.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add a "select all" /
      bulk-check option to the shopping list (branch:
      `feature/laya-batch3`) — merged into `master`. Added `setAllChecked`
      to `useShoppingList` and a "Select all" / "Deselect all" link next
      to "Clear checked" in the Household Hub; items could previously only
      be checked one at a time.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Show a brief "N
      items cleared — Undo" toast after clearing checked shopping list
      items (branch: `feature/laya-batch3`) — merged into `master`.
      `clearChecked` now returns what it removed instead of discarding it;
      the Household Hub holds onto that for 5 seconds behind an "Undo"
      link that re-adds the items (as new entries, not exact prior
      state/IDs).
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add a "send test
      notification" button to the Notifications settings (branch:
      `feature/laya-batch3`) — merged into `master`. Requests permission
      if needed and fires an immediate local notification, so you can
      confirm notifications work on your device without waiting for a
      real expiry or invite event.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add an "Other"
      option to the pantry form's Unit picker (branch:
      `feature/laya-batch3`) — merged into `master`. Matches how Category
      already handles it — one more fixed pill, no free-text entry. Didn't
      do the broader look at other fields; kept that as its own item below
      since it's a separate, bigger question (whether "Other" needs to
      actually be free-text everywhere, not just present).
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add a real app icon
      and splash screen image (branch: `feature/laya-app-icon`) — merged
      into `master`. There's no image-generation tool available, so this
      is a simple original mark built as SVG and rasterized to the sizes
      Expo needs (`scripts/generate-icons.js`, run via `npm run
      generate-icons`; needs the new `sharp` devDependency) — a basket
      with a sprout, in the app's own palette (Savory Sage background,
      Coconut Cream basket, Blush Beet leaf), not a placeholder. Wired
      into `app.json`: `icon`, `android.adaptiveIcon` (had to change its
      backgroundColor from Coconut Cream to Savory Sage — the basket
      glyph is cream-colored, so it was invisible against a cream
      background), and a proper `expo-splash-screen` plugin config
      (replacing the old bare `splash: {backgroundColor}` key, which is
      the legacy/deprecated way to configure it as of this SDK).
      **Important:** none of this is visible in Expo Go — icon/splash
      only take effect in an actual native build (`expo prebuild` / EAS
      Build), so it can't be checked by scanning the dev-server QR code.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Auto-suggest a
      category from the item name when adding a pantry item (branch:
      `feature/auto-suggest-category`) — merged into `master`. Typing
      "milk" now pre-selects Dairy, the way Notes' grocery list does, via
      a client-side keyword dictionary (no backend field for this). Only
      applies to new items with an untouched category — editing an
      existing item, a scan prefill that already set one, or manually
      tapping a category pill all leave the suggestion alone from then
      on. 7 tests added, suite at 106.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add bulk
      delete to the shopping list (branch: `feature/shopping-list-bulk-delete`)
      — merged into `master`. Pairs with the select-all Laya added, which
      only ever fed "Clear checked" — there was no way to remove multiple
      items regardless of checked state. Adds a separate selection mode
      (checkbox icon in the Shopping list header), distinct from the
      existing "picked up" checkbox: tap items to select them, "Select
      all"/"Select none," then "Delete (N)" behind the usual destructive
      confirm. Reuses the existing "N items cleared — Undo" banner for
      the deleted items. 7 tests added, suite at 113.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a share
      action to the shopping list (branch: `feature/share-shopping-list`)
      — merged into `master`. There is now a way to get the list out of
      the app, e.g. to text it to whoever's actually at the store — a
      share icon in the Shopping list header (native share sheet via
      React Native's built-in `Share` API, no new dependency) that
      formats items as plain text, checked items marked differently from
      unchecked ones. 5 tests added, suite at 118.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Warn before
      deleting a pantry item referenced in the current meal plan (branch:
      `feature/pantry-delete-plan-warning`) — merged into `master`.
      Deleting an item silently left the cached plan pointing at
      something you no longer have. The delete confirm on the Edit Item
      screen now checks the cached plan's pantry item names and adds a
      note when the item being removed is part of it, suggesting a
      regenerate. Also pulled the meal-plan cache read/write (previously
      inlined in MealPlannerScreen) into a shared
      `src/utils/mealPlanCache.ts` so both screens read from the same
      source instead of duplicating the AsyncStorage key and shape.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add quick-add
      staple chips to the Add Item form (branch:
      `feature/quick-add-staples`) — merged into `master`. A "Quick add"
      row of Milk/Eggs/Bread/Butter/Rice/Bananas/Chicken Breast chips
      prefills name, category, and unit (and quantity for the couple
      where the default of 1 doesn't make sense, e.g. a dozen eggs).
      Only shows for a brand-new item with an empty name field — hidden
      while editing, from a scan prefill, or once you've started
      typing/picked a chip.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) **Needed for
      TestFlight:** hide testing-only UI from production builds (branch:
      `feature/hide-testing-features`) — merged into `master`. The
      "Reset app (testing)" button on Profile and "send test
      notification" button on Notifications settings are now gated
      behind `__DEV__`, React Native's built-in flag (true in Expo
      Go/dev builds, false in a release build), so no separate
      feature-flag system was needed. Checked the privacy policy for
      any reference to either feature — there isn't one, so no policy
      change needed.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) **Needed for
      TestFlight:** add EAS build profiles for TestFlight submission
      (branch: `feature/eas-build-profiles`) — merged into `master`. No
      `eas.json` existed, so there was no build profile guaranteed to
      produce a real release build (`__DEV__` false) rather than a dev
      client. Added the standard three profiles (development, preview,
      production); only `development` sets `developmentClient: true`, so
      `preview` and `production` both build a real release. Documented
      in `README.md` which profile to use for an actual TestFlight
      submission and why, plus that `eas login` / `eas init` still need
      to be run once by whoever has an Expo account, since no EAS
      project is linked yet. Added `build:preview` / `build:production`
      npm scripts.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Do a
      systematic accessibility contrast audit of the pastel palette
      (branch: `feature/contrast-audit`) — merged into `master`. Added
      `src/theme/contrast.ts` (WCAG contrast math, 8 tests) and fixed
      three real bugs: Pill's badge text picked the wrong tone in dark
      mode (~1.7:1), since highlight/accent/warning colors stay pale in
      both modes; the Recipes favorite-star icon was ~1.8:1 in light
      mode (accent → primary, now ~4.0:1); the onboarding progress bar's
      active segments were ~1.2:1 against inactive ones in light mode
      (accent → primary). Two more findings need a real design decision,
      not a quick fix — added as new backlog entries. 8 tests added,
      suite at 126.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) **Needed for
      TestFlight:** add in-app account deletion (branch:
      `feature/account-deletion`) — merged into `master`. Required by
      Apple Guideline 5.1.1(v). Added "Delete account" on Profile behind
      the usual confirm, wired to a new `DELETE /api/me` (Airo added it)
      that removes credentials/sessions/profile/favorites, preserves
      shared household data when other members remain, and only deletes
      the household/pantry/shopping-list/invites if the user was its
      sole member; invites now track their creator so pending ones get
      cancelled too. Took three rounds of testing directly against the
      live API to actually work: `/api/household/create` rejected valid
      Bearer tokens (broke household creation for every signup), and
      `DELETE /api/me` 500'd on a SQL failure — both confirmed fixed by
      re-testing, not by trusting the description. Also fixed (branch:
      `feature/onboarding-reset-order`): "Reset app"/"Delete account"
      landed on the wrong onboarding step since both cleared the profile
      before signing out; swapped the order.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Make the Add
      Item form aware of dietary preferences and allergies (branch:
      `feature/dietary-aware-add-item`) — merged into `master`. Found
      while live-testing: quick-add chips and the Category picker showed
      things like "Chicken Breast"/"Meat" regardless of diet. Now, for
      new items only: Chicken Breast + Meat category hidden for
      Vegetarian/Vegan/Pescatarian; Milk/Eggs/Butter also hidden for
      Vegan; staples matching an allergy (standard or free-text, e.g.
      "Bananas") hidden too. Auto-suggest-category won't suggest a
      hidden category either. 17 tests added, suite at 143.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add quantity
      +/- controls to shopping list items (branch:
      `feature/shopping-list-quantity`) — merged into `master`. Wired to
      the now-working `PATCH /api/shopping-list/:id`. Also found and
      fixed: `ShoppingListItem.quantity` was misnamed against the real
      backend field (`qty`), so it was silently `undefined` in three
      places — the old quantity display, the Undo-restore flow, and the
      share-list formatter; the `create` response was actually
      `{ item: {...} }`, not the bare item, so new items rendered broken
      until the next refresh; `qty` comes back as a string, now coerced
      to a number. Also split the crowded Shopping list header into two
      rows.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix three missing-
      error-handling bugs plus one missing-rollback bug (branch:
      `feature/laya-batch4`) — merged into `master`. Found by grepping for
      `try {}finally{}` blocks with no `catch` — the exact same gap showed
      up independently in RecipeDetailScreen's favorite-toggle,
      EditProfileScreen's save, and OnboardingScreen's final "Finish"
      button (the worst one, since it's the first-time signup flow); all
      three now show an error Alert like everywhere else in the app.
      DonationContext.recordDonation also set state before awaiting its
      AsyncStorage write with no rollback on failure — fixed the same way
      usePantry/useShoppingList already handle it elsewhere.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix a shopping-list
      quantity stepper race condition (branch: `feature/laya-batch4`) —
      merged into `master`. `updateQuantity` had nothing stopping
      overlapping calls for the same item; rapid +/- tapping could revert
      to a stale value if an earlier request failed after a later one had
      already succeeded. Added a pending-ids guard and disabled the
      buttons while an update for that item is in flight.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add free-text
      fallback for the pantry form's Category and Unit "Other" options
      (branch: `feature/laya-batch4`) — merged into `master`. Both were
      just fixed labels with no way to say what "Other" actually meant;
      picking either now shows a text field, and the typed value (falling
      back to the literal "Other" if left blank) is what gets saved.
      Editing an item whose category/unit isn't a known pill now correctly
      shows Other selected with that value prefilled.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Redesign the Pantry
      Stats category bars for real WCAG contrast (branch:
      `feature/laya-batch4`) — merged into `master`. The audit found all
      four `barPalette` fills failed 3:1 against the track color; no
      single flat track color could work across a palette spanning very
      pale to medium-dark fills. Fixed by giving each bar's filled segment
      a border in whichever of dark/light text reads best against *that*
      fill (`readableTextColor`, reusing the existing utility) instead of
      guessing a new track shade, plus darkening the track itself. Every
      pairing now clears 3:1 except one honestly-documented edge case
      (dark mode's secondary-colored bar vs. the track, ~2.15:1 — still a
      real improvement over the original 1.07–2.68:1 range).
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Darken the primary
      brand color for light-mode text contrast (branch:
      `feature/laya-batch4`) — merged into `master`. Savory Sage
      (`#818263`) rendered ~3.9:1 against the near-white text used
      directly on it (selected pills, primary buttons) — under the 4.5:1
      AA threshold, previously left as a "bigger design decision" since it
      affects buttons/pills app-wide. Darkened it ~6% in lightness only
      (same hue/saturation, so it still reads as the same green) to
      `#707156`, clearing 4.5:1 with margin; dark mode's primary already
      passed and is unchanged. Added regression tests against the real
      theme values, not just the underlying math.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Scope onboarding-
      complete state to the signed-in account instead of the device
      (branch: `feature/laya-batch4`) — merged into `master`. The
      onboarding profile was cached under one global key regardless of
      account, so a second account signing in on the same device inherited
      the first account's stale profile and skipped onboarding entirely.
      There's no backend user ID exposed to the client, so this keys the
      cache by the signed-in email instead (captured client-side at
      sign-in/sign-up, a new SecureStore entry). Also fixed the same
      missing-rollback bug as DonationContext in `completeOnboarding`, and
      a 4th instance of the missing-catch bug in "Reset app (testing)."
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Let a single
      meal-plan day be regenerated (branch: `feature/laya-batch4`) —
      merged into `master`. No per-day backend endpoint exists, so this
      generates a fresh full plan and splices just the requested day out
      of it, leaving the rest of the cached week untouched. Subject to the
      same known `/api/meal-plan` 429 quota issue as the rest of meal-plan
      generation until that's resolved.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) **Needed for
      TestFlight:** research the best distribution method for beta testing
      (branch: `feature/laya-batch4`) — merged into `master`. Recommends
      TestFlight + Google Play's Internal Testing track over continuing
      with Expo Go once there's a real group of testers — Expo Go's link
      breaks on network changes, always shows its own icon/splash instead
      of the real app's, and (confirmed this project's own notifications
      work) only partially supports notifications as of SDK 53+. Both
      internal testing tracks support up to 100 testers with no store
      review needed. Full reasoning and concrete setup steps in
      `README.md`.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Re-verified two
      previously-blocked backend gaps are still blocked (branch:
      `feature/laya-batch4`) — merged into `master`. Household
      member list/remove/leave and a favorites-remove endpoint were both
      confirmed missing weeks ago; re-probed live since the backend has
      since gained new endpoints on request (e.g. `DELETE /api/me`). Both
      still return generic Express 404s (route doesn't exist at all), so
      still genuinely blocked, not just stale documentation.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix meal-plan
      single-day regen incorrectly clearing staleness (branch:
      `feature/laya-batch5`) — merged into `master`. Found in the "regen
      one day" feature from a previous session: refreshing a single day
      marked the *entire* cached plan as matching current pantry, hiding
      the "pantry changed" banner even though the other six days were
      still built on stale pantry data. Now leaves the cached pantry
      snapshot untouched on a single-day regen.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Gate the debug
      status-code error prefix behind `__DEV__` (branch:
      `feature/laya-batch5`) — merged into `master`. Every error message
      was prefixed "N Error: ...", explicitly flagged in-code as "worth
      revisiting before real users see this." Gated behind `__DEV__`,
      matching the pattern already used for Reset app / send test
      notification — a release build now shows the plain message only.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add an honest
      caption to the recipe detail servings stepper (branch:
      `feature/laya-batch5`) — merged into `master`. It implied scaling
      ingredient amounts, but `recipe.servings` is never actually
      populated by `useSuggestedRecipes` and `ingredients` is just one
      unstructured description string — nothing to scale. Added a caption
      clarifying it's a planning note only, same honesty pattern as the
      Waste Savings fix.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Merge duplicate
      shopping-list item names into a quantity bump (branch:
      `feature/laya-batch5`) — merged into `master`. Adding "Milk" while
      "Milk" was already on the list created a second row instead of
      bumping the existing one. Matches case/whitespace-insensitively
      against unchecked items only — a checked item represents a finished
      need, so re-adding that name starts a fresh entry instead.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix a donation
      partial-failure accounting bug (branch: `feature/laya-batch5`) —
      merged into `master`. Donating multiple items removed them from the
      pantry one at a time but only logged the donation once the whole
      batch succeeded — if item 2 of 3 failed, item 1 was already gone
      from the pantry for real but never recorded as donated anywhere.
      Now tracks what actually got removed and best-effort logs it even
      on partial failure, with an honest error message about what
      happened.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Validate contact
      format on the Invite flow (branch: `feature/laya-batch5`) — merged
      into `master`. The email/phone field only checked for non-empty, not
      format — a garbled address would send successfully and silently
      never reach anyone. Reuses `isValidEmail` and adds a new
      `isValidPhone` (loose digit-count check), wired into an inline
      TextField error.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add `disabled`
      support to `CardHeaderLink`, use it on meal-plan Regenerate links
      (branch: `feature/laya-batch5`) — merged into `master`. The
      single-day regenerate feature already guarded against overlapping
      regens in its handler, but gave no visual feedback — tapping
      another day's Regenerate link while one was in flight silently did
      nothing. The shared component had no `disabled` prop at all (used
      for 10 different actions app-wide); added one and wired it in.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix a broken
      RecipeDetail deep link — crash risk (branch: `feature/laya-batch5`)
      — merged into `master`. `linking.ts` declared a
      `recipes/:recipeId` route, but the screen requires a full `Recipe`
      object via in-app navigation params — there's no
      `GET /api/recipes/:id` to hydrate one from a URL. Triggering that
      link would have crashed on `recipe.title` with `recipe` undefined
      at runtime (TypeScript's type only holds for in-app navigation, not
      whatever a real deep link hands the screen). Removed the misleading
      route and added a defensive runtime guard with a graceful fallback.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fix a
      `CustomOptionField` duplicate-value bug (branch:
      `feature/laya-batch5`) — merged into `master`. Typing a custom
      cuisine/dietary/allergy value that matched an already-selected
      *base* pill option (e.g. "Italian") silently appended a duplicate
      string into the underlying array — invisible in the UI, since only
      genuinely-custom entries render as removable pills. The duplicate
      check only compared against that custom subset, not the full
      selection. Fixed with a new `allSelected` prop and a tested
      `isDuplicateOption` helper, wired into all four places this
      component is used (3 onboarding steps + EditProfileScreen).
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Deduplicate
      `computeHealth` between `dashboardLogic.ts` and `PantryStatsScreen`
      (branch: `feature/laya-batch5`) — merged into `master`. Byte-for-
      byte identical logic lived in two places; the screen's local copy
      was untested and nothing stopped the two from silently drifting
      apart. `PantryStatsScreen` now imports the shared, tested version.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add a client-side
      search/filter box to the Recipes screen (branch:
      `feature/laya-batch6`) — merged into `master`. There's still no real
      recipe-catalog search endpoint (see the "Not yet assigned" note
      below), so this only filters whatever's already loaded (suggested +
      favorited) by title, same honest-partial pattern as the Pantry
      search box. 5 tests added.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Re-verified four
      backend-blocked backlog items and documented findings (branch:
      `feature/laya-batch6`) — merged into `master`. Re-checked live:
      recipe search, donation backend, household member remove/leave, and
      recipe un-favorite are all still blocked (404s or no endpoint at
      all), not just stale docs. Notes below each entry now reflect the
      8/12 re-check.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add live
      email-format validation to SignIn, SignUp, and the onboarding
      account step (branch: `feature/laya-batch6`) — merged into
      `master`. The Invite flow already validated format live in an
      earlier batch, but these three screens only checked format at
      submit time (or not at all) — inconsistent with each other and
      with Invite. Now all four match.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Gate `auth.ts`'s
      debug status-code error prefix behind `__DEV__` too (branch:
      `feature/laya-batch6`) — merged into `master`. The earlier
      `__DEV__`-gating fix (batch5) covered `client.ts` but missed this
      file's independent copy of the same "N Error: ..." prefix.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add an honest
      "scanning isn't working yet" notice to the Scan screen (branch:
      `feature/laya-batch6`) — merged into `master`. Re-confirmed live
      that both receipt and barcode scans still fail against the backend
      (same root cause as the earlier scanning-reliability correction
      note). Rather than let someone scan and hit a confusing failure,
      the idle camera view now shows a plain-English notice up front with
      a shortcut to add the item manually instead.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Scope the pantry
      offline cache and meal-plan cache to the signed-in account instead
      of the device (branch: `feature/laya-batch6`) — merged into
      `master`. Same bug class as the onboarding-profile fix in batch4,
      but worse here: a second account signing in on the same device
      would see the *first* account's actual pantry items or meal plan
      shown as its own. Extracted the per-account keying into a shared,
      tested `accountScopedKey()` util instead of duplicating the pattern
      a third time.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Scope donation
      history, notification preferences, and the auto-add opt-out list to
      the signed-in account too (branch: `feature/laya-batch6`) — merged
      into `master`. Same fix as above, batched in for consistency now
      that `accountScopedKey()` exists. Donation history is the more
      serious of the three (real donation records); notification prefs
      and the opt-out list are lower-severity personal toggles.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add
      `accessibilityRole`/`accessibilityState` to the Donate screen's item
      checkboxes and partner radio rows, and the Pantry screen's
      collapsible category header (branch: `feature/laya-batch6`) —
      merged into `master`. Each had visible text, but nothing told a
      screen reader it was a checkbox/radio/expandable toggle or what its
      current state was.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Add
      `accessibilityRole` to the Recipes screen's recipe tiles (branch:
      `feature/laya-batch6`) — merged into `master`. Same gap as the item
      above, batched in for consistency; the label also now surfaces
      favorite status, previously conveyed only by a star icon.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Make the recipe
      detail servings stepper accessible and disable it at its 1/20
      boundaries (branch: `feature/laya-batch6`) — merged into `master`.
      The +/- buttons only had single-character visible labels ("−"/"+"),
      unhelpful to a screen reader, and silently no-op'd at the boundaries
      instead of disabling like the shopping-list stepper already does.
      Added an optional `accessibilityLabel` prop to the shared `Button`
      component (every other call site is unaffected, since it defaults
      to the visible label) and used it here.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Build the
      forgot-password / reset-password flow (branch:
      `feature/forgot-password-reset`) — merged into `master`. No longer
      backend-blocked as of 8/14 — Airo confirmed `POST
      /api/auth/request-password-reset` sends a real branded email, and
      the emailed link's token + new password go to `POST
      /api/auth/reset-password`. Added a "Forgot password?" link on Sign
      In, a request-screen (`ForgotPasswordScreen`, in the Auth stack)
      that always shows a generic "check your email" success message
      regardless of whether the address has an account (so this can't be
      used to enumerate real emails), and a reset screen
      (`ResetPasswordScreen`) mounted at the root navigator level rather
      than inside the Auth stack, since the emailed link has to resolve
      correctly no matter what screen the app would otherwise show —
      unlike Join, this can't wait for a signed-in/onboarded state. Wired
      a `reset-password` deep-link path so the emailed link opens directly
      to it, with a token-missing state for an invalid/expired link.
      Doesn't yet cover the "sign in" step of onboarding's embedded
      AccountStep (only the standalone Sign In screen) — that flow has no
      navigator to push a screen from, so it's left as a smaller followup
      rather than restructuring onboarding for it. (Since covered — see
      the `feature/onboarding-forgot-password` entry further down.)
      Typecheck, all 186
      tests, and a real `expo export --platform ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Build
      remove-member / leave-household UI (branch:
      `feature/household-member-removal`) — merged into `master`. No
      longer backend-blocked as of 8/14. Added a trash icon per row in
      Profile's "Household members" list (confirm dialog, matches the
      cancel-invite pattern) and a "Leave household" action that
      re-provisions a fresh empty household afterward (the app has no "no
      household" UI state otherwise). Not role-gated on the backend yet —
      any member can remove any other. **Unverified, merged anyway:** the
      app has no real members endpoint, so "members" is just accepted
      invites; remove reuses the invite's `id` as the member id, unconfirmed
      against what the backend route actually expects. If wrong, removal
      just fails with a clear error rather than doing anything destructive
      to the wrong thing — needs a real live test (invite, accept, remove)
      to confirm or fix. Typecheck, tests, and an `expo export` bundle all
      pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Gate the
      remove-member action to household owners (branch:
      `feature/household-member-roles`) — merged into `master`. Airo
      added owner/member roles on
      8/14 (`GET /api/me` now returns `role`) and restricted
      `DELETE /api/household/members/:id` to owners server-side —
      previously any member could remove any other. Client now fetches
      the signed-in user's role on Profile and only shows the trash icon
      per member row when it's `"owner"`; defaults to hidden (not
      "unknown") while that loads, so a non-owner never briefly sees a
      control that would just 403. "Leave household" stays available to
      everyone, unaffected by role. Typecheck, tests, and an
      `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Let a recipe
      be un-favorited (branch: `feature/unfavorite-recipe`) — merged into
      `master`. Airo added
      `DELETE /api/favorites/:id` on 8/14 (auth-scoped, 404s on someone
      else's favorite). The favorite star on Recipe Detail could
      previously only ever turn on; the button is now a real toggle both
      ways, reusing the recipe's own `id` as the favorite id — matches
      how `favoritesApi.list()` already returns full `Recipe` objects
      with no separate favorite-record id, so there was never a second id
      space to be unsure about here (unlike the household-member case).
      Also added a focus-refresh to the Recipes list's favorites fetch
      (previously mount-only), matching Pantry's existing pattern, so
      un-favoriting on Detail is actually reflected in the star/ordering
      on the way back instead of needing a manual pull-to-refresh.
      Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a real
      recipe search feature (branch: `feature/recipe-search`) — merged
      into `master`. Airo added
      `GET /api/recipes?q=<text>` on 8/14 — Gemini-backed (not OpenAI, so
      it doesn't share meal-plan's `429` quota issue), capped at 8
      results, ~8-second server-side timeout, 10-minute cache for repeat
      queries. Since Airo's own assessment is that this is too slow for
      live keystroke search, it's a deliberately separate, explicit
      action from the existing instant local filter — a "Search all
      recipes" button/return-key action below the search box, shown only
      when there's query text, with its own loading state and a "Back to
      suggestions" link to return to the normal suggested+favorited view.
      Errors (including the documented `504` timeout, whether Airo's own
      JSON body or the preview gateway's HTML one) surface via the
      existing generic error-message handling in `client.ts` — no special
      casing needed, the existing 504 fallback message already covers it.
      Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a real
      backend for the donation feature (branch: `feature/donation-backend`)
      — merged into `master`.
      Airo added authenticated `POST /api/donations` and
      `GET /api/donations` on 8/14, household-scoped — donation records
      now survive a reinstall and are visible to other household members,
      not just whoever tapped confirm. `DonationContext` now fetches/posts
      through the real API instead of per-account `AsyncStorage`; pantry
      items are still removed for real on donation (unchanged, already
      real). Explicitly scoped down per Airo: there's no real food-bank/
      nonprofit handoff configured, so partner selection stays a label
      only — reworded Donate's disclaimer to say that plainly instead of
      implying a real handoff is coming "once the backend supports it."
      Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add an
      "add ingredients to shopping list" action on a planned meal (branch:
      `feature/mealplan-shopping-gap`) — merged into `master`. Airo added
      a structured `ingredients` array per meal (name, quantity, and
      whether it's already in the pantry) on 8/14, so the app no longer
      has to guess what's missing itself. Each meal now shows "Missing:
      X, Y" plus an "Add missing to shopping list" link, reusing the
      existing logic that bumps a matching item's quantity instead of
      adding a duplicate row. 4 tests added, suite at 190. Typecheck,
      tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a
      cuisine filter to the Recipes screen (branches:
      `feature/cuisine-filter`, `feature/recipe-cuisine-display`) —
      merged into `master`. Airo added a `cuisine` field to each meal on
      8/15, the same way as the ingredients change above. Recipes now
      has a second filter row for cuisine, next to the existing
      meal-type row, and "no matching recipes" now explains a cuisine
      mismatch too, not just a meal-type one — closing out a note left
      when the meal-type filter first shipped. 15 tests added, suite at
      205. **Follow-up, 8/16:** cuisine was usable to filter by but never
      actually shown anywhere, so a Thai-filtered grid gave no visual
      confirmation any given card was actually Thai — same gap the
      meal-type filter has always had (it's never displayed as text
      either), just more noticeable now that a second filter exists.
      Added it as a small caption on recipe tiles and as the Recipe
      Detail screen's subtitle. Typecheck, tests, and an `expo export`
      bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Fix the
      OpenAI quota error on `/api/meal-plan` (branch:
      `feature/mealplan-day-scoped`) — merged into `master`. The OpenAI
      account behind this app's API key had used up its free trial
      credit, so every request 429'd; Airo switched meal-plan generation
      to Gemini instead, clearing the quota error. Airo also added a way
      to request one day of a plan at a time, so "Generate 7-day plan"
      now makes 7 quick single-day requests and stitches them together
      (with a "Generating day N of 7…" progress message) instead of one
      slow whole-week request — a day that fails partway through doesn't
      lose the days that already succeeded. This also caught a real bug
      in "regenerate one day," which had been silently requesting and
      discarding the entire week every time; it now correctly requests
      just the one day asked for. 2 tests added, suite at 207.
      Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Use real
      ingredient quantities on the Meal Planner (branch:
      `feature/mealplan-ingredient-quantities`) — merged into `master`.
      Each missing ingredient carries a real quantity (e.g. "2 cloves"),
      but it was being discarded — "Missing: X, Y" only showed names,
      and adding to the shopping list always used a flat quantity of 1
      regardless of what the meal actually called for. Missing
      ingredients now show their quantity (e.g. "Missing: Garlic (2
      cloves)"), and adding to the shopping list parses the leading
      number out of that free-text quantity (falling back to 1 when
      there isn't one, e.g. "a pinch") instead of hardcoding 1. 6 tests
      added, suite at 213. Typecheck, tests, and an `expo export` bundle
      all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a
      donation history screen (branch: `feature/donation-history-list`)
      — merged into `master`. Donation history was real backend data
      (since the donation-backend task) but only ever used to compute a
      running count — "You've donated 5 items so far" — with no way to
      see what was actually donated, when, or to which partner. Added a
      "View history" link on the donate card (shown once there's at
      least one donation) that opens a list of past donations with
      partner, date, and item names, with pull-to-refresh — genuinely
      useful now that donations are shared across the household, not
      just local to whoever donated. Typecheck, tests, and an
      `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Show pantry
      item notes in the Pantry list (branch:
      `feature/pantry-notes-display`) — merged into `master`. Notes were
      editable and saved (Add/Edit Item's notes field) but never shown
      anywhere in the actual pantry list — a note like "buy organic"
      just silently vanished from view until you reopened that specific
      item's edit screen. Added a small note icon next to items that
      have one (in both the category and expiry-sort views, which share
      the same row component), plus an accessibility label mentioning
      it for screen readers. Typecheck, tests, and an `expo export`
      bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Show the
      contact used for a pending invite (branch:
      `feature/invite-contact-display`) — merged into `master`. Pending
      invites only ever showed a name and role ("Adult · pending") —
      with two pending invites, there was no way to tell which was sent
      to which email/phone without opening the copy-link flow. Now shows
      the actual contact too (e.g. "Adult · pending ·
      jane@email.com"), except for link-type invites, where `contact` is
      just a "link" placeholder rather than a real value — those still
      show as before. Typecheck, tests, and an `expo export` bundle all
      pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Make the
      full onboarding profile viewable and editable after signup (branch:
      `feature/full-onboarding-profile-editable`) — merged into
      `master`. Cuisine and dietary preferences already got this
      treatment; allergies and goals never did — collected once during
      onboarding, then permanently locked in, with no way to view or fix
      them short of a full "Reset app." Allergies specifically matter
      functionally, not just informationally — they already filter
      recipe/quick-add suggestions elsewhere in the app, so a mistake
      made during onboarding (or a new allergy since) had no fix short
      of nuking the whole profile. Added Allergies and Goals cards to
      Edit Profile (reusing the same options/components as their
      onboarding steps) and, on Profile itself, labeled pill sections
      for cuisine, dietary, allergies, and goals — cuisine wasn't shown
      on Profile at all before this either, only dietary was. Typecheck,
      tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Group the
      shopping list by category (committed directly to `master`).
      Pantry already groups items by category with
      collapsible sections; the shopping list was just a flat list, no
      easier to shop than a plain notes app. `ShoppingListItem` has no
      category field of its own, so reused Pantry's existing
      keyword-based category guesser (`suggestCategory`, already built
      for pantry's "suggest a category from the name" feature) to
      classify shopping list items the same way, purely for display —
      nothing new is sent to or stored on the backend. Grouped
      alphabetically, matching how Pantry orders its own category
      groups. Deliberately not collapsible like Pantry's groups — a
      shopping list is normally short enough that always-expanded
      sections are more useful than another tap to open every aisle.
      Extracted the per-item row (checkbox, quantity stepper, remove,
      selection-mode variant) into its own `ShoppingRow` component so
      the grouped and previously-flat render share the exact same row
      logic rather than duplicating it. **Found along the way, not
      fixed:** `suggestCategory`'s keyword list has "egg" (singular)
      but not "eggs" (plural), so an item literally named "Eggs" falls
      through to "Uncategorized" — pre-existing, affects pantry
      auto-suggest too, out of scope here. 5 tests added, suite at 218.
      Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add meal
      plan history (branch: `feature/mealplan-history`) — merged into
      `master`. Generating a new week overwrote the only cached plan —
      no way to look back at what you ate 2 weeks ago. Meal Planner
      wasn't in its own navigation stack before (just a bare tab
      screen), so gave it one (`MealPlannerStackNavigator`, matching how
      Pantry/Recipes/Household already work) with a new History screen
      alongside the existing one. A history icon in the header opens a
      list of past weeks (date, day count), tap to expand and see that
      week's meals read-only — no regenerate/shopping-list actions from
      history, deliberately, to keep this scoped to browsing rather than
      re-opening every interaction the current week already has.
      Snapshots are saved only on a genuinely complete 7-day generation
      (not single-day regenerates or "keep as is," which would've
      cluttered history with near-duplicates of the same week), capped
      at 12 entries so storage doesn't grow unbounded. Typecheck, tests,
      and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Show who
      added a shopping list item (branch:
      `feature/shopping-list-added-by`) — merged into `master`.
      Confirmed live via a throwaway test account that
      `GET /api/shopping-list` already returns `addedBy` as a real
      display name (e.g. "Test Claude"), not just an id — the client
      type just didn't have the field at all, so it was silently
      dropped. Worth checking before building: pantry's own `addedBy`
      is a raw user id, not a name, so this same treatment doesn't
      translate over there without a name lookup the app doesn't have.
      Shopping list rows now show "Added by X" as a small caption under
      the item name, only when present. Typecheck, tests, and an
      `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Sort
      recipes by match score (branch: `feature/sort-recipes-by-match`)
      — merged into `master`. The "X% match" pill was purely
      decorative — recipes were shown in whatever order the meal-plan
      API happened to return them (day/meal order), so a 95% match
      could sit below a 40% one with nothing to indicate it. Now
      sorted descending by match score, with favorites still kept
      first regardless of score (unchanged) since they're already
      favorited, and recipes with no score (favorites, which come from
      a separate endpoint that doesn't include one) sorting after
      every scored recipe rather than being scattered by an assumed
      value. 4 tests added, suite at 222. Typecheck, tests, and an
      `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Show more
      than one expiring item on the Dashboard (branch:
      `feature/dashboard-expiring-list`) — merged into `master`.
      Dashboard already computed every item expiring within 3 days, but
      the "USE IT UP" card only ever showed the single soonest one — the
      rest were reduced to an abstract count in the health-ring caption
      ("3 items expiring soon"), with no way to see which items without
      leaving the screen. Now shows up to 3, each with a real "Xd
      left"/"Expires today"/"Expired" label, plus "+N more expiring
      soon" when there are more than that. Extracted that label
      formatting (previously only inline in Pantry's `ExpiryTag`) into
      a shared, tested `formatExpiryLabel` so both screens use the exact
      same wording instead of two copies that could drift. 3 tests
      added, suite at 225. Typecheck, tests, and an `expo export` bundle
      all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Fix
      `suggestCategory` to match plurals (branch:
      `feature/suggest-category-plurals`) — merged into `master`. The
      keyword list is singular-only ("egg", not "eggs"), so a plural
      item name fell through to no suggestion at all, in both Pantry's
      own auto-suggest and the shopping-list grouping that reuses it.
      Added a small, deliberately-not-a-real-stemmer `singularize` that
      reverses the common English plural endings ("eggs" → "egg",
      "tomatoes" → "tomato", "berries" → "berry") before matching,
      rather than duplicating every keyword in its plural form. 5 tests
      added, suite at 230. Typecheck, tests, and an `expo export` bundle
      all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Draft a
      Terms of Service and link it from Profile (branch:
      `feature/terms-of-service`) — merged into `master`. Same treatment
      as the Privacy Policy — a real draft grounded in what the app
      actually does (not generic boilerplate), hosted as a Claude
      Artifact matching the Privacy Policy's exact design for
      consistency between the two. Covers acceptance, account/age
      requirements, household data-sharing responsibilities, third-party
      AI/backend dependencies, and — the section that actually matters
      most for a food-tracking app — an explicit disclaimer that expiry
      tracking and AI-generated suggestions aren't a food-safety
      guarantee and don't replace using your own judgment, especially
      for allergies. Also fixed a stale claim found in the Privacy
      Policy while there: it still said account deletion was "on our
      roadmap and not yet available," which was true when drafted but
      isn't anymore — updated to describe the real, already-shipped
      delete flow. Typecheck, tests, and an `expo export` bundle all
      pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Show the
      signed-in account email on Profile (branch:
      `feature/show-account-email`) — merged into `master`. You sign in
      with an email, but nothing in the app ever showed it back to you
      afterward — `useAuth()` already exposed `currentEmail`, it just
      wasn't used anywhere. Now shows "Signed in as x@example.com" in
      Profile's "About you" card. Typecheck, tests, and an
      `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Refine the
      app's icon visuals and general look so it feels more polished and
      professional (branch: `feature/icon-polish`) — merged into
      `master`. Found a stale color bug along the way: the icon, Android
      adaptive-icon background, and splash screen were still on the old
      pre-accessibility-audit primary `#818263` instead of the current
      `#707156`, so the app icon didn't actually match the in-app brand
      color anymore. Fixed that and added a subtle grounding shadow under
      the basket mark plus a cleaner weave-line color (the theme's
      `border` token instead of a translucent primary overlay). That's
      the extent of what's doable without an image-generation tool or a
      real designer — a genuinely new icon concept/illustration is out of
      scope here. Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Persist
      onboarding progress mid-flow (branch:
      `feature/onboarding-progress-persistence`) — merged into `master`.
      Killing the app partway through the questionnaire lost every answer
      so far — draft state only ever lived in `useState`. Now autosaves
      the draft answers and current step to AsyncStorage (account-scoped,
      same pattern as the pantry/meal-plan caches) on every change from
      the account-creation step onward, and resumes into it on relaunch
      instead of restarting the whole questionnaire. Cleared on a
      successful finish, and on "Reset app"/"Delete account" so a fresh
      restart doesn't resume into stale answers. No backend involved.
      Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add haptic
      feedback on key actions (branch: `feature/haptic-feedback`) —
      merged into `master`. Installed `expo-haptics` and added a small
      shared wrapper (`src/utils/haptics.ts`, best-effort — a missing tap
      is never worth surfacing as an error). Wired a warning tap into the
      shared `confirmDestructiveAction` dialog (covers Reset app, Delete
      account, remove member, leave household, cancel invite,
      clear-checked, and bulk-delete in one place) and into the pantry
      item delete confirm (a separate hand-rolled dialog, not on that
      shared helper); a light tap on the shopping list's check/select
      toggle; and a success tap when onboarding finishes. Deliberately
      scoped to destructive confirmations plus the few most
      frequent/satisfying interactions, not sprinkled across every button
      in the app. Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add skeleton
      loading states (branch: `feature/skeleton-loading`) — merged into
      `master`. Dashboard, Pantry, and Recipes each just went blank
      (Pantry, Recipes) or showed a bare `ActivityIndicator` (Dashboard)
      during their initial load, with nothing hinting at the shape of what
      was coming. Added a shared pulsing placeholder primitive
      (`src/components/Skeleton.tsx`, plain `Animated` — no new dependency)
      and screen-specific composites shaped like the real content: a
      ring+text placeholder for Dashboard's health card, category-group/row
      shapes for Pantry, and a 2-column tile grid for Recipes. Only wired
      into the genuinely-blank initial-load case in each screen — pull-to-
      refresh on an already-populated list keeps showing the existing
      items with its own spinner, unchanged. Typecheck, tests, and an
      `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add
      keyboard-avoiding behavior to forms (branch:
      `feature/keyboard-avoiding-forms`) — merged into `master`. No
      screen in the app used `KeyboardAvoidingView` at all — confirmed by
      grep — so on forms with several fields the keyboard could cover the
      active field or the Save/Continue/Sign-up button, especially on iOS
      and smaller phones. Added an opt-in `avoidKeyboard` prop to the
      shared `Screen` component (default off, since most screens are
      lists — often FlatList-based — that manage their own scrolling and
      shouldn't get an extra wrapper) and turned it on for every actual
      form screen: the shared onboarding step layout (covers account
      creation and name/location in one place), Add/Edit Pantry Item,
      Edit Profile, Invite, Household Hub (its inline "add to shopping
      list" field), and Sign In/Sign Up/Forgot Password/Reset Password.
      The three auth screens that had no scroll container at all (Sign
      In, Sign Up, Forgot Password's form state) were also converted from
      a plain `View` to a `ScrollView` with `keyboardShouldPersistTaps=
      "handled"`, matching the pattern already used elsewhere, so there's
      still a way to reach the button if the fields alone don't fit above
      the keyboard. Along the way: checked the recently-added dark-mode
      Light/Dark/System toggle (originally on this batch's proposed list)
      and found it was already fully built and wired up in Profile — no
      work needed there. Typecheck, tests, and an `expo export` bundle
      all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Warn before
      losing unsaved form changes (branch:
      `feature/unsaved-changes-warning`) — merged into `master`. Add/Edit
      Pantry Item and Edit Profile had no "discard changes?" prompt — an
      accidental swipe-back or Android back-button tap silently lost
      whatever was typed, with no in-screen Cancel button as an alternate
      warning point either. Added a shared `useUnsavedChangesGuard` hook
      (`src/hooks/`) that intercepts React Navigation's `beforeRemove`
      event when the form has changed from its initial values (covers
      swipe-back, the hardware back button, and any other programmatic
      navigation away, not just a dedicated Cancel button) and confirms
      before discarding; a returned `allowLeave()` is called right before
      the `goBack()` that follows a successful save or delete, so the
      guard doesn't second-guess an already-confirmed action. Deliberately
      scoped to these two screens for now, not every screen with a
      `TextField`. Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add on-device
      OCR to receipt scanning — code complete on `feature/receipt-ocr`,
      **not merged into `master`** (see the human-decision task below).
      No photo scan could ever succeed before — the backend is a
      receipt-line *text* parser, not an image reader. Real OCR (not a
      cloud API) was the right call over a cloud alternative — free, no
      new API key/billing to manage, and matches the original scope —
      but it means the app would gain native code
      (`@react-native-ml-kit/text-recognition`) for the first time, so
      plain Expo Go could no longer run *any* part of the app; testing
      would need a one-time custom dev client build via `eas.json`'s
      existing `development` profile. Capture receipt → extract text
      on-device → send as `{ text }` to `/api/scan` (previously sent the
      raw photo, which the backend can't read). Also fixed the response
      mapping — real shape is `{success, itemCount, items: [{id, rawText,
      name, quantity: string, category, expiresAt, confidence,
      selected}]}`, not the guessed `NewPantryItem[]`; `quantity` parses
      to a number (falls back to 1 if unparseable), `unit` defaults to
      `"count"` since the backend doesn't return one at all. Left barcode
      mode as an honest "not working" notice rather than attempting it —
      confirmed backend-unsupported regardless of payload shape (see the
      earlier correction note on the receipt-scanning-reliability task).
      6 tests added for the new mapping function. **Not verified
      end-to-end** — needs an actual dev client build to test on a real
      device; typecheck, tests, and an `expo export` bundle all pass, but
      none of those catch native-linking issues the way they would for
      pure-JS work. Also, while investigating the Expo-Go-vs-dev-client
      tradeoff for this task, found and fixed several stale claims in
      README.md's "Known gaps / assumptions" section left over from
      earlier merged tasks (donate/notification placeholders, missing
      icon assets, no EAS project linked) — small enough to fold in here
      rather than its own task.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Extend the
      unsaved-changes-warning guard beyond Add/Edit Pantry Item and Edit
      Profile — merged into `master` (`feature/unsaved-changes-guard-extension`,
      confirmed via `git log --merges`, commit `eae35ee` — this entry
      previously said "not yet merged," found stale during the
      pre-TestFlight review). Added
      `useUnsavedChangesGuard` to Invite (dirty once a name, contact, or
      non-default role is entered on the details step; resets once the
      invite is actually sent, so swiping back from the "Invite sent"
      confirmation never prompts) and to Sign In, Sign Up, and Forgot
      Password (dirty once any field has content; Forgot Password stops
      guarding once the reset email is sent, since its "check your email"
      view has nothing left to discard). Deliberately skipped two of the
      four call-outs from the backlog note: Household Hub's inline
      "add to shopping list" field is a one-line draft submitted
      immediately by its own Add button/return key, and the surrounding
      screen has a dozen unrelated reasons to navigate away — wiring the
      guard there would pop a "Discard changes?" alert on almost any exit
      from Household Hub over a few characters that are trivial to
      retype, a worse experience than the gap it would close. The
      onboarding steps don't fit the hook's design at all: step-to-step
      movement inside `OnboardingScreen` is local `stepIndex` state, not
      React Navigation actions, so there's no `beforeRemove` event for
      the hook to attach to between steps; the fields-with-a-draft steps
      (name/location through goals/recap) already autosave to
      AsyncStorage via `onboardingDraftCache.ts` on every change and
      resume automatically after a restart, so a "Discard changes?"
      prompt would also be inaccurate on top of unwireable. `AccountStep`
      (step 0's email/password) isn't covered by that autosave, but it's
      the sole screen in its branch of the root stack with nothing
      beneath it to pop back to — hardware back there exits the app
      rather than firing a `beforeRemove` this hook could intercept.
      Typecheck, tests, and an `expo export` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Cover
      onboarding's embedded account-creation step with "Forgot password?"
      — merged into `master` (`feature/onboarding-forgot-password`,
      confirmed via `git log --merges`, commit `97c06fe`; this entry
      previously said "not merged, no merge confirmation requested," which
      was stale — found and fixed during the pre-TestFlight review).
      Onboarding's `AccountStep` has no navigator to push the
      standalone `ForgotPasswordScreen` onto, so instead of restructuring
      onboarding around a stack, added a third in-place mode ("reset") to
      the step itself: a "Forgot password?" link shown in sign-in mode
      swaps the step's fields for just an email field and a "Send reset
      link" button, reusing the exact same `authApi.requestPasswordReset`
      call and `reset-password` deep link
      (`Linking.createURL("reset-password")`) that `ForgotPasswordScreen`
      uses, then shows the same generic "check your email" confirmation
      regardless of whether the address has an account. Didn't need to
      touch the reset-password half at all — `ResetPasswordScreen` is
      already mounted at the root navigator regardless of onboarding
      state, so the emailed link resolves correctly no matter where the
      request came from. Extracted the mode-dependent
      title/subtitle/button-label/can-submit logic into a new sibling
      `accountStepLogic.ts` (the screen file itself isn't directly
      testable per repo convention), with 12 new tests covering all three
      modes. Typecheck, all 239 tests, and a real
      `expo export --platform ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Fix the
      remaining dark-mode contrast edge case on Pantry Stats — merged
      into `master` (`feature/pantry-stats-dark-contrast-fix`, confirmed
      via `git log --merges`, commit `e4eebf2` — this entry previously
      said "not yet merged," found stale during the pre-TestFlight
      review). Dark mode's secondary-colored category bar
      previously read at only ~2.15:1 against its track, since the track
      reused `colors.textMuted` — a color that's also used as body text
      in 30+ other places and couldn't just be darkened without affecting
      those. Added a dedicated `statBarTrack` token to both `lightColors`
      (`#8A8478`, same value `textMuted` already had, so light mode is
      unchanged) and `darkColors` (`#918C82`, a new value chosen so its
      luminance sits between the dark (`#3F3A35`) and light (`#FFFAF2`)
      border tones the bars' fills pick between — verified numerically
      with a throwaway Node script against the existing
      `contrastRatio`/`relativeLuminance` utilities, not eyeballed).
      `PantryStatsScreen`'s `CategoryBar` now reads `colors.statBarTrack`
      for the track background instead of `colors.textMuted`. All four
      dark-mode bars now clear 3:1 against the track: primary/accent/
      highlight (dark-text border) at ~3.36:1 each, secondary (light-text
      border) at ~3.22:1 — no exceptions left, versus the old ~5.03:1 /
      ~2.15:1 split where one of the four failed. Updated
      `contrast.test.ts`'s previously-documented "known exception" comment
      and added a passing dark-mode track-contrast assertion in its place.
      Typecheck, all 231 Jest tests, and an `expo export --platform ios`
      bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Set the iOS
      export-compliance flag — committed directly to `master`. Added
      `ios.infoPlist.ITSAppUsesNonExemptEncryption: false` to
      `app.json`, standard for an app that only uses HTTPS with no
      custom encryption. Without it, App Store Connect would otherwise
      stop on a manual encryption questionnaire for every single build
      submission.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a single
      "Clear filters" action to the Recipes screen for when both the
      meal-type and cuisine filter rows have an active selection (branch:
      `feature/recipes-clear-filters`) — merged into `master`.
      `RecipesScreen` now shows a right-aligned "Clear filters"
      link (the existing shared `CardHeaderLink`, the same component used
      for "Clear checked" on the shopping list) directly below the two
      pill rows, but only when `mealTypeFilter` and/or `cuisineFilter` is
      non-null; tapping it resets both to `null` in one action instead of
      requiring each row's own "All" pill to be tapped individually. Left
      the search box untouched — it's a separate, explicit action (a slow
      backend search, not an instant local filter) and out of scope per
      the backlog note. Extracted the "is either filter active" check into
      a new `hasActiveRecipeFilters` in `recipesLogic.ts`, matching the
      file's existing pure-logic-extraction convention, with 4 new tests
      covering all four null/non-null combinations. Typecheck, all 244
      Jest tests, and a real `expo export --platform ios` bundle all pass
      (the bundle check needed a one-off workaround: this worktree had no
      local `node_modules`, and once installed, Metro's blockList for
      `.claude/worktrees/*` — added to keep the main checkout's Metro from
      crawling *other* worktrees — also matches this worktree's own path
      when run from inside it, so the export was verified from an
      isolated scratch copy of the working tree instead; nothing under
      version control was changed to make this work).
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add
      swipe-to-delete gestures on Pantry and Shopping List rows (branch:
      `feature/swipe-gestures`) — merged into `master`.
      `react-native-gesture-handler` was already a dependency
      (used for navigation), so no new package was needed — used its
      built-in (if now deprecated in favor of a Reanimated version)
      `Swipeable` component, which doesn't require Reanimated either.
      Added a shared `SwipeToDelete` component
      (`src/components/SwipeToDelete.tsx`) that reveals a red "Delete"
      action on a right-swipe; wired into both Pantry list rows
      (category and expiry-sort views) and Shopping list rows. Chose
      delete over edit since it maps directly onto an action that
      already exists on both screens, rather than inventing a new
      inline-edit UI. Each screen routes through its existing delete
      path rather than a new one: Shopping list swipe calls the exact
      same `onRemove` handler the row's trash icon already used (no
      confirm dialog, matching that icon's current behavior) and is
      disabled while in bulk-selection mode, so swiping there doesn't
      fight with tap-to-select. Pantry had no per-row delete before this
      (only via the Edit Item screen), so swipe reuses that screen's
      exact confirm-dialog wording and current-meal-plan warning —
      extracted into a new shared, tested `buildPantryDeleteMessage()`
      in `pantryLogic.ts` so the Edit screen and the new swipe gesture
      can't drift apart on that message. 2 tests added for the new
      helper, suite at 242. Doesn't add Pantry delete undo (still a
      separate open backlog item above) or a Shopping list confirm
      dialog for single-item delete — both match the pre-existing
      behavior of the actions being reused, not a gap introduced here.
      **Not verified on a real device or dev client** — gesture-handler
      interactions like this can behave differently in Expo Go than in
      a real build (e.g. the deprecation notice on `Swipeable` mentions
      Reanimated-based gesture composition, which Expo Go doesn't
      handle identically); typecheck, all 242 tests, and a real
      `expo export --platform ios` bundle all pass, but none of those
      exercise the actual swipe gesture at runtime.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Decide against
      iPad support — committed directly to `master`. Set
      `ios.supportsTablet: false` in `app.json`. This is a phone-first
      app with no iPad-specific layout testing, and keeping it `true`
      would have required App Store Connect iPad screenshots and
      signaled iPad support to reviewers for a layout that was never
      actually verified there.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Set up a real
      support channel/contact — committed directly to
      `master`. Decided on a dedicated email (`shelfzero.2026@gmail.com`)
      over a personal address or a hosted support page. Added a "Contact
      support" link on Profile next to Privacy Policy/Terms of Service
      (`src/utils/supportContact.ts`, opens a `mailto:` link), and this
      is now the real address to enter as the App Store/Play Store
      listing's support contact once that task is picked back up.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Live-tested
      household invitations end-to-end against the live
      backend (two throwaway accounts, direct API calls) — found a real
      bug, worse than the assumption being tested. `GET /api/invites`
      never returns an invite once it's accepted (confirmed with no
      params and with `?status=accepted`/`?all=true`), only pending
      ones — so Profile's "Household members" list (built by filtering
      that same response for `status === "accepted"`) is always empty in
      practice, not just when there really are no members. Separately,
      `DELETE /api/household/members/:id` does work, but needs the
      member's real user account id, not the invite's id (confirmed:
      invite id → 404 "Household member not found"; the accepted user's
      own id → 200, and their `householdId` correctly went back to
      `null` after). Since accepted invites never come back from any
      endpoint, the client has no field to source that id from even if
      it wanted to. Added an honest note in place of "No members yet"
      explaining the list only reflects pending invites, not who's
      actually joined — see the new backend task below, since this
      isn't fixable from this repo.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Finished the
      Privacy Policy and Terms of Service drafts —
      republished both as new Claude Artifacts. The prior artifacts were
      created under a different Claude session with no ownership
      overlap here, so neither could be read or edited from this repo's
      session (confirmed: `WebFetch` on the old URL and the `Artifact`
      list both came back empty for this session's identity). Rewrote
      both from scratch grounded in the app's actual current behavior
      rather than trying to recover the old text: filled in the contact
      email (`shelfzero.2026@gmail.com`) and replaced the undecided
      "launch date" placeholder with a real "last updated" date instead;
      corrected stale claims along the way (donation history is real,
      shared, backend-stored data now, not local-only; recipe search,
      forgot-password, and account deletion are all real and shipped).
      Visually matches the app's actual theme (DM Sans, the real
      light/dark color tokens from `src/theme/colors.ts`) instead of a
      generic template. `PRIVACY_POLICY_URL`/`TERMS_OF_SERVICE_URL`
      updated to the new URLs. **Still needed:** share both from the
      Artifact page's share menu so they're actually publicly viewable
      (they're private by default), and eventually move them to a real
      domain — see the updated task below.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Created and seeded
      a reviewer/demo account for App Review. A real
      account on the live backend (`shelfzero.2026+demo@gmail.com`,
      password in `STORE_LISTING.md`), pre-loaded with 8 pantry items
      (expiry dates spread from 2 to 17 days out so the health score and
      "expiring soon" card have real data), 3 shopping list items, and 1
      donation history entry, so a reviewer sees a working app instead
      of an empty one. Deliberately didn't pre-generate a meal plan,
      since that's a real call to a slow, occasionally rate-limited AI
      backend (see the meal-plan-timeout task below) — safer to let a
      reviewer trigger it live against the already-populated pantry.
      Credentials documented in `STORE_LISTING.md` for pasting into App
      Store Connect's "App Review Information" and Google Play's "App
      access" section.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) **Critical fix:**
      meal-plan generation was silently producing nothing.
      Found while pre-checking the app for TestFlight — live-tested
      `POST /api/meal-plan` directly and found the real response shape
      doesn't match what the client was reading at all: the actual day
      list lives under `plan.days`, not the top-level `days` field
      (which is just an echo of the request's day count, a number, not
      an array); and each day's `meals` is an object keyed by meal type
      (`breakfast`/`lunch`/`dinner`) with a `name` field, not the array
      of `{label, title}` the rest of the app expects. The result: "Generate
      7-day plan" made real, successful network calls every time, but
      `plan.days[0]` silently evaluated to `undefined` on every single
      day, so the screen ended up with an empty plan and no error message
      — the app's core AI-meal-plan feature was completely non-functional
      for every real user, despite `npm test`/typecheck/bundle checks all
      passing (none of them call the live API, so none could catch a
      runtime shape mismatch). Added a tested `parseMealPlanDays()`
      conversion function (verified against the exact JSON captured live,
      not just a hand-written fixture) and fixed all three call sites
      (`handleGenerate`, `handleRegenerateDay`, and `useSuggestedRecipes`,
      which derives Recipes-screen suggestions the same way). Also
      confirmed cross-member sharing (donations, pantry) works correctly
      with two real linked accounts while investigating. **Note:** a
      single-day request succeeded in ~10s in this test, faster than the
      ~20-21s timeout documented on 8/16 for the same payload — unclear if
      that's backend variance or an improvement; the *un-scoped* full-week
      call (what `useSuggestedRecipes` sends) still timed out at ~20s as
      before, so the timeout task below is still real and separate from
      this parsing fix. 3 tests added, suite at 243.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Ran a full
      pre-TestFlight code review (`/code-review high` over
      everything since batch6) and fixed the real findings:
      - `ResetPasswordScreen`'s "Sign in" button targeted a route
        (`Auth`) that isn't always registered — reached from onboarding's
        embedded reset flow, the stack only has `Onboarding` +
        `ResetPassword`, so the button silently did nothing. Now prefers
        dismissing back to whatever was already showing, falling back to
        a state-aware reset (matching `RootNavigator`'s own logic) only
        when there's nothing to go back to. Also added the
        `useUnsavedChangesGuard` this screen was missing relative to
        every other auth form.
      - Tapping a favorited recipe passed the raw (non-favorite-flagged)
        item to `RecipeDetail` instead of the corrected object the tile
        itself rendered, so the detail screen's favorite button showed
        "Add to favorites" for an already-favorited recipe and would
        have called `add` again instead of `remove`.
      - `ProfileScreen`'s leave-household flow said "Couldn't leave
        household" even when leaving actually succeeded and only the
        follow-up re-provisioning failed, leaving the user in a real
        no-household state with a misleading error. Now distinguishes
        which step failed and points at the one real recovery path
        (sign out/back in re-triggers household creation).
      - `DonationContext.refresh()` wiped the visible donation history to
        empty on *any* failed fetch, including a transient one right
        after `recordDonation`'s own post-create refresh — a real
        donation could appear to vanish. Now leaves existing history
        alone on a failed refresh instead.
      - `MealPlannerScreen`'s "add missing ingredients" action read a
        stale `shoppingItems` closure across loop iterations, so two
        same-named ingredients in one meal's missing list (e.g. "Garlic"
        twice) both missed the existing-item check and created duplicate
        shopping-list rows instead of one bumped quantity. Now tracks a
        locally-updated view of the list through the loop.
      - `DonationHistoryScreen` had no pull-to-refresh in its empty state
        and never re-fetched on focus, so a first donation from another
        household member could stay invisible until an app restart.
        Added a focus-refresh, matching Pantry/Recipes' existing pattern.
      - `pantryLogic.ts`'s plural-matching `singularize()` mishandled
        words whose singular already ends in "-ie" (cookies → "cooky",
        movies → "movy", pies → "py" instead of cookie/movie/pie) —
        currently dormant since no such keyword exists yet in
        `CATEGORY_KEYWORDS`, but exported and tested to catch it before
        it silently ships alongside a future keyword.
      - Corrected three `TASKS.md` entries that said their branch was
        "not yet merged" when `git log --merges` shows they've actually
        been on `master` since this range began (commits `e4eebf2`,
        `97c06fe`, `eae35ee`).
      - Not fixed, filed as a Later backlog item instead: 4+ files
        (`mealPlanCache.ts`, `onboardingDraftCache.ts`, `usePantry.ts`,
        `NotificationPreferencesContext.tsx`) independently reimplement
        the same account-scoped-cache pattern — a real simplification
        opportunity, not a correctness bug, so left for its own pass.
      6 tests added, suite at 249. Typecheck, all tests, and a real
      `expo export --platform ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Wire the app
      up to the real household-members endpoint (branch:
      `feature/household-members-endpoint`) — merged into `master`.
      Airo added `GET /api/household/members` (real account id, name,
      role; rejects unauthenticated requests) after this was flagged as
      a backend gap (see the live-tested honesty fix above).
      "Household members" on Profile previously derived its list by
      filtering accepted invites — which don't even come back from
      `GET /api/invites` once accepted, so the section could only ever
      show pending invites masquerading as members. Added a
      `useHouseholdMembers` hook that fetches the real endpoint, and
      swapped Profile's derived-from-invites list for it (also reverting
      the honest "not listed here yet" empty-state message back to a
      plain "No members yet," since the gap it described no longer
      exists); the member row's role now shows the real account role
      ("Owner"/"Member") instead of the invite's role field
      ("Adult"/"Guest"/etc), since that's what's actually returned now.
      `removeMember` moved off `useInvites` (where it only ever existed
      as a workaround for not having real member ids) onto the new
      hook, and now filters by the real id it removed instead of an
      invite id that was never guaranteed to match. Typecheck, the full
      test suite, and a real `expo export --platform ios` bundle all
      pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Split
      meal-plan generation down to one meal per call (branch:
      `feature/mealplan-meal-scoped`) — merged into `master`, **not yet
      verified against the live backend**. Airo's 8/16 diagnosis was
      that even a single day-scoped call still timed out (~20-21s)
      because one day asks for all 3 meals (breakfast/lunch/dinner) in
      one call; they've since added `mealLabel`
      (`breakfast`/`lunch`/`dinner`) to `POST /api/meal-plan`, scoping a
      request down to one specific meal. "Generate 7-day plan" now
      makes 21 single-meal calls (7 days x 3 meals) instead of 7
      single-day calls, stitching each day back together from its 3
      meal responses (through the same `parseMealPlanDays` conversion
      the day-scoped fix already relies on); a day only lands in the
      result once all 3 of its meals succeed, same partial-failure
      semantics as before. "Regenerate one day" got the same treatment.
      Also converted `useSuggestedRecipes.ts` (Recipes screen's
      suggestion list), which had the same root problem but worse — it
      requested the full 21-meal week with no scoping at all, the
      single slowest possible call. Since that's an automatic
      on-mount/on-retry fetch rather than a button press with a
      progress UI, scoped it down to one day's 3 meals (3 calls) rather
      than the full 21 — bounded and fast rather than maximally varied.
      Also fixed two comments in `mealPlannerLogic.ts` that were already
      stale before this change (one described a "splice into a freshly
      generated whole week" regenerate mechanism that hasn't existed
      since the 8/16 day-scoping fix). Typecheck, the full test suite,
      and a real `expo export --platform ios` bundle all pass — **but
      this hasn't been run against the actual live API yet**, so it's
      unconfirmed whether `mealLabel` behaves exactly as described (e.g.
      whether a scoped response's `meals` object really only contains
      the one requested key) or whether the extra round-trips end up
      meaningfully faster in practice. Needs a real live test before
      relying on it for the TestFlight submission.
      **Correction, live-tested 8/31 against the real API with the demo
      account** (signed in directly via `curl` — the phone's wifi was
      down, so this was the only way to actually verify it): `mealLabel`
      is **not** read or validated by the backend at all. Sending an
      invalid value (`"brunch"`, not breakfast/lunch/dinner) still
      returned `200` with a real, complete 3-meal day — Airo's
      description of it doesn't match live behavior. Since every
      "meal-scoped" call was actually returning all 3 meals regardless
      of which one was asked for, the 21-call loop would have jammed 9
      duplicate-slot meals into every day. **Reverted** both
      `MealPlannerScreen.tsx` handlers and `useSuggestedRecipes.ts` back
      to day-scoping only (no `mealLabel`), and removed the now-dead
      `mealLabel`/`MealSlotLabel` code from the request type and
      `mealPlannerLogic.ts` rather than leave it around unused and
      misleading. Separately live-tested day-scoped calls in isolation
      (4 different days, 7-15s each, all succeeded) — this is what led
      to reverting rather than just also abandoning day-scoping — but a
      full sequential 7-day run (exactly what "Generate 7-day plan"
      actually does) only succeeded on 4 of 7 days, `504`-timing out on
      the other 3 at ~20-21s each. That's a real improvement over 8/16
      (where every single day-scoped call failed) but still genuinely
      intermittent, and looks like backend load/capacity variance under
      back-to-back calls rather than anything a client change can fix.
      The existing partial-failure handling (keep whatever days
      succeeded, show a clear error, point at per-day regenerate)
      already covers this gracefully — this isn't a crash, just a
      normal, already-handled failure mode that happens more often than
      it should. See the updated backlog item below. Also confirmed
      recipe search (`GET /api/recipes?q=`) still `504`s (~11s),
      unrelated to and unaffected by any of this. Re-ran typecheck, the
      full test suite, and a real `expo export --platform ios` bundle
      after reverting — all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add a
      one-time automatic retry to meal-plan generation calls —
      committed directly to `master`. Added `retryOnce()`
      (`src/utils/retryOnce.ts`, 3 tests) and wired it into both
      `MealPlannerScreen` calls (`handleGenerate`'s day loop and
      `handleRegenerateDay`) and `useSuggestedRecipes`, so a failed call
      gets one immediate second attempt before counting as a real
      failure — a reasonable mitigation for the transient-504-timeout
      pattern seen live-testing the task above. Live-testing it further
      surfaced a `429` "temporarily busy" rate-limit state that a retry
      doesn't help with (it hits the same limit instantly) — see the
      full findings and open question in the backlog item below. Kept
      the retry regardless since it's a real improvement for genuine
      transient 504s and does no harm against 429s. Typecheck, all 258
      tests, and a real `expo export --platform ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Stopped
      `npm test` from silently running 367 duplicate test files —
      committed directly to `master`. Investigating a suspicious "6233
      tests passed" count turned up leftover `.claude/worktrees/*/`
      scratch directories (other Claude Code sessions' isolated
      worktrees) sitting inside the repo, each a full copy of every test
      file; Jest had no `testPathIgnorePatterns` telling it to skip
      them, so it ran ~25 duplicate copies of the real 255-test suite
      alongside the real one every time. Added
      `testPathIgnorePatterns: ["/node_modules/", "<rootDir>/.claude/worktrees/"]`
      to `package.json`'s Jest config (the `node_modules` entry is
      Jest's own default, otherwise lost by overriding the option at
      all) — `npm test` now reports the real 255 and runs in ~5-8s
      instead of ~70s. The worktree directories themselves are untouched
      (they're not git-tracked, per `.git/info/exclude`, so this was
      purely a test-runner scoping fix, not a cleanup).
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Wire the
      Scan screen up to the real barcode lookup endpoint (branch:
      `feature/barcode-lookup`) — merged into `master`. Airo added
      `GET /api/barcode/:code` (public, no auth) after the barcode
      feature request was sent — resolves a barcode to a real product
      via Open Food Facts (`{ name, category, brand?, source }`) instead
      of the old `/api/scan` path, which is confirmed to still only
      ever accept a receipt's `text`/`lines` regardless of payload
      shape. Live-tested directly (`curl`, no token needed) before
      wiring anything, same discipline as the `mealLabel` check: real
      products **do** resolve correctly (Diet Coke, Pringles both came
      back with real names/categories), invalid-format codes correctly
      `400` with `INVALID_BARCODE`, but roughly 4 of 6 spot-checked
      real UPCs returned `503 BARCODE_LOOKUP_UNAVAILABLE` — Airo's own
      example UPC included, retried and still `503`. That looks like a
      product Open Food Facts doesn't have, mismapped to the
      "unavailable" error code instead of the documented
      `BARCODE_NOT_FOUND`, rather than a real outage, since well-known
      products consistently succeed — but that's a mapping bug for Airo
      to fix, not something to work around client-side. Added
      `scanApi.lookupBarcode()`, a `BarcodeProduct`/`BarcodeLookupResponse`
      type, and a new `scanLogic.ts` (`barcodeProductToPantryItem`,
      `barcodeLookupErrorMessage` — reads the response body's `code`
      field for a specific message per error case) with 5 tests.
      `ScanScreen`'s barcode mode now shows a real single-item review
      instead of always failing; the honest "isn't working yet" notice
      is now receipt-mode only, since barcode scanning genuinely works
      for products the lookup actually has. Typecheck, all 263 tests,
      and a real `expo export --platform ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Replace the
      "identify a real donation partner" gap with honest suggestions
      instead (branch: `feature/donation-suggestions`) — merged into
      `master`. No real partner org or API has ever been identified to
      integrate with, and there's no location data in the app to make
      "nearby" a real, verified claim (onboarding only collects a
      free-text location string; the Data Safety answers in
      `STORE_LISTING.md` explicitly say no location is collected, and
      changing that right before a submission wasn't worth it). Instead
      of a fake partner list or a real integration neither of those
      allow for right now, `DONATION_PARTNERS` in `DonateScreen.tsx` now
      lists real, well-known donation-finder resources (Feeding
      America, AmpleHarvest.org, 211, a maps search for "food bank near
      me") — each with a real link (new `open-outline` icon per row,
      split into its own tappable area from the existing select-radio
      Pressable to avoid nesting two Pressables) that opens their own
      website, where the actual proximity/contact lookup happens. The
      donation-history recording behavior is unchanged — selecting one
      still just labels the donation, same as before — but the
      disclaimer now says plainly that these are suggestions to look
      up and contact yourself, not a real handoff, replacing the old
      "no real organization is notified" placeholder wording. Typecheck,
      all 263 tests, and a real `expo export --platform ios` bundle all
      pass.
      **Follow-up (branch: `feature/donation-accepted-items`) — merged
      into `master`:** added an `accepts` field to `DonationPartner` and
      a line per suggestion describing what it accepts, since that
      varies a lot by resource — Feeding America's network mostly takes
      unopened/unexpired canned or boxed goods (varies by the specific
      food bank), AmpleHarvest.org is specifically for fresh produce and
      garden surplus rather than packaged goods, and 211/the maps search
      are general directories with no food-specific guarantee at all.
      Deliberately general guidance about each *resource*, not a promise
      about any one specific organization, since this app has no way to
      know what a specific local food bank actually takes. Typecheck,
      all 263 tests, and a real `expo export --platform ios` bundle all
      pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Republish
      the Privacy Policy and Terms of Service with the minimum age set
      to 13 (branch: `feature/policy-republish-age-13`) — merged into
      `master`. Same root problem as the 8/29 republish: the versions
      live at the current `PRIVACY_POLICY_URL`/`TERMS_OF_SERVICE_URL`
      were created under Laya's Claude session, which this session has
      no ownership of — confirmed by trying to read both via `Artifact`
      `action: "read"`, both came back "not found... has not been
      shared with you." Rather than route the edit through her session,
      rewrote both fresh (same content/structure as the 8/29 versions,
      grounded in the app's actual behavior) and published them under
      this session instead, so this session can maintain them going
      forward without hitting the same wall. Sets the account minimum
      age to 13 (a COPPA-aligned line, common for consumer apps) in
      both documents; the Privacy Policy also adds Open Food Facts as a
      third-party processor (barcode lookups — just the scanned number,
      confirmed no personal data included) alongside the existing
      Airo/Gemini entries, and the Terms of Service adds a section on
      the donation suggestions feature (general resources, not a real
      handoff — matches the disclaimer already in `DonateScreen.tsx`).
      Visually matches the app's real theme (DM Sans, the exact
      light/dark tokens from `src/theme/colors.ts`), same as the
      versions being replaced. **Still needed, same as before:** share
      both from the Artifact page's share menu so they're actually
      publicly viewable — they're private by default, and the old
      "Content is user-generated and unverified" banner problem
      (private/shared artifacts can still show it to a public viewer)
      isn't resolved by a republish alone; see the "host at a real
      permanent URL" task below, still the actual fix for that.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Fix two
      stale scanning references — committed directly to `master`.
      `README.md`'s API-module table only ever listed `scan.ts | POST
      /api/scan`, missing the barcode endpoint entirely and, while
      checking, four other modules that had never been added
      (`household.ts`, `donations.ts`, `recipes.ts`, `auth.ts`) — filled
      in all of them. `STORE_LISTING.md` still said scanning was
      deliberately left out of the marketing copy entirely and that the
      Data Safety table's camera row was "not fully working yet" — both
      stale now that barcode scanning is real. Added a barcode mention
      to the full description, updated the camera row to accurately
      describe what actually happens (barcode: only the number is sent,
      never a photo; receipt: same on-device-first principle, once
      merged), and reworded the top-of-file note to distinguish barcode
      (real, mentioned) from receipt (still not merged/verified, still
      deliberately excluded).
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Rebuild meal
      plan generation to build the week up one day at a time instead of
      all 7 at once (branch: `feature/mealplan-daily-generation`) —
      merged into `master`. Re-tested 9/1 (a new day, real time passed
      since the `429`s) and found single isolated calls now succeed
      cleanly (200 OK, ~7-9s, 2/2) — the shared rate limit really had
      cleared, supporting the theory it was exhausted by yesterday's
      heavy testing rather than a permanent capacity problem. But firing
      7 of those back-to-back is exactly the pattern that tripped it
      before, so rather than trust that a burst of 7 stays safe, the
      "Generate 7-day plan" button is gone. Generation now happens one
      day at a time: a `nextWeekdayIndex()` helper (new, tested, in
      `mealPlannerLogic.ts`) starts from today's real weekday and wraps
      forward through the week, returning the next day not yet
      generated (or `null` once all 7 exist). The primary button reads
      "Generate {day}'s meal plan" and only shows before any day exists;
      once at least one day is generated, an outlined "+ Add {day}'s
      plan" button appears below the list instead, letting the user
      build out the rest of the week at their own pace — never more than
      one request at a time, however many days they choose to add.
      `saveMealPlanToHistory` now fires once the 7th day lands, whichever
      order they were added in, instead of only after a single bulk
      call. The stale-pantry banner's "Regenerate now" now clears the
      plan and generates a fresh day for today, replacing the old bulk
      regenerate. Per-day "Regenerate" links are unchanged - already
      single-day calls. Removed `buildGenerationFailureMessage` (no
      longer meaningful once every generation is a single atomic call,
      not a batch with partial success to report) and its tests, and
      fixed a stale comment on `replaceDayInPlan` left over from the
      reverted `mealLabel` work ("3 meal-scoped calls" - it's one
      day-scoped call). Live-verified the exact `dayIndex` mapping this
      relies on against the real API: `dayIndex: 1` (today, a Tuesday)
      returned `"day":"Tuesday"`; incrementally adding `dayIndex: 2`
      returned `"day":"Wednesday"` - confirms `nextWeekdayIndex()`'s
      real-calendar-to-`dayIndex` mapping is correct, not just internally
      consistent. 6 tests added/changed net (2 removed, 8 added), suite
      at 267. Typecheck, all tests, and a real `expo export --platform
      ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Fix an
      app-wide "401 error on everything" bug, and fix onboarding
      starting on the questionnaire's 2nd step instead of the 1st
      (branch: `feature/fix-session-expiry-and-onboarding-start`) —
      merged into `master`. Found while live-testing with Laya: once a
      stored auth token was invalidated (e.g. a leftover session from
      earlier testing), `client.ts` deleted it on the resulting 401 but
      never told `AuthContext`, so `isSignedIn` stayed stuck `true` and
      every screen just kept 401ing with no way back to sign-in short of
      manually signing out. `client.ts` now calls a handler
      `AuthContext` registers on mount, flipping `isSignedIn` to `false`
      the moment a token gets invalidated. The same stale-token state
      also explained the onboarding bug: `OnboardingScreen` skipped
      straight to step 1 (past the account step) whenever a token
      happened to be present at mount — meant as a restart-resume
      shortcut, but a genuine resume is already handled by the separate
      draft-cache restore a few lines below, so this only ever fired for
      a leftover token with no cached draft. Removed the skip; onboarding
      now always starts at the account step. 3 tests added, suite at
      270. Typecheck, tests, and a real `expo export --platform ios`
      bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Make
      donation confirmation actually send you to a place to donate
      (branch: `feature/donation-take-me-there`) — merged into
      `master`. The real fix behind this was already merged
      (`feature/donation-suggestions`, `feature/donation-accepted-items`)
      — real link-out resources since there's no real food-bank API or
      location data to integrate with — but the actual "go there" link
      was a small icon on the partner-selection row, separate from the
      Donate button, easy to never tap; confirming a donation just said
      "N items donated to X" with nothing having actually happened. The
      confirmation screen now leads with an "Open X" button that opens
      the partner's real site, plus honest copy clarifying nothing's
      happened yet until you do. Also added FoodPantries.org (a real
      national food-pantry directory), rounding the suggestion list out
      to five. Typecheck, all 270 tests, and a real `expo export
      --platform ios` bundle all pass.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fixed household
      link-sharing end to end, per live user testing — independently
      discovered the same `GET /api/household/members` endpoint as
      Laasya's session above (both found it live-testing around the same
      time) and built on her `useHouseholdMembers` hook once reconciling
      the two branches. Several real, confirmed-live fixes beyond the
      members-endpoint wiring:
      - **Invite flow was lying about sending anything.** The backend has
        no way to actually text/email an invite — `POST /api/invites`
        only ever creates a shareable link record, regardless of contact
        info attached, and nothing is ever sent anywhere. The old flow
        asked for a phone/email plus a name and role, then said "Invite
        sent," which is exactly the bug reported live. Replaced with a
        single "Generate invite link" action, no name/role/contact
        fields at all (the invitee's real name/role come from their own
        account once they accept, not a guess entered ahead of time),
        and honest "Invite link ready" / "share this yourself" copy.
      - **Self-exclusion + exact wording on remove-member.** Building on
        the members endpoint, excluded the signed-in user's own row from
        the remove action (labeled "(You)" instead) and reworded the
        confirm dialog to "Are you sure you want to remove {name}?" per
        the exact wording requested, plus refetch-on-focus so
        removing/inviting elsewhere and coming back shows current data.
      - **Removed-member experience.** Confirmed live: the moment
        someone's removed, their access is cut instantly (immediate 403
        "No household" on every household-scoped call) — there's no
        window afterward to fetch what they had, so "keep their data"
        isn't something a client can do after the fact. Built the
        confirmed, buildable version instead: `AuthContext` now detects
        this (on relaunch, comparing against a new
        `hasHadHousehold`/account-scoped flag, and mid-session via
        `usePantry`/`useShoppingList` catching the same "No household"
        error) and shows a clear `RemovedFromHouseholdScreen` explaining
        what happened, with a "Continue" button that sets them up with a
        fresh household — same outcome "Leave household" already had,
        now explained and consented to instead of silent.
      - **"Leave household" already existed** (Profile screen, fixed for
        its own bug in the pre-TestFlight review) — flagging since it
        wasn't obvious in testing.
      - **Repeat pantry items now merge.** Adding an item with the same
        name and unit as one already in the pantry bumps its quantity
        instead of creating a duplicate row, mirroring the shopping
        list's existing dedupe behavior. Matched on name *and* unit
        (unlike the shopping list) since a pantry item's unit actually
        carries meaning — "Milk (1 L)" and "Milk (2 ct)" are genuinely
        different tracked things, not one item with a confused quantity.
      - Renamed Household Hub's "Members & invites" card to "Pending
        invites," matching what it's always actually shown (it can never
        list accepted members — the real list lives on Profile).
      Cross-member sharing (pantry, shopping list) was confirmed already
      working correctly via live two-account testing — not touched.
      New tests for the pantry merge logic; typecheck, all tests, and a
      real `expo export --platform ios` bundle all pass after reconciling
      both branches together.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Deep-link
      donation partners to real location-scoped results (branch:
      `feature/donation-location-deep-links`) — merged into `master`.
      Wanted: many food banks nationwide, sorted by proximity, with real
      open/closed status and what they accept — flagged as a new
      Airo-only backend task (needs a real directory API proxied
      server-side plus device location, which the app collects none of
      today). This is the smaller, no-backend-needed piece done in the
      meantime: Feeding America's and FoodPantries.org's links used to
      just open each site's bare homepage. Verified against the real
      sites (not guessed) that both actually support a URL-driven
      search — Feeding America's locator JS reads `?zip=`/`?state=` and
      auto-runs the search on load; FoodPantries.org has real
      `/zip/{zip}` and `/st/{state}` pages. New `donateLocationLinks.ts`
      parses the onboarding "City, State" text for a zip or a real state
      abbreviation and builds the location-scoped URL, falling back to
      the plain homepage otherwise. AmpleHarvest's search is AJAX-only
      (no URL param) and 211 has no unified national search, so those
      two are unchanged. Also improved the maps-search link to use the
      actual typed location instead of a hardcoded "near me". Honest
      caveat: onboarding has no dedicated zip field, so most users
      typing just "City, State" land on the coarser state-level result,
      not the zip-level one. 14 tests added, suite at 284. Typecheck,
      tests, and a real `expo export --platform ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Remove the
      "Estimated waste savings" card from Pantry Stats (branch:
      `feature/remove-waste-savings`) — merged into `master`. It
      computed $3.50 × every non-expired pantry item, regardless of
      whether that item was ever actually at risk of being wasted —
      buying 10 items and never touching them "saved" $35, which didn't
      hold up as a real metric even with the existing "rough estimate"
      disclaimer. Removed outright rather than patching the math, since
      there's no real per-item cost data to base a meaningful number on.
      Typecheck, all 284 tests, and a real `expo export --platform ios`
      bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Stop
      `retryOnce` from immediately retrying a 429, fix stale "7-day
      plan" copy (branch: `feature/mealplan-no-retry-on-429`) — merged
      into `master`. Reported as "meal planning isn't working" —
      live-tested again (9/2) and confirmed it's the same still-open
      backend rate-limit issue from the entry below, not a new
      regression: a single isolated call still succeeds cleanly
      (~7-8s), but a few calls in quick succession still reliably hit a
      `504` then two `429 "temporarily busy"` responses. Not fixable
      client-side, but found one real improvement along the way:
      `retryOnce` retried a 429 exactly like any other failure — an
      instant second request into a backend that just said "I'm
      rate-limited" only adds load and makes the user wait through two
      failing calls for no realistic chance of a different result. Now
      skips the retry specifically for a 429, still retrying instantly
      for a genuine transient failure like a 504 (what it was built
      for). Also fixed `MealPlanHistoryScreen`'s empty-state message,
      still saying "generate a full 7-day plan" — stale since the
      day-by-day rebuild removed that single action entirely. 2 tests
      added, suite at 286. Typecheck, tests, and a real `expo export
      --platform ios` bundle all pass.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add quantity
      shortcuts, more categories, and more expiry shortcuts to Add Item
      (branch: `feature/add-item-more-options`) — merged into `master`.
      Quantity: added Half dozen (6) / Dozen (12) / 2 dozen (24) shortcut
      pills next to the Quantity field, same tap-to-fill pattern as the
      existing expiry shortcuts. Categories: added Seafood, Snacks,
      Condiments, Spices & Seasonings, and Baking alongside the original
      8, and moved/split the auto-suggest keywords (fish/salmon/shrimp
      out of Meat into Seafood; flour/sugar, spice, honey/sauce, and
      cracker out of Pantry into their new categories) so typing an item
      name actually suggests the new categories instead of them just
      being selectable with no suggestions ever pointing at them. Also
      generalized `filterCategoriesByDietaryPrefs`, which only ever knew
      how to hide "Meat" specifically, into a category→diet-tag map —
      Seafood is now correctly hidden for Vegetarian/Vegan but stays
      visible for Pescatarian, same reasoning Meat already had. Expiry:
      added 1 day, 3 months, 6 months, and 1 year shortcuts alongside the
      original 4, covering both very-short-life items and the
      long-shelf-life items the new categories add. 9 tests added, suite
      at 291. Typecheck, tests, and a real `expo export --platform ios`
      bundle all pass.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Redesigned
      Household Hub with a member avatar row and reordered
      sections, per direct request. A horizontal row of circular avatars
      now sits at the top (each a color-coded initial, deterministic per
      person so the same member always gets the same color, using
      `readableTextColor` — same contrast utility as the Pantry Stats
      audit — so the initial is always readable against whichever of the
      4 palette colors that member landed on). Each avatar shows a small
      bubble in its top-right corner with that member's most recent real
      activity: `+ ItemName` for a pantry or shopping-list addition,
      "❤️ Donated" for a donation — deliberately only built from data the
      app actually tracks (pantry/shopping `addedBy`, donations'
      `donatedBy`, now modeled in `PantryItem`/`DonationRecord` since
      nothing previously needed them client-side) via a new tested
      `computeLatestActivityByMember()`. Sections below reordered to
      Shopping list, Donate surplus, Pending invites, Notifications, per
      the exact order requested. 8 tests added, suite at 299. Typecheck,
      tests, and a real `expo export --platform ios` bundle all pass.
      **Not built:** changing your own profile picture — investigated
      live, BetterAuth's standard `POST /api/auth/update-user` route
      exists (returns a real `401`, not a routing `404`) but rejects this
      app's Bearer-token auth entirely; every other variant tried
      (`PATCH`/`PUT`/`POST` on `/api/me` and a few `/api/auth/*` paths)
      404s. There's currently no way to persist a profile image from this
      client at all — see the new backend task below.
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Fixed the avatar
      row overlapping the Shopping list card below it. A horizontal
      `ScrollView` with only `contentContainerStyle` set doesn't reliably
      shrink-wrap to its content's real height — it was collapsing
      shorter than the avatar circle + name label it contains, so the
      names got visually covered by whatever card came right after it.
      Added an explicit `height` to the `ScrollView`'s own `style`,
      computed from the actual padding/circle/text tokens instead of
      guessed.
      **Follow-up, per live device feedback:** still touching. The
      computed value used the raw `typography.caption` `lineHeight`
      token, which measures shorter than how the name text actually
      renders on a real device. Bumped the height further (104 → 132)
      and added real breathing room (bottom padding + a margin) below the
      row instead of a tight fit, so it's not right back to touching the
      next time text rendering measures a few px taller than expected.
- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Stop
      trusting the backend's unreliable per-ingredient `inPantry` flag
      (branch: `feature/mealplan-real-pantry-match`) — merged into
      `master`. Reported: pantry items like pasta/alfredo sauce/veggies
      didn't seem to be recognized by the meal planner. Live-tested
      directly against `/api/meal-plan`: the response's own
      `ingredients[].inPantry` flag came back `false` across the board,
      including for "olive oil" when "olive oil" was the exact literal
      pantry item name sent in the same request — so `missingIngredients()`
      (feeding the "Missing: X, Y" list and "Add missing to shopping
      list") was trusting a flag that's essentially always wrong. New
      `ingredientInPantry()` recomputes this client-side against the
      real current pantry names instead: word-boundary matching (every
      word of the pantry item name has to appear in the ingredient
      name, not a raw substring), so "chicken" correctly matches
      "cooked chicken breast" and "olive oil" matches "olive oil"
      without a short item like "egg" false-matching "eggplant". Honest
      gaps, not fixed by this: a vague pantry entry like "Veggies"
      won't match a recipe's specific "broccoli" — no way to know what
      a generic name refers to from the string alone; and whether the
      backend's AI actually builds a meal *around* what's in the
      pantry (vs. suggesting something largely unrelated) is a
      server-side prompt/model decision, still unverified as of this
      entry since the backend was rate-limited through the rest of this
      testing session — re-verification in progress, see the note
      below. 8 tests added, suite at 312. Typecheck, tests, and a real
      `expo export --platform ios` bundle all pass.

### Not yet assigned

**Priority key:** ![MVP](https://img.shields.io/badge/MVP-red) must be
done before the app store submission — ![Later](https://img.shields.io/badge/Later-green)
can wait until after launch.

#### Backend (Airo only)

Requires a change in the Airo AI Builder dashboard — not buildable from
this repo.

- [ ] ![Later](https://img.shields.io/badge/Later-green) Add a real
      nearby-donation-centers endpoint (e.g. `GET
      /api/donation-centers?lat=&lng=`) so Donate can show many real
      food banks/pantries sorted by proximity, each with whether it's
      currently open and what it accepts — not just today's 5 static
      link-out resources (Feeding America, AmpleHarvest.org, 211,
      FoodPantries.org, a maps search). No nationwide directory with
      that data is exposed by any of those sites' own APIs (none of
      them publish one), so this needs Airo to source/proxy a real
      directory (e.g. Google Places API) server-side — keeping any API
      key off the client, same reasoning as every other Airo-only
      integration. Once this exists, the client-side follow-up is
      adding real device location: the app collects none today
      (Privacy Policy / App Store Data Safety answers explicitly say
      so), so that also needs a permission prompt and a privacy-policy
      update before it can be wired in.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Add a way to
      set a user's profile picture that actually works with this
      app's Bearer-token auth. Confirmed live: BetterAuth's standard
      `POST /api/auth/update-user` route exists (a real `401`, not the
      generic Express `404` every made-up route returns) but rejects the
      Bearer token every other `/api/*` route accepts — it expects a
      session cookie instead, which this client never has. Needs either
      a custom Bearer-token-compatible endpoint (e.g. `PATCH /api/me`
      accepting an `image` field/upload) or a way for the client to also
      obtain a BetterAuth session cookie. Until then, Household Hub's
      member avatars are initials-only, generated client-side.
- [ ] ![MVP](https://img.shields.io/badge/MVP-red) Make `/api/meal-plan`
      actually build meals around the pantry items it's sent, not just
      loosely riff. Confirmed live, twice, not a one-off: sending
      `pantryItems: ["pasta", "alfredo sauce", "broccoli", "carrots",
      "onion"]` came back with Yogurt with Berries and Granola /
      Chicken Salad Sandwich / Baked Salmon with Asparagus for the
      day — zero connection to any pantry item, pasta and alfredo sauce
      unused anywhere. A separate earlier test (chicken, rice, broccoli,
      onion, garlic, olive oil, tomato) showed the same pattern
      (salmon for dinner, no real pantry tie-in). This is distinct from
      the already-fixed `inPantry` flag bug (see the completed
      `feature/mealplan-real-pantry-match` entry above) — that was
      about mislabeling ingredients that *were* used; this is about the
      model not reliably choosing to use them in the first place. Since
      the whole feature is meant to suggest meals *from what you have*,
      this undercuts the core value of Meal Planner as it stands. Also
      hits Recipes' "suggested" list (not the separate "Search all
      recipes" action, which uses a different, unrelated
      `GET /api/recipes?q=` endpoint) — `useSuggestedRecipes.ts` calls
      this exact same `/api/meal-plan` endpoint with pantry items and
      just displays whatever meals come back as recipe cards, so it's
      the identical defect on a second surface, not a separate bug.
      Needs Airo to look at the prompt actually sent to the model and
      make it weight/require pantry items more strongly — not
      something fixable from this repo, since the client only sends
      the list and displays whatever comes back. Marked MVP since it's
      core to what the feature is supposed to do, but worth a joint
      call with Laya on priority given the backend rate-limit issue
      above is also still open.
      **Update, same day:** Airo reported a fix — normalized string vs.
      object pantry-item inputs so the list actually reaches the model
      correctly, and made pantry use mandatory in the prompt (every
      meal must use a pantry item, and use all listed items where
      practical), leaving `ingredients[].inPantry` unchanged (expected —
      that's the separate, already-fixed-client-side bug above). Three
      live re-tests right after (the original 5-item repro, twice, plus
      a bare `["pasta", "tomato"]`) all still showed the exact same
      failure pattern (including the same "Baked Salmon with Roasted
      Asparagus" dinner twice across different pantry inputs) - but
      Laasya confirmed the change hasn't actually been published yet on
      Airo's end, which fully explains testing against what's still the
      old behavior. Not a failed fix, just not live yet. **Needs a
      fresh re-test once Laasya publishes it** before this can be
      marked resolved either way.

#### Claude Code (client-side)

Buildable in this repo with no backend involvement.

- [ ] ![Later](https://img.shields.io/badge/Later-green) Consolidate the
      account-scoped AsyncStorage cache pattern.
      `mealPlanCache.ts`, `onboardingDraftCache.ts`, `usePantry.ts`, and
      `NotificationPreferencesContext.tsx` all independently reimplement
      the same get/set/JSON/account-scoping logic (on top of the shared
      `accountScopedKey()` util each already uses). Not a bug today, but
      a future fix (corrupt-JSON handling, write-error logging, a TTL)
      would need to be applied in 4+ places instead of one. Found during
      the pre-TestFlight code review.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Add quick +/-
      quantity steppers to Pantry list rows, mirroring the
      shopping list's existing quantity stepper. Right now bumping a
      pantry item's quantity by 1 requires opening the full Edit Item
      screen.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Merge duplicate
      pantry item names into a quantity bump when adding
      a new item, the same way the shopping list already dedupes
      (`feature/laya-batch5`). Adding "Milk" while "Milk" is already in
      the pantry currently creates a second row instead of bumping the
      existing one.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Add an "undo"
      after deleting a pantry item, matching the existing
      "N items cleared — Undo" pattern already used on the shopping
      list (clear-checked and bulk-delete). Pantry delete currently has
      a confirm dialog but no way to recover from an accidental delete.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Show a real
      last-synced timestamp on the pantry/dashboard
      offline-cache banner ("Showing last synced data"). It's currently
      a static message with no indication of how stale the cached data
      actually is.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Audit the
      screens added after the original loading/empty/error-state
      pass (Donation History, Meal Plan History) for the same
      treatment. Donation History currently only has a pull-to-refresh
      spinner — no distinct initial-load or error state.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Add a "share
      pantry list" action, mirroring the shopping list's
      existing native-share-sheet action, so the full pantry can be
      sent as plain text the same way the shopping list already can.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Remember the
      last-used sort/filter choice on Pantry
      (category vs. expiry-date sort) and Recipes (meal-type/cuisine
      filters) across app restarts instead of resetting to the default
      every time the screen mounts.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Add a shortcut
      from the Dashboard's expiring-items card straight
      into Donate, prefilled with those items, instead of requiring a
      user to re-pick the same expiring items from scratch on the
      Donate screen. Ties directly to the app's stated purpose (less
      food thrown out).
#### Human decision needed

Not code — needs a person to research, decide, or check something
outside this repo.

- [ ] ![MVP](https://img.shields.io/badge/MVP-red) Merge
      `feature/receipt-ocr` (on-device OCR for receipt scanning) into
      `master` and verify it on a real device before submitting. The
      code is complete — see the completed entry above — and the plan
      is to merge it right before the TestFlight submission specifically
      so its first real test happens on a real build rather than a
      separate dev-client cycle (losing Expo Go app-wide is accepted as
      a tradeoff). Testing it would otherwise need either the Apple
      Developer Program membership or an Android device — moot for now
      since Android is on hold and iOS/TestFlight is happening anyway,
      so that's the actual first real test either way. Was previously
      merged and reverted once already (8/27) — confirmed with Laasya
      that was deliberate, specifically to keep Expo Go working for
      continued testing at the time; not a sign of a problem with the
      OCR code itself.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Pick a real web
      domain for shareable invite links (currently a placeholder one)
- [ ] ![MVP](https://img.shields.io/badge/MVP-red) Prepare actual App
      Store listing assets — screenshots, store description, category,
      age rating, promotional text. Google Play is on hold for now, so
      this is iOS/App Store only. Build profiles and the
      account-deletion requirement are
      handled, but none of the actual listing content exists yet — this
      is a separate step from having a build that's technically
      submittable. **In progress:** drafted app name/subtitle options,
      promotional text, full description, keywords, category
      recommendation, and age-rating reasoning in `STORE_LISTING.md`.
      Barcode scanning is now mentioned in the copy and its Data Safety
      row corrected (see the "Fix two stale scanning references"
      completed entry); receipt scanning stays deliberately excluded
      until `feature/receipt-ocr` is merged and verified. Still needs
      Laasya + Laya to review/finalize the copy and actually take the
      screenshots (needs a phone with Expo Go, not something buildable
      from this repo) before this is submittable.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Meal-plan
      generation's underlying backend rate-limit issue is still
      unresolved by Airo/GoDaddy, but no longer submission-blocking as
      of the 9/1 redesign (see the completed entry above) — demoted
      from MVP since the client no longer depends on the bulk-call
      pattern that was tripping it. Was meaningfully better than 8/16
      but still genuinely intermittent as of 8/31.
      Live-tested 8/31 against
      the real API with the demo account (direct `curl`, phone wifi was
      down): `mealLabel` scoping (see the corrected completed entry
      above) turned out to be a no-op the backend doesn't actually
      honor, so that part of Airo's 8/31 fix doesn't do anything. What
      *did* improve since 8/16: individual day-scoped calls tested in
      isolation succeeded reliably (4 different days, 7-15s each,
      versus 8/16's ~20-21s timeout on every single one). But a full
      sequential 7-day run — exactly what "Generate 7-day plan" actually
      does — only succeeded on 4 of 7 days, `504`-timing out on the
      other 3 at ~20-21s each, ~101s total. That pattern (isolated calls
      mostly fine, back-to-back calls intermittently timing out) points
      at backend load/capacity variance under repeated calls, not
      something fixable client-side — the app's existing partial-failure
      handling (keep whatever succeeded, clear error message, per-day
      regenerate to retry) already covers it as gracefully as a client
      can, but roughly 40% of days still fail on a given generation.
      Meal-plan generation needs either a GoDaddy Support answer (a
      ticket was filed 8/31, still awaiting a response) or further
      Airo-side backend work — a client-side day/meal-scoping trick has
      now been tried and mostly exhausted as an option. Once resolved,
      re-verify meal-plan generation end to end (a full 7-day run with
      no failures), and confirm the meal-plan shopping-gap and
      cuisine-filter tasks (both depend on real generated output)
      actually work too.
      **Update, same 8/31 session, continued live-testing:** added a
      `retryOnce` helper (`src/utils/retryOnce.ts`, 3 tests) and wired it
      into both `MealPlannerScreen` calls and `useSuggestedRecipes` — a
      failed day gets one immediate retry before counting as a real
      failure, on the theory that the 504s look like transient
      backend-load variance. Live-tested that too, and found something
      worse than 504 timeouts: a second full 7-day run started returning
      `429 "Meal planning is temporarily busy"` — first on 3 of 7 days
      (fast, ~1s failures, immediate retry didn't help since it hit the
      same limit instantly), then a follow-up run with 3s spacing
      between calls got `429` on all 7, and even a single isolated call
      by itself (no other calls nearby) still got `429`. That last part
      matters: it means this isn't just about how fast this session was
      calling it — the backend was in a genuinely rate-limited/busy state
      by the end of this testing session, independent of call spacing.
      Unclear whether today's testing volume (~40+ calls to
      `/api/meal-plan` in under 15 minutes, across all the verification
      above) caused or contributed to that state, or whether it's a
      separate, lower capacity ceiling that would bite a real user
      hitting "Generate 7-day plan" once. Deliberately stopped
      testing rather than keep hammering an endpoint already showing
      "temporarily busy," rather than risk making it worse or racking up
      more quota usage without new information. `retryOnce` is kept
      regardless — it's a real improvement for genuine transient 504s
      and does no harm against 429s, just doesn't fix them. **This needs
      a fresh live test after some real time has passed** (not
      immediately back-to-back with today's session) to tell apart
      "today's testing exhausted a short-term quota" from "this backend
      has a capacity ceiling real users will hit too." Typecheck, the
      full test suite (258, was 255), and a real
      `expo export --platform ios` bundle all pass. Sent Airo the full
      `429` findings above; Airo's response was to open a GoDaddy
      Support ticket for it, same as the meal-plan-latency issue below —
      a ticket has been filed (8/31).
      **Update, 9/1:** re-tested fresh (a new day, real time passed) and
      single isolated calls now succeed cleanly again (200 OK, ~7-9s,
      2/2) — supports the theory that 8/31's `429`s were from this
      session's own heavy testing volume exhausting a shared quota, not
      a permanent ceiling. Rather than trust a burst of 7 stays safe
      going forward, rebuilt meal-plan generation to never fire more
      than one request at a time in the first place — see the completed
      entry above. The GoDaddy ticket about the underlying rate limit is
      still open and unanswered, but the app no longer depends on it
      being fixed to work reliably.
      **Update, 9/2:** reported live by Laasya/Laya as "meal planning
      isn't working" — re-tested and confirmed the underlying issue is
      still there: a single isolated call still succeeds cleanly
      (~7-8s), but three calls in quick succession got a `504` then two
      `429`s. So the day-by-day rebuild's "no depends on the ceiling
      being fixed" claim above holds for a user adding one day at a
      time with real pauses between, but not for someone (or a test
      session) adding several days back-to-back in one sitting. Still
      genuinely open on Airo's end — see the completed
      `feature/mealplan-no-retry-on-429` entry above for the one
      client-side improvement made alongside this (stopped `retryOnce`
      from adding a second request into an already-429'd call).
      **Update, same day, different question:** live-testing this also
      surfaced a second, separate concern — whether the AI actually
      builds a meal *around* what's given as `pantryItems`, not just
      whether requests succeed. One test (pantryItems: chicken, rice,
      broccoli, onion, garlic, olive oil, tomato) came back with a
      dinner of salmon with asparagus — a real ingredient list with no
      real connection to any of the 7 pantry items sent. Confirmed
      separately and already fixed: the response's own
      `ingredients[].inPantry` flag is unreliable (see the completed
      `feature/mealplan-real-pantry-match` entry above), but that's a
      different bug from whether the model chooses relevant meals in
      the first place.
      **Update, 9/2, confirmed:** got a clean non-429 response for the
      exact repro (pantryItems: pasta, alfredo sauce, broccoli,
      carrots, onion) after the rate limit finally cleared. All three
      meals (Yogurt with Berries and Granola / Chicken Salad Sandwich /
      Baked Salmon with Asparagus) came back with zero connection to
      the pantry — pasta and alfredo sauce weren't used anywhere in the
      day. Not a one-off: same pattern as the earlier chicken/rice/
      broccoli test. This is now a confirmed, repeatable finding, not
      just a hunch — see the new dedicated entry in "Backend (Airo
      only)" below, since fixing it means the AI prompt on Airo's side
      needs to actually weight pantry items instead of mostly ignoring
      them.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Recipe search
      (`GET /api/recipes?q=`, a separate endpoint from
      `/api/meal-plan`) is still fully broken — still `504`s (~11s,
      confirmed 8/31), with no scoping fix proposed or built for it at
      all. Split out from the meal-plan generation item above since
      it's a distinct endpoint with its own unresolved root cause, not
      something the day-scoping/retry work touches. Not launch-blocking
      on its own: the existing local title-filter search on the
      Recipes screen still works, so this only affects the separate
      "Search all recipes" action.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Live-test
      household invitations end-to-end through the actual app UI: invite
      someone, have them accept, see them in Profile's "Household
      members" list, then remove them. Each piece is independently
      confirmed live at this point — the invite/accept flow works;
      `DELETE /api/household/members/:id` works given a real user id;
      `GET /api/household/members` now exists, returns real ids, and
      rejects unauthenticated requests — but nobody has clicked through
      the actual client flow end-to-end since the real endpoint was
      wired in.
- [ ] ![Later](https://img.shields.io/badge/Later-green) Live-test the
      donation backend with a second household member:
      the endpoint itself is confirmed live and working (`GET
      /api/donations` returned a real empty list for a fresh test
      household on 8/16), but cross-member visibility (does a second
      household member actually see a donation the first one recorded)
      is still unconfirmed.
- [ ] ![Later](https://img.shields.io/badge/Later-green) **Needs both
      Laasya and Laya:** decide whether GoDaddy's Airo AI
      Builder is meant to be the permanent backend, or a bridge to
      something else once the app grows. It's been treated as
      production infrastructure all along — real accounts, real user
      data — but it's an AI-assisted builder tool, not a dedicated
      production backend service. Worth a deliberate joint decision
      rather than just continuing on it by default. Not launch-blocking
      on its own — today's setup can carry an initial submission either
      way.
- [ ] ![MVP](https://img.shields.io/badge/MVP-red) Enroll in the Apple
      Developer Program ($99/year). Referenced in
      README's distribution steps but never tracked as its own task —
      nothing can actually be submitted until it exists, and it needs a
      real person's payment info. Google Play is on hold for now;
      revisit that decision separately once iOS is out.
- [ ] ![MVP](https://img.shields.io/badge/MVP-red) Complete Apple's
      "App Privacy" questionnaire (App Store Connect) before submission.
      Distinct from having a written Privacy Policy — the store requires
      its own in-console declaration of exactly what data is collected
      and why, and Apple checks it against the app's actual observed
      behavior, not just the policy text.
      **In progress:** drafted the actual answers (data-type table +
      encryption/deletion/tracking/third-party-processor answers) in
      `STORE_LISTING.md` — copy-paste ready, just needs someone logged
      into App Store Connect to actually enter them. (The Google Play
      "Data safety" answers are in the same doc for whenever Android is
      picked back up.)
- [ ] ![MVP](https://img.shields.io/badge/MVP-red) Actually configure
      `eas submit` credentials for iOS (an App Store Connect API key)
      and do a real first submission. Currently only documented as a
      step in `README.md`, not yet done.
- [ ] ![MVP](https://img.shields.io/badge/MVP-red) Host the Privacy
      Policy and Terms of Service at a real, permanent
      URL once the web domain exists (both currently republished as
      Claude Artifacts — see the completed entry above — which are
      private until manually shared, and may still show a "Content is
      user-generated and unverified" banner to a public viewer even once
      shared). GitHub Pages was tried and isn't available on the current
      plan (repo is private); would need either a public repo, a paid
      GitHub plan, or a different static host. Update
      `PRIVACY_POLICY_URL`/`TERMS_OF_SERVICE_URL` once that exists.

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
