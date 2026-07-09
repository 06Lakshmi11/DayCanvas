# Calendar Notes

A month-view calendar where you can write notes, checklists, and reminders on
any day — with real public holidays pulled in automatically. Everything is
saved in the browser via `localStorage`, no backend required.

## Features

- **Month grid** with prev/next/today navigation
- **Jump to any year/month instantly** — click the month title, type a year
  (e.g. 1995 or 2030), pick a month
- **Two note types**: free-form text notes, or checklists with checkboxes
- **Text formatting**: bold, italic, and small/medium/large size, saved per note
- **Priority levels** (None/Low/Medium/High) shown as a radio selector and a
  colored chip
- **Photo attachments** — attach an image to a note (auto-resized before
  saving so it doesn't blow past browser storage limits)
- **Reminders** — set a time for a note; while this tab is open, you'll get a
  browser notification (and an in-app marker) when it's due
- **8-color palette** for tagging notes, plus 4 full app **themes** (Sage,
  Ocean, Sunset, Dusk) via the swatches in the header
- **Ruled/grid-paper look** for the note editor and note list
- **Real public holidays & festivals**, fetched live from the free
  [Nager.Date](https://date.nager.at) API for a country you choose (defaults
  to India), shown directly on the calendar grid
- **Search** across every note (including checklist items) you've written,
  with a "jump to that date" action
- **Export/Import backup** — download all your notes as a JSON file, and
  re-import it later (merges by note id, so re-importing is safe)
- **Delete confirmation + undo** — click Delete once to arm it, click again
  to confirm; after deleting, a 6-second "Undo" toast appears
- Everything persists automatically to `localStorage`

## Project structure

```
calendar-notes/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── components/
    │   ├── CalendarGrid.jsx     # month grid + navigation
    │   ├── DayCell.jsx          # single day box, notes + holiday label
    │   ├── MonthYearPicker.jsx  # jump-to-year/month popover
    │   ├── NoteModal.jsx        # add/edit notes, checklists, reminders, photos
    │   ├── ThemeSwitcher.jsx    # theme swatches
    │   ├── HolidaySettings.jsx  # country picker + show/hide toggle
    │   ├── BackupControls.jsx   # export/import notes as JSON
    │   ├── UndoToast.jsx        # "Note deleted — Undo" toast
    │   └── Sidebar.jsx          # search across all notes
    └── utils/
        ├── dateUtils.js         # month grid math, date formatting
        ├── storage.js           # localStorage read/write, note model
        ├── holidays.js          # Nager.Date API client + caching
        ├── backup.js            # export/import/merge notes as JSON
        ├── imageUtils.js        # resize/compress attached photos
        └── reminders.js         # Notification API helpers
```

## Run it locally in VS Code

1. Open this folder in VS Code.
2. Open a terminal (`` Ctrl+` ``) and install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the printed local URL (usually `http://localhost:5173`).

Click any day to add a note or checklist. Notes persist in `localStorage`
under the key `calendar-notes:v1`.

## Good to know

- **Reminders only fire while the tab is open.** This is a pure frontend app
  with no server or service worker, so there's no way to push a notification
  after you close the tab — the browser checks for due reminders roughly
  once every 20 seconds while the app is open.
- **Holiday data** comes from the free, keyless Nager.Date public API and is
  cached in `localStorage` per country/year so it only re-fetches when needed.
  If you're offline, the calendar still works — it just won't show holidays.
- **Photos** are resized and compressed client-side before saving, since
  `localStorage` typically caps out around 5–10MB total.

## Push to GitHub

From the project folder:

```bash
git init
git add .
git commit -m "Initial commit: Calendar Notes"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on GitHub first, without a README, so there's no merge
conflict on first push.)

## Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Ideas to extend further

- Swap `localStorage` for a real backend (Supabase, or a small Express +
  SQLite API) so notes sync across devices.
- Recurring/repeating notes (weekly, monthly).
- Drag-and-drop to move a note to a different day.
- Export a month's notes to PDF or plain text.
- A week view alongside the month view.
- True background reminders via a service worker + push notifications.
