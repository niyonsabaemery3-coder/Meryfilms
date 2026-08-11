# MeryFilms — full project (backend + frontend)

```
meryfilms-full/
├── backend/     Fastify + MongoDB API, JWT auth, demo admin account
└── frontend/    The MeryFilms React app, wired to call backend/
```

## Run it

**1. Backend** (in `backend/`):
```bash
npm install
cp .env.example .env      # fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev                # http://localhost:4000
```
See `backend/README.md` for the free MongoDB Atlas + free Render hosting steps.

**2. Frontend** (in `frontend/`):
```bash
npm install
cp .env.example .env.local   # VITE_API_URL=http://localhost:4000
npm run dev                   # http://localhost:5173
```

Log into `/admin` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env` — that account is auto-created the first time the backend boots.

Run both at once from different terminals (or two panes) — the frontend needs the backend running to load any data.
"# Meryfilms" 
