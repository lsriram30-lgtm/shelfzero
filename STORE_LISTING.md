# App Store / Play Store Listing — Draft

Status: **draft, needs Laasya + Laya review and final sign-off.** Nothing here
has been entered into App Store Connect or Play Console yet. Screenshots are
not included — see the bottom of this file for how to capture them.

Everything below is grounded in what the app actually does today. Barcode
scanning is real now (`GET /api/barcode/:code`, added 8/31 — see `TASKS.md`)
and is mentioned below. Deliberately **not** mentioned: receipt scanning —
the on-device OCR code exists (`feature/receipt-ocr`) but hasn't been merged
or verified on a real device yet, so it's still not something to advertise.
Revisit this note once that's confirmed working — advertising a broken
feature in store copy is a real App Review risk (Apple guideline 2.1), not
just misleading.

---

## App name

**ShelfZero**

## Subtitle (Apple only, 30 characters max)

Pick one, or write your own — character counts included so you can check
against App Store Connect's live counter:

| Option | Characters |
|---|---|
| "Waste less, eat what you have" | 29 |
| "Pantry tracking & meal plans" | 28 |
| "Track pantry, plan meals" | 24 |

## Promotional text (Apple only, 170 characters max, editable anytime without a new build)

> Know what's in your pantry, plan a week of meals around it, and share the
> list with your household — all in one place. Less food wasted, less to
> remember.

(~155 characters — leaves room to tweak.)

## Short description (Google Play, 80 characters max)

> Track your pantry, get AI meal plans, and share a shopping list with family.

(76 characters.)

## Full description (both stores, up to ~4000 characters)

> **Stop throwing away food you forgot you had.**
>
> ShelfZero keeps your household's pantry, meals, and shopping list in one
> shared place — so nothing expires unnoticed and nobody's guessing what's
> for dinner.
>
> **Track what you actually have**
> Log pantry items with quantity, category, and expiry date, or scan a
> barcode to add one automatically. ShelfZero flags what's expiring soon so
> you use it before it's wasted, and shows a quick health score for your
> whole pantry at a glance.
>
> **Get a meal plan built from your own pantry**
> Generate a 7-day meal plan based on what's actually in your kitchen —
> not a generic recipe box. Each meal shows what you're missing, with a
> one-tap way to add just those ingredients to your shopping list. Filter
> suggested recipes by meal type or cuisine, save favorites, and look back
> at past weeks' plans anytime.
>
> **Share it with your household**
> Invite the people you live with so everyone sees the same pantry,
> shopping list, and meal plan — no more duplicate grocery runs or "wait,
> did we already buy milk?" texts.
>
> **A shopping list that stays in sync**
> Items are grouped by category, quantities sync in real time as your
> household shops, and adding something you already have on the list just
> bumps the quantity instead of creating a duplicate row.
>
> **Donate what you won't use**
> Nearing an expiry date on something you know you won't get to? Log it as
> donated instead of throwing it out, and see your household's full
> donation history.
>
> **Built to be usable, not just functional**
> Dark mode, screen-reader support throughout, and expiry reminders that
> actually notify you — not just another list you forget to check.
>
> ShelfZero is about spending less on groceries you don't need and
> throwing away less of what you already bought.

## Keywords (Apple, 100 characters max, comma-separated, no spaces needed)

```
pantry,meal planner,grocery list,food waste,expiry tracker,recipes,household,shopping list
```
(Trim to fit — App Store Connect will show the live count.)

## Category

- **Apple primary:** Food & Drink
- **Apple secondary (optional):** Lifestyle
- **Google Play:** Food & Drink

## Age rating

Recommended answers for Apple's age-rating questionnaire and Google Play's
IARC content-rating questionnaire, based on what's actually in the app:

- No violence, sexual content, profanity, gambling, or drug references — No to all.
- No ads, no in-app purchases.
- **User-generated content:** the household invite feature lets someone
  share access with people they choose (by email/phone), but there's no
  public posting, chat, comments, or browsing of other users' content — this
  is private, permissioned sharing, not open/unrestricted UGC. Recommend
  answering **"No"** to "unrestricted web access" / "user-generated content"
  style questions on this basis.

Expected result: **4+ (Apple) / Everyone (Google Play)**. The actual rating
is computed by each store's questionnaire, not chosen directly — these are
just the honest answers to give it.

## Reviewer / demo account

For App Store Connect's "App Review Information" and Google Play's "App
access" section — every screen in the app requires sign-in, so reviewers
need working credentials on file or they can't get past the sign-in screen
(a common cause of rejection under Apple Guideline 2.1).

