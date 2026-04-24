# Atlas
Interactive map and navigation engine 

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
    │   ├── common/              ← REUSABLE across the whole app
    │   │   ├── SearchBar.js     ← used in TopBar + DirectionsPanel
    │   │   ├── SearchBar.module.css
    │   │   ├── Button.js        ← used in DetailPanel, DirectionsPanel
    │   │   ├── Button.module.css
    │   │   ├── Badge.js         ← Open/Closed labels everywhere
    │   │   ├── Badge.module.css
    │   │   ├── StarRating.js    ← used in ResultCard + DetailPanel
    │   │   ├── StarRating.module.css
    │   │   ├── Toast.js         ← notification pop-up
    │   │   ├── Toast.module.css
    │   │   ├── TopBar.js        ← app header
    │   │   └── TopBar.module.css
    │   │
    │   ├── sidebar/
    │   │   ├── FilterChips.js   ← category pills row
    │   │   ├── ResultCard.js    ← single place card
    │   │   ├── ResultsList.js   ← list of ResultCards
    │   │   ├── DetailPanel.js   ← expanded place info
    │   │   ├── Sidebar.js       ← combines all sidebar views
    │   │   └── *.module.css
    │   │
    │   ├── directions/
    │   │   ├── DirectionsPanel.js  ← origin/dest + route steps
    │   │   └── DirectionsPanel.module.css
    │   │
    │   └── map/
    │       ├── MapView.js       ← all Leaflet logic lives here
    │       └── MapView.module.css
    │
    ├── hooks/
    │   ├── useToast.js          ← toast state management
    │   └── useGeolocation.js    ← GPS location hook
    │
    └── utils/
        ├── api.js               ← all fetch() calls (Nominatim, Overpass, OSRM)
        └── formatters.js        ← formatDist, formatDuration helpers
```
