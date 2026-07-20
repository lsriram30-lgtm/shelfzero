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

## Up next

- [ ] Clean up the overall look and feel of the app — spacing, colors, and polish pass
- [ ] Improve the receipt scanning feature so it reads receipts more reliably
- [ ] Add more cuisine options and other choices to the onboarding questionnaire, and
      simplify/clean up the questionnaire flow
- [ ] Add a real "search recipes" feature — right now suggested recipes are a workaround
      since the backend doesn't have a proper recipe search yet
- [ ] Build the "donate leftover food" feature — currently just a placeholder screen
- [ ] Make notification settings actually save (currently they reset every time)
- [ ] Add a real app icon and splash screen image (using a placeholder right now)
- [ ] Pick a real web domain for shareable invite links (currently a placeholder one)
- [ ] Test the full app on an actual Android phone and an actual iPhone
- [ ] Invite other people to the GitHub repo so they can help build

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
3. Scroll down, add a short note of what you did, and click **"Commit changes"**.
