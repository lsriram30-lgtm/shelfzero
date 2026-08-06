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
| ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) | 31 / 30 |
| ![Laya](https://img.shields.io/badge/Laya-B5EAD7) | 20 / 30 |

**Goal:** 30 tasks each (total) by end of day 8/8.

**Note:** the goal increases by 10 each week. This isn't automatic;
whoever updates this file should apply it, and it's fine to adjust
the pace if that week doesn't actually support it.

**Past Goals:** 10 each by 7/25, 20 each by 8/1.

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

### Not yet assigned

- [ ] Add a real "search recipes" feature — right now suggested recipes are a workaround
      since the backend doesn't have a proper recipe search yet
- [ ] Add a real backend for the donation feature (right now it's local-only, with
      no server endpoint or actual donation partner behind it)
- [ ] Add on-device OCR to receipt scanning — see the correction note on
      the "Improve receipt scanning" task above. Without this, no photo
      scan can ever succeed against the current backend; it needs an
      actual text-recognition step (e.g. ML Kit) before calling
      `/api/scan`, plus fixing the response mapping (`quantity` comes
      back as a string, there's no `unit` field, neither matches
      `NewPantryItem` today).
- [ ] Pick a real web domain for shareable invite links (currently a placeholder one)
- [ ] Test the full app on an actual Android phone and an actual iPhone
- [ ] Add a way to remove a household member, or leave a household yourself —
      right now you can invite people, but once someone's a member there's no
      way to remove them or leave
- [ ] Refine the app's icon visuals and general look so it feels more polished
      and professional overall
- [ ] Add a forgot-password / reset-password flow (sign-up and sign-in exist now,
      but there's no way to recover an account if someone forgets their password).
      Investigated by Laya: the backend has a `POST /api/auth/request-password-reset`
      route, but it responds `"Reset password isn't enabled"` — it's turned off
      server-side, so there's no frontend workaround. Needs the backend team to
      enable it (and configure outbound email) before this is buildable.
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
      name, so this is on hold until that data actually exists. When this
      is built, also extend the empty-state logic to cover a cuisine
      mismatch (not just meal-type) — right now `ListEmptyComponent` only
      checks `mealTypeFilter` when deciding whether to show "No matching
      recipes" vs. "No recipes yet," following the same precedent set when
      the meal-type filter was added.
- [ ] Have the meal-plan generator tag each meal with its cuisine (e.g.
      "Italian," "Thai") in the `/api/meal-plan` response — a backend
      change, the same way it already returns `title` and `description`.
      Whatever generates a meal like "Pad Thai" already implicitly knows
      its cuisine — it's just not returned today. Once it exists, a real
      (non-guessed) cuisine filter becomes possible on the Recipes screen.
- [ ] Let a single day in the meal plan be regenerated instead of only
      the whole 7-day plan at once.
- [ ] **Needed for TestFlight:** research the best distribution method for
      community/beta testing of the prototype — e.g. TestFlight for iOS,
      the Google Play internal or closed testing track, or continuing
      with Expo Go — as a step toward eventual App Store / Play Store
      submission. Related but separate from the readiness gaps noted
      elsewhere in this list (the testing-UI cleanup above, the real app
      icon, and account deletion, which Apple's guidelines require for
      any app with sign-up).
- [ ] Fix the `429` on `/api/meal-plan` — root cause confirmed via Airo:
      the route calls OpenAI's `gpt-4o-mini` directly, and every upstream
      429 (quota exhausted or rate limited — Airo can't distinguish
      which, and can't inspect the OpenAI account's usage/billing) gets
      converted to the same generic "AI service is busy" message.
      Reproduces 100% of the time, not intermittently, so this is a real
      cap being hit, not normal traffic-based throttling. Needs checking
      the OpenAI account's usage/billing via GoDaddy's "Manage my plan"
      (from the user menu) or GoDaddy Support — not something visible or
      fixable from Airo or this repo.
- [ ] Finish the privacy policy — fill in the two placeholders left in
      the draft (launch date, contact email), give it a final accuracy
      check right before actually publishing since the app will keep
      changing between now and then, and host it at a real, permanent
      URL once the web domain exists, updating `PRIVACY_POLICY_URL` to
      point there. One more reason this matters: the shared Claude
      Artifact shows a "Content is user-generated and unverified" banner,
      which undercuts credibility for what's supposed to be the app's
      official, binding policy — fine for testing, not for an actual
      submission. GitHub Pages was tried and isn't available on the
      current plan (repo is private); would need either a public repo, a
      paid GitHub plan, or a different static host.
- [ ] Take a broader look at the "Add item" pantry form's other fields
      for the same kind of gap the Unit picker had (see the "Other"
      option task below, now done) — e.g. whether Category's fixed list
      needs a genuine free-text fallback rather than just a literal
      "Other" pill.
- [ ] Redesign the Pantry Stats category bars' fill-vs-track contrast —
      found during the accessibility contrast audit. All four
      `barPalette` colors (primary, accent, highlight, secondary) fail
      3:1 contrast against the track color (`colors.border`) in light
      mode (1.07–2.68:1), meaning the filled portion of each bar is hard
      to distinguish from the empty track. Needs a real track redesign
      (a more neutral/contrasting track background), not a one-line
      color swap like the other audit fixes — the track color itself is
      too close in lightness to every fill color it's paired with.
- [ ] Darken the core `primary` brand color (Savory Sage) for light
      mode, or otherwise fix selected-pill text contrast — found during
      the accessibility contrast audit. Selected pills render
      `colors.surface` (white) text on a `colors.primary` background at
      ~4.0:1 in light mode, just under the 4.5:1 AA threshold for normal
      text. This affects every selected filter/category/toggle pill
      app-wide, so it's a bigger design decision than the other audit
      fixes, not a quick swap — darkening primary has knock-on effects
      on buttons and every other place it's used.
- [ ] Scope onboarding-complete state to the signed-in account instead of
      the device — found while testing account deletion. The onboarding
      profile (name, cuisine/dietary prefs, etc.) lives only in
      `AsyncStorage`, keyed generically, not per-account or fetched from
      the backend. Once it's been filled in once on a device, `isComplete`
      (`!!profile`) stays true for *any* subsequent sign-up or sign-in on
      that same device, skipping the questionnaire entirely and showing
      stale local data (e.g. an old test name) regardless of which real
      account just authenticated. Fine for solo testing where you know to
      hit "Reset app," but a real user switching accounts on a shared
      device would hit this for real. Needs the profile keyed by user ID
      (or fetched from the backend, once a profile endpoint exists)
      instead of one global local flag.

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
