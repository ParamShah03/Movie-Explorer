````md
# Movie Explorer

## Hosted App
- **Live URL:** https://<YOUR_VERCEL_URL>.vercel.app

---

## Setup & Run Instructions

### Prerequisites
- **Node.js 18+** (recommended: Node 20)
- **TMDB API key (v3)**

### Install
```bash
npm install
````

### Configure Environment Variables

Create **`.env.local`** in the project root:

```txt
TMDB_API_KEY=YOUR_TMDB_V3_API_KEY
```

> Keep this server-side (do **not** prefix with `NEXT_PUBLIC_`).

### Run (Development)

```bash
npm run dev
```

Open: `http://localhost:3000`

### Build / Run (Production)

```bash
npm run build
npm run start
```

---

## Technical Decisions & Tradeoffs

### API Proxy (TMDB key stays server-side)

* The client calls **Next.js API routes** under `/api/tmdb/...`.
* Those routes call TMDB using `process.env.TMDB_API_KEY`, so the key is never exposed in the browser.

**Tradeoff:** Adds a small extra hop/latency, but improves security and keeps external API logic centralized.

### State Management (React Context)

* Favorites, ratings, and notes are managed via a lightweight `FavoritesContext`.
* This avoids extra dependencies and keeps shared state consistent across components.

**Tradeoff:** Context is ideal for this small scope; for larger apps, a dedicated state library (e.g., Zustand/Redux) or server-state tooling could be considered.

### Persistence (LocalStorage)

* Favorites persist via **LocalStorage** so they survive refresh without any backend/database setup.

**Tradeoff:** Data is per-device and not shared across browsers/devices; no multi-user sync.

---

## Known Limitations & What I’d Improve With More Time

### Known Limitations

* Search uses only the first page of results (no pagination/infinite scroll).
* No caching layer for TMDB responses (could hit rate limits under heavy usage).
* Basic UI/UX (functional over polished), minimal accessibility refinements.
* Persistence is client-only (LocalStorage), no cross-device sync.

### Improvements With More Time

* Add pagination or infinite scrolling for search results.
* Add response caching with a short TTL on the proxy routes.
* Improve accessibility (focus trapping in modal, keyboard navigation) and add loading skeletons.
* Add optional server-side persistence (Next.js API + lightweight DB) for cross-device favorites.
* Add basic tests (utilities + favorites flow) to improve reliability.

```
::contentReference[oaicite:0]{index=0}
```
