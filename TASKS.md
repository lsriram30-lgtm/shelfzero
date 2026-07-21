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

### Currently assigned

- [x] ![Laasya](https://img.shields.io/badge/Laasya-FFB3C6) Add more cuisine options
      and other choices to the onboarding questionnaire, and simplify/clean up the
      questionnaire flow (branch: `feature/questionnaire-cleanup`) — merged into `master`
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Clean up the overall look and
      feel of the app: spacing, colors, and a general polish pass
      (branch: `feature/app-polish`) — merged into `master`

### Not yet assigned

- [ ] Improve the receipt scanning feature so it reads receipts more reliably
- [ ] Add a real "search recipes" feature — right now suggested recipes are a workaround
      since the backend doesn't have a proper recipe search yet
- [x] ![Laya](https://img.shields.io/badge/Laya-B5EAD7) Build the "donate leftover food"
      feature (branch: `feature/donate-surplus`) — merged into `master`. Note: no backend
      endpoint exists for this yet, so it's a self-contained flow (pick expiring items,
      pick a placeholder partner, confirm) that removes items from the pantry for real
      and keeps a local donation history.
- [ ] Make notification settings actually save (currently they reset every time)
- [ ] Add a real app icon and splash screen image (using a placeholder right now)
- [ ] Pick a real web domain for shareable invite links (currently a placeholder one)
- [ ] Test the full app on an actual Android phone and an actual iPhone

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

## How to update this file

1. On GitHub, open `TASKS.md` and click the pencil (edit) icon.
2. Change `- [ ]` to `- [x]` next to a finished task (or the reverse to un-finish one).
   Leave the colored name badge as-is — that's how the other person knows whose task
   it was, even after it's checked off.
3. Scroll down, add a short note of what you did, and click **"Commit changes"**.

If you're working from your own branch instead of editing on GitHub directly, just
check the box in your local copy of `TASKS.md`, commit it along with your other
changes, and it'll show up once your Pull Request is merged into `master`.
