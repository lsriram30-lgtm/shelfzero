# Working conventions for this repo

See `TASKS.md` for what's done and what's planned, and `README.md` for
architecture and known backend gaps. This file is about *how* to work here,
not *what* the code does.

## Testing

Jest + the `jest-expo` preset are set up (`npm test`). Add tests automatically
for any new pure/testable logic — don't wait to be asked.

When logic needs testing but lives in a screen file, extract it into a
sibling non-UI module (e.g. `pantryLogic.ts`, `dashboardLogic.ts`,
`recipesLogic.ts`) instead of testing the screen directly. Importing a full
screen file pulls in `expo-font`/`vector-icons`, which needs the `expo-asset`
package — not installed, and adding it just to satisfy a test isn't worth the
extra production dependency.

## Git workflow

- One `feature/xxx` branch per task.
- Before calling a task done: typecheck, `npm test`, and a real
  `npx expo export --platform ios` bundle check (catches import/runtime
  errors that typecheck alone won't).
- Merge into `master` only after explicit confirmation — don't merge
  unprompted.
- Delete the feature branch after merging.

## TASKS.md conventions

- Completed-entry format: badge → description → `(branch: \`feature/xxx\`)`
  → `— merged into \`master\`.` → a detail paragraph (what changed, what it
  doesn't cover, any caveats).
- Only add the "merged into `master`" language *after* an actual merge —
  never write it in advance.
- Keep the weekly progress table (`### This week's progress`) in sync with
  the actual count of each person's checked-off tasks.
- Badge colors: Laasya = pink (`FFB3C6`), Laya = green (`B5EAD7`), unclaimed
  tasks in "Not yet assigned" get no badge.

## Backend boundary

The entire backend is one GoDaddy Airo AI Builder project (see `README.md`
for the URL). Anything needing new/changed backend behavior is outside this
repo's control. Flag it as a backend task rather than building an unreliable
client-side workaround — e.g. guessing a recipe's cuisine from its title
was rejected in favor of documenting a real backend task to add the field
server-side.
