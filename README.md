# Old Twin Cities — Tangletown v1

Gamelike top-down / light semi-3D map prototype for **Tangletown, Minneapolis**. Free roam three sample historic pins; unlock near-me discovery rewards within ~150m (or mock location for demo).

## Sites

| Pin | Place | Coords (lat, lon) |
| --- | --- | --- |
| The Tower | Washburn Park Water Tower (1893) | 44.9107594, -93.2842828 |
| The Schools | Justice Page Middle / Washburn High (orphan-asylum lore) | 44.913425, -93.280352 |
| The Church | St. John's Lutheran, north of Justice Page (tunnel lore) | 44.9146942, -93.2784751 |

Working dataset: [`data/tangletown-sites.json`](data/tangletown-sites.json) (also served from `public/data/`). Immutable Larry Millett LTC archive stays separate under the project store; these Tangletown pins are **new working data** (no Millett row match in v1 scan). Attribute Millett materials carefully to Hennepin County Library Special Collections when used.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # serve dist/
```

## Near me

- **Near me** uses browser geolocation. On insecure HTTP (non-localhost) it may fail — use **Mock near pin**.
- Within ~150m of a Tangletown pin, a small “discovered” reward unlocks (stored in `localStorage`).
- Free roam always works; near-me is scoped only to these three sites.

## Stack

Vite + React + TypeScript + MapLibre GL (OpenFreeMap dark vector style, pitched view).

## Out of scope (v1)

Street View / arrive-on-site, full 87 neighborhoods, St. Paul, contribution upload backend, real then/now photography.
