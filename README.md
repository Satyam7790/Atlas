# 🗺️ MapVista

A Google Maps-style web application built with React and Leaflet. Search for places worldwide, find nearby restaurants, cafes, hospitals and more, and get real turn-by-turn driving directions — all with no paid API keys required.

---

## 🌐 Live Demo

> **Deployed link:** _coming soon_ atlaswapproject.netlify.app/

---

## 📸 Screenshots

> _Add screenshots here once deployed_

---

## ✨ Features

- 🔍 **Search** any place, city, or address worldwide
- 📍 **Nearby search** by category — restaurants, cafes, hospitals, hotels, ATMs, pharmacies, supermarkets, schools
- 🗺️ **Four map styles** — Dark, Street, Satellite, Topographic
- 📏 **Driving directions** with turn-by-turn steps, distance and time estimates
- 📡 **GPS locate** — find and show your current position on the map
- 🏷️ **Place details** — address, phone, website, opening hours, distance
- 📤 **Share** any place as an OpenStreetMap link
- 📱 **Standalone version** — single HTML file, no install needed

---

## 🧱 Architecture

The app follows a simple top-down data flow. `App.jsx` owns all shared state and passes it down as props to child components. No global state library (like Redux) is used — just React's built-in `useState`.

```
Atlas/
├── public/
│   └── index.html               ← HTML entry point
├── package.json                 ← dependencies (React, Leaflet)
└── src/
    ├── index.js                 ← mounts React into index.html
    ├── App.js                   ← root component, holds shared state
    ├── App.module.css
    │
    ├── styles/
    │   └── global.css           ← CSS variables used by ALL components
    │
    ├── components/
    │   ├── SearchBar.js     ← used in TopBar + DirectionsPanel
    │   ├── SearchBar.module.css
    │   ├── Button.js        ← used in DetailPanel, DirectionsPanel
    │   ├── Button.module.css
    │   ├── Badge.js         ← Open/Closed labels everywhere
    │   ├── Badge.module.css
    │   ├── StarRating.js    ← used in ResultCard + DetailPanel
    │   │── StarRating.module.css
    │   ├── Toast.js         ← notification pop-up
    │   ├── Toast.module.css
    │   ├── TopBar.js        ← app header
    │   └── TopBar.module.css
    │   ├── FilterChips.js   ← category pills row
    │   ├── ResultCard.js    ← single place card
    │   ├── ResultsList.js   ← list of ResultCards
    │   ├── DetailPanel.js   ← expanded place info
    │   ├── Sidebar.js       ← combines all sidebar views
    │   ├── DirectionsPanel.js  ← origin/dest + route steps
    │   ├── MapView.js       ← all Leaflet logic lives here
    │   └── MapView.module.css
    │
    ├── hooks/
    │   ├── useToast.js          ← toast state management
    │   └── useGeolocation.js    ← GPS location hook
    │
    └── utils/
        ├── api.js               ← all fetch() calls (Nominatim, Overpass, OSRM)
```

### Key design decisions

- **MapView is isolated** — no other component touches Leaflet directly. Everything is passed in as props.
- **Custom browser events** are used for cross-tree communication (TopBar → MapView for layer changes, TopBar → Sidebar for search). This avoids deeply nested prop chains.
- **Two custom hooks** handle reusable logic: `useGeolocation` for GPS and `useToast` for notifications.
- **All API calls** live in `utils/api.js`. Components never call `fetch()` directly.

---

## 🔌 APIs Used

All APIs are **free and require no API key**.

