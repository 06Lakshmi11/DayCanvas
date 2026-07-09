# 📅 DayCanvas

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*A quiet place for daily notes — a calendar you can actually write on.*

## 🌐 Live Demo

👉 https://day-canvas-eight.vercel.app

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Good to Know](#good-to-know)
- [Ideas to Extend](#ideas-to-extend)
- [Author](#author)

---

## About The Project

DayCanvas is a month-view calendar app where you can write notes, build checklists, attach photos, set reminders, and see real public holidays — all on any day you click. Unlike most calendar apps, there's no account, no sign-up, and no backend server: everything is saved directly in your browser.

## Features

- 🗓️ **Month grid** with prev/next/today navigation
- ⚡ **Jump to any year/month instantly** — click the month title, type a year, pick a month
- 📝 **Two note types** — free-form text notes, or checklists with tickable checkboxes
- 🔤 **Text formatting** — bold, italic, and small/medium/large size, saved per note
- 🚦 **Priority levels** (None/Low/Medium/High) with a custom radio selector and colored chip
- 📷 **Photo attachments** — auto-resized/compressed before saving
- ⏰ **Reminders** — set a time on a note and get a browser notification when it's due
- 🎨 **8-color palette** for notes, plus 4 full app themes — Sage, Ocean, Sunset, Dusk
- 📖 **Ruled-paper look** for the note editor and note list
- 🎉 **Real public holidays & festivals** — pulled live from the free Nager.Date API, any country
- 🔍 **Search** across every note (including checklist items), with jump-to-date
- 💾 **Export / Import backup** — download all your notes as a `.json` file, re-import anytime
- ↩️ **Delete confirmation + undo** toast
- 🔢 **Note-count badges** on the calendar grid and inside the note popup

## Tech Stack

- **React.js:** Component-based UI library
- **Vite:** Fast dev server and build tool
- **Plain CSS:** Custom properties for theming, no framework
- **Nager.Date API:** Free public holiday data
- **Browser APIs:** `localStorage` for persistence, Notification API for reminders

## Architecture

DayCanvas is a fully client-side single-page app — there is intentionally **no backend server or database**. All data (notes, checklists, photos, preferences) is stored in the browser's `localStorage`. This keeps the app simple to run and deploy, with the tradeoff that data lives only on the device/browser it was created in (see [Good to Know](#good-to-know) below).

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes bundled with Node.js)

### Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/06Lakshmi11/DayCanvas.git
   cd DayCanvas
```
2. **Install dependencies:**
```bash
   npm install
```

### Running the Application

```bash
npm run dev
```
Then open the printed local URL (usually `http://localhost:5173`).

## Good to Know

- **Reminders only fire while the tab is open** — no server means no way to push a notification after the tab is closed.
- **Holiday data** is cached per country/year in `localStorage`. If a country shows "no data available," it isn't in the free API's dataset.
- **Photos** are resized client-side before saving, since `localStorage` typically caps out around 5–10MB total.
- **Notes live only in this browser** — use Export/Import to back them up before clearing browser data or switching devices.

## Ideas to Extend

- Sync notes across devices with a real backend (Supabase, or Node + SQLite)
- Recurring/repeating notes
- `.ics` export so reminders show up in Google/Outlook/Apple Calendar
- A year-at-a-glance view
- True background push notifications (needs a server + service worker)

---

## Author
### Lakshmi Valmiki