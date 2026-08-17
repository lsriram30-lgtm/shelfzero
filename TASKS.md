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
| ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) | 40 / 50 |
| ![Laya](https://img.shields.io/badge/Laya-B5EAD7) | 50 / 50 |

**Goal:** 50 tasks each (total) by end of day 8/22.

**Note:** the goal increases by 10 each week. This isn't automatic;
whoever updates this file should apply it, and it's fine to adjust
the pace if that week doesn't actually support it.

**NOTE (from Laya):** I'll be on my trip next week so I'll probably
finish extra tasks this week but you should definetly go at your own
pace I just won't be able to work much next week <3

**Past Goals:** 10 each by 7/25, 20 each by 8/1, 30 each by 8/8, 40 each by 8/15.

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
      rather than restructuring onboarding for it. Typecheck, all 186
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
      cuisine filter to the Recipes screen (branch:
      `feature/cuisine-filter`) — merged into `master`. Airo added a
      `cuisine` field to each meal on 8/15, the same way as the
      ingredients change above. Recipes now has a second filter row for
      cuisine, next to the existing meal-type row, and "no matching
      recipes" now explains a cuisine mismatch too, not just a meal-type
      one — closing out a note left when the meal-type filter first
      shipped. 15 tests added, suite at 205. Typecheck, tests, and an
      `expo export` bundle all pass.
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
      discarding the entire week every time; it now correctly
      regenerates just the one day asked for. 2 tests added, suite at
      207. Typecheck, tests, and an `expo export` bundle all pass.
      (Meal-plan generation is still too slow to actually complete —
      that's a separate, still-open problem, tracked under "Human
      decision needed" below.)

### Not yet assigned

#### Backend (Airo only)

Requires a change in the Airo AI Builder dashboard — not buildable from
this repo.

#### Claude Code (client-side)

Buildable in this repo with no backend involvement.

- [ ] Add on-device OCR to receipt scanning — see the correction note on
      the "Improve receipt scanning" task above. Without this, no photo
      scan can ever succeed against the current backend. Decided 8/16:
      real OCR (ML Kit) over a cloud API — free, no new API key/billing,
      matches the original scope — even though it means the app's first
      native dependency, so plain Expo Go can no longer run any part of
      the app; testing needs a custom dev client build instead (the
      `eas.json` `development` profile already exists for this).
      **Already built on `feature/receipt-ocr`, not yet merged** —
      holding until that Expo-Go-vs-dev-client tradeoff is confirmed.
- [ ] Refine the app's icon visuals and general look so it feels more polished
      and professional overall

#### Human decision needed

Not code — needs a person to research, decide, or check something
outside this repo.

- [ ] Pick a real web domain for shareable invite links (currently a placeholder one)
- [ ] Identify a real donation partner (food bank, nonprofit, etc.) to
      actually integrate with. Airo confirmed on 8/14 that donation
      records are now real and persisted, but partner selection is still
      just a label with no real handoff behind it — nothing gets
      notified, nothing gets fulfilled. Needs a real organization/API
      identified before there's anything to integrate against.
- [ ] Test the full app on an actual Android phone and an actual iPhone
- [ ] Meal-plan generation (and recipe search, same root cause) is still
      too slow to work at all — needs GoDaddy Support, not Airo.
      Confirmed via direct API testing on 8/16 that even the smallest
      possible meal-plan request (one day,
      `{ days: 1, dayIndex: 0 }`) times out at ~20-21 seconds; the
      day-scoped fix's core assumption ("one day is fast enough") was
      wrong. Airo diagnosed why: a single day still asks Gemini for 3
      complete meals in one call, each with description, cuisine,
      pantry/extra lists, and structured ingredients — genuinely a lot
      of structured output per call. The app's 20-second timeout is
      app-level, not a hard platform ceiling, but Airo's own read is
      that raising it alone would just delay the failure rather than
      fix the underlying slowness. Recipe search's `504`s are the exact
      same symptom (route works, generation itself is too slow), so this
      one task covers both. Airo said it's reached the edge of what it
      can diagnose here and pointed to **GoDaddy Support**
      (help.godaddy.com) for further help — no ticket was auto-opened,
      so this needs a person to actually go file one. Once resolved,
      re-verify both meal-plan generation and recipe search end to end,
      and confirm the meal-plan shopping-gap and cuisine-filter tasks
      (both depend on real generated output) actually work too.
- [ ] Live-test household invitations end-to-end: invite someone, have
      them accept, then remove them from Profile's "Household members"
      list. Still not directly tested — confirms/fixes the unverified
      assumption on the remove-member task above (does the accepted
      invite's `id` double as the member id `DELETE
      /api/household/members/:id` expects).
- [ ] Live-test the donation backend with a second household member:
      the endpoint itself is confirmed live and working (`GET
      /api/donations` returned a real empty list for a fresh test
      household on 8/16), but cross-member visibility (does a second
      household member actually see a donation the first one recorded)
      is still unconfirmed.
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