```
Email:    shelfzero.2026+demo@gmail.com
Password: ShelfZeroDemo2026!
```

This is a real account on the live backend (Gmail's `+demo` alias routes to
the same real support inbox, so it's still ours if anything ever emails it),
pre-loaded so a reviewer sees a working app immediately instead of an empty
one:

- **Pantry:** 8 items across Dairy/Meat/Produce/Bakery/Pantry categories,
  with expiry dates spread from 2 days out to 17 days out (so the health
  score, expiry badges, and "expiring soon" Dashboard card all have real
  data to show)
- **Shopping list:** 3 unchecked items (Paper towels, Olive oil, Greek yogurt)
- **Donation history:** 1 past donation, so the "View history" link isn't empty
- **Household:** the demo account owns its own household (role: owner), so
  member-management UI is also reachable

Deliberately **not** pre-generated: a meal plan. Generation is a real
`POST /api/meal-plan` call to a slow, occasionally rate-limited AI backend
(see the "Meal-plan generation... too slow" backlog item) — safer to let a
reviewer trigger "Generate 7-day plan" live against the already-populated
pantry than to depend on that call succeeding ahead of time.

If this account needs to be recreated later (e.g. after more testing
churns its data), the same seeding can be redone directly against the
live API — ask and it can be repeated in a couple of minutes.

## App Privacy (Apple) / Data Safety (Google Play) answers

Neither console can be filled in from this repo — these are the answers to
give when one of you is logged into App Store Connect / Play Console,
based on what the app actually collects (see the Privacy Policy for the
full explanation of each):

| Data type | Collected? | Linked to identity? | Used for | Shared with third parties? |
|---|---|---|---|---|
| Name | Yes | Yes | Account functionality | No |
| Email address | Yes | Yes | Account functionality, sign-in | No |
| Password | Yes | Yes | Account functionality (never stored in plain text) | No |
| Pantry/shopping list/meal-plan/donation content | Yes | Yes (household-scoped) | App functionality | Item names + stated preferences sent to Google Gemini to generate meal plans/recipes — no name, email, or password included |
| Household invite contact (email/phone) | Yes | Yes | App functionality (inviting someone) | No |
| Photos/camera | Only if the Scan feature is used | No | Barcode scanning reads the barcode number on-device and sends only that number — no photo is ever transmitted. Receipt scanning (not yet merged — see backlog) would extract text on-device before sending anything, same principle. | No |
| Precise/approximate location | No | — | — | — |
| Contacts | No | — | — | — |
| Analytics/usage data | No | — | — | — |
| Advertising data | No | — | — | — |
| Crash data/diagnostics | No | — | — | — |
| Financial info | No | — | — | — |

Additional answers both consoles ask for directly:

- **Is data encrypted in transit?** Yes (HTTPS only)
- **Can users request data deletion?** Yes — in-app, Profile &gt; Delete account, or by contacting `shelfzero.2026@gmail.com`
- **Is any data sold to third parties?** No
- **Is any data used for advertising/tracking?** No — no ad network, no analytics SDK, no advertising identifiers anywhere in the app
- **Third-party data processors:** GoDaddy's Airo AI Builder (backend hosting), Google Gemini (meal-plan/recipe generation only — pantry item names and stated preferences, no personal identifiers)

---

## Screenshots — needs a phone, not code

Since `ios.supportsTablet` is now `false`, no iPad screenshots are needed —
just phone-size shots for both stores.

**How to capture them:** run `npm start` from the repo root, then open Expo
Go on a phone → "Enter URL manually" → paste the printed link (same Wi-Fi
network as the computer running it; ask for a fresh one if a previous
session's link has gone stale). Sign in with the demo account above so
there's real data to screenshot. Take screenshots the normal way on each
phone (iPhone: side button + volume up; Android: power + volume down).

**Store size requirements:**
- **Apple:** needs the largest current iPhone size (e.g. iPhone 16 Pro Max,
  1290×2796). Smaller sizes are optional — Apple auto-scales from the
  largest set.
- **Google Play:** at least 2 phone screenshots, PNG/JPEG, 16:9 or 9:16,
  between 320px and 3840px on the short side.

**Suggested screens to capture** (populate the pantry with a few real items
first so nothing looks empty):

1. Dashboard — health ring + expiring-soon items
2. Pantry — categorized list with a few items
3. Meal Planner — a generated 7-day plan
4. Recipes — the filtered grid with a match score visible
5. Shopping List — grouped by category, a couple items checked
6. Household Hub or Donate screen — shows the sharing/household angle

Once you have the raw screenshots, ping me — device frames or a bit of
text-overlay treatment on top of them is something I can do from the image
files directly.
