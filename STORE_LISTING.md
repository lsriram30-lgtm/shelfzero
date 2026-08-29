# App Store / Play Store Listing — Draft

Status: **draft, needs Laasya + Laya review and final sign-off.** Nothing here
has been entered into App Store Connect or Play Console yet. Screenshots are
not included — see the bottom of this file for how to capture them.

Everything below is grounded in what the app actually does today. Deliberately
**not** mentioned anywhere: receipt/barcode scanning. It's visibly in the app
but doesn't work yet (honest in-app notice already covers that) — advertising
a broken feature in store copy is a real App Review risk (Apple guideline
2.1), not just misleading.

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
> Log pantry items with quantity, category, and expiry date. ShelfZero
> flags what's expiring soon so you use it before it's wasted, and shows a
> quick health score for your whole pantry at a glance.
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

---

## Screenshots — needs a phone, not code

Since `ios.supportsTablet` is now `false`, no iPad screenshots are needed —
just phone-size shots for both stores.

**How to capture them right now:** the Expo dev server is already running.
Open Expo Go on a phone → "Enter URL manually" → paste the link from this
session (`exp://192.168.12.225:8081`, same Wi-Fi network as this computer).
Take screenshots the normal way on each phone (iPhone: side button + volume
up; Android: power + volume down).

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
