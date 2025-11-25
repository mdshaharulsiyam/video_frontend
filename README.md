# Short-flix Frontend (Vite + React + Tailwind)

A small Netflix-style grid for short videos. Fetches from the backend `/api/shorts` and plays videos in a modal.

## Stack

- Vite + React (JSX)
- Tailwind CSS via PostCSS
- Deployed to Netlify/Vercel (static output in `dist/`)

## Project Structure

- `src/main.jsx` – React bootstrap
- `src/App.jsx` – App state (search, tags, fetch, modal)
- `src/components/` – UI components (Header, Card, Tag, PlayerModal)
- `src/style.css` – Tailwind directives (+ minimal dialog fallback)

## Local Development

- Backend: ensure it runs (default `http://localhost:3001`)
- Frontend:
  - `npm install`
  - `npm run dev`
  - Open `http://localhost:5173`
- Configure API base (dev): set `VITE_API_BASE` in `.env.development`

## Build & Deploy

- Build: `npm run build` (outputs `dist/`)
- Deploy `dist/` to static hosting (Netlify, Vercel, etc.)
- Production API: set `API_BASE` in `App.jsx` or use an env var during build

## Notes

- Tags are a static list on the frontend for consistent UI
- The modal supports click-outside and ESC to close
- If hosting frontend on a different origin, ensure backend CORS allows it