| API | What it does | Docs |
|-----|-------------|------|
| **Nominatim** (OpenStreetMap) | Text search for places and addresses. Also used to convert typed location names into coordinates (geocoding) for the directions feature. | [nominatim.org](https://nominatim.org/release-docs/latest/api/Search/) |
| **Overpass API** (OpenStreetMap) | Queries the OSM database to find nearby places by category (e.g. all restaurants within 4 km of a point). Uses a custom query language. | [overpass-api.de](https://wiki.openstreetmap.org/wiki/Overpass_API) |
| **OSRM** (Open Source Routing Machine) | Calculates real driving routes between two coordinates. Returns the route path, total distance, duration, and step-by-step instructions. | [router.project-osrm.org](http://router.project-osrm.org/) |
| **Leaflet** | Open-source JavaScript library that renders the interactive map and handles markers, popups, and polylines. | [leafletjs.com](https://leafletjs.com/) |
| **CartoDB / OpenStreetMap / ArcGIS / OpenTopoMap** | Map tile providers — they supply the actual map images rendered in the background for each style. | — |

---

## 📁 Project Structure

```
mapvista-humanized/
│
├── standalone/
│   └── index.html              ← Self-contained version (open directly in browser)
│
└── react-app/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx             ← Root component, owns all shared state
        ├── App.css
        ├── index.js            ← React entry point
        │
        ├── components/
        │   ├── MapView.jsx     ← Leaflet map (markers, route, location dot)
        │   ├── Sidebar.jsx     ← Left panel with tabs
        │   ├── TopBar.jsx      ← Header with search and controls
        │   ├── SearchBar.jsx   ← Reusable text input
        │   ├── FilterChips.jsx ← Category pill buttons
        │   ├── ResultsList.jsx ← List of search results
        │   ├── ResultCard.jsx  ← Single place card
        │   ├── DetailPanel.jsx ← Place info (address, phone, hours)
        │   ├── DirectionsPanel.jsx ← Route calculator
        │   ├── StarRating.jsx  ← Star display
        │   ├── Badge.jsx       ← Open/Closed tag
        │   ├── Button.jsx      ← Reusable button
        │   └── Toast.jsx       ← Notification popup
        │
        ├── hooks/
        │   ├── useGeolocation.js ← GPS location logic
        │   └── useToast.js       ← Popup message logic
        │
        ├── utils/
        │   └── api.js            ← All fetch() calls (Nominatim, Overpass, OSRM)
        │
        └── styles/
            └── global.css        ← App-wide CSS variables and resets
```

---

## 🚀 Installation & Running Locally

### Option A — Standalone (easiest, no install)

1. Download and unzip `react-app`
2. Open `standalone/index.html` in any web browser
3. That's it — no terminal, no install needed

---

### Option B — React dev server (recommended for development)

#### Prerequisites

Make sure you have **Node.js** installed (version 16 or higher recommended).

- Download from [nodejs.org](https://nodejs.org) — choose the **LTS** version
- Verify install by running in a terminal:
  ```bash
  node --version
  npm --version
  ```

#### Steps

**1. Unzip the project**
```bash
unzip mapvista-humanized.zip
```

**2. Navigate to the React app folder**
```bash
cd mapvista-humanized/react-app
```

**3. Install dependencies**
```bash
npm install
```
This downloads all required packages (React, Leaflet, etc.) into a `node_modules` folder. This only needs to be done once.

**4. Start the development server**
```bash
npm start
```
The app will open automatically at **http://localhost:3000** in your browser. The page reloads live whenever you save a file.

---

## 🏗️ Building for Production

To create an optimised build ready to deploy:

```bash
npm run build
```

This generates a `build/` folder with minified HTML, CSS and JS files. Upload the contents of `build/` to any static hosting service.

---

## ☁️ Deploying

The app is a standard static React build and can be deployed for free on any of these platforms:

| Platform | Steps |
|----------|-------|
| **Vercel** | Install Vercel CLI → `vercel` in the project root |
| **Netlify** | Drag and drop the `build/` folder at [app.netlify.com](https://app.netlify.com) |
| **GitHub Pages** | Push to GitHub → enable Pages from the `build/` folder |

After deploying, paste your live URL at the top of this file where it says _"coming soon"_.

---

## 🛠️ Built With

- [React](https://react.dev/) — UI framework
- [Leaflet](https://leafletjs.com/) — interactive maps
- [OpenStreetMap](https://www.openstreetmap.org/) — map data
- [Nominatim](https://nominatim.org/) — place search & geocoding
- [Overpass API](https://overpass-api.de/) — nearby place queries
- [OSRM](http://project-osrm.org/) — routing engine

---

## 📄 License

This project uses open data from OpenStreetMap, licensed under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/).

---

## 🙋 Notes

- Ratings and review counts are randomly generated since the free OSM APIs do not provide them.
- The "open/closed" status shown on place cards is also randomly generated for the same reason.
- Route times are driving estimates from OSRM. Walking estimates shown in the directions panel are a rough approximation (driving time × 1.4).
