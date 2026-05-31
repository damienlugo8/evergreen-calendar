# Evergreen Calendar

A shared team calendar for **Ibex Financial** — see who's in a meeting, taking time off, working from home, or out of office, all in real time.

Built with React + Vite, powered by Firebase Firestore for live sync across the team.

---

## Features

- **Live sync** — events appear instantly for everyone on the team (no refresh)
- **Four event types** — Meeting, Time Off, WFH, Out of Office
- **Name picker** — pick your name on first visit; remembered after that
- **Month view** with overflow handling
- **Click any day** to see its events in the side panel
- **Add / delete events** with one click
- **Syncing indicator** when writes are in flight
- **Mobile-friendly** — works on phones and tablets

## Team

Marc · Damien · Dan · Michael · King · Jason · Richard

## Tech Stack

- React 19 + Vite
- Firebase Firestore (`onSnapshot` for real-time subscriptions)
- Vanilla CSS with design tokens
- Inter font

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
```

Outputs a static SPA to `dist/`.

## Deploy

Deploy `dist/` to Vercel, Netlify, or Firebase Hosting.

## Firestore Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Add a Web app and copy the config into `src/firebase.js`
3. Enable Firestore (production mode is fine)
4. Paste the contents of `firestore.rules` into the Rules tab and publish

## Microsoft Teams

A Teams app manifest is included at `public/manifest.json` with matching icons (`icon-color.png`, `icon-outline.png`). Zip the manifest + icons and sideload via Teams Admin Center to expose Evergreen as a personal tab.

## Project Structure

```
src/
├── components/   UI components (Header, CalendarGrid, EventPanel, modals)
├── hooks/        useCalendar — Firestore subscription + grid math
├── services/     calendarService — Firestore add / delete / subscribe
├── constants.js  Team list + event types
├── firebase.js   Firebase config + Firestore instance
└── App.jsx       Root layout
```
