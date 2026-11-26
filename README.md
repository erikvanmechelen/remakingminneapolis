# Remaking Minneapolis — Tangletown Flashcard Decks

Full-screen photo decks for Tangletown sites. Pick a location, then step through giant slideshow cards with soft lore captions.

**Map work is separate** — this app is photo decks only.

## Sites

1. **Washburn Park Water Tower** — ridge lantern / guardians (1931–32)
2. **Justice Page / Washburn High** — orphan asylum lore under the campus ridge
3. **St. John's Lutheran** — Nicollet steeple + tunnel rumor

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Data

- Working deck JSON: `data/flashcard-decks.json` (mirrored to `public/data/` for fetch)
- Images under `public/images/{tower,schools,church}/`
- Millett LTC archive (HCL Special Collections) had **no matching Tangletown rows** for these three sites in the v1 scan — decks are mostly `working-new` plus public-domain / CC Commons photos and one HCL NoC-US aerial

## Controls

- **Next / Previous** buttons
- Keyboard: `→` / `Space` next, `←` previous, `Esc` back to decks
- Mobile: swipe or tap left/right half of the photo

## Gaps

- Church deck is placeholder imagery until a co-gathered exterior photo lands
- Asylum / tunnel cards stay soft lore — not settled archive fact
- Some school cards still use labeled `WORKING · NEW` placeholders
- No map, geolocation, or contribution backend in this PR
