# MeryFilms Backend

Node.js + Fastify + MongoDB (Mongoose), JWT auth. Built to run entirely on free tiers.

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — free MongoDB Atlas cluster (see below)
- `JWT_SECRET` — run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your demo admin login

```bash
npm run dev
```

Server starts on `http://localhost:4000`. On first boot it auto-creates the
demo admin account and default categories/narrators — nothing to run by hand.

## 2. Free MongoDB (Atlas M0)

1. https://www.mongodb.com/cloud/atlas/register — free, no card required for M0.
2. Create a free **M0** cluster (512MB — plenty for this stage).
3. Database Access → add a user + password.
4. Network Access → Allow access from anywhere (`0.0.0.0/0`) for now.
5. Connect → Drivers → copy the connection string into `MONGODB_URI`.

## 3. Free hosting for the API (Render)

1. Push this `backend/` folder to its own GitHub repo.
2. https://render.com → New → Web Service → connect the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Add the same env vars from `.env` in Render's dashboard.
5. Free tier sleeps after 15 min idle and wakes on the next request
   (a few seconds' delay) — fine for this stage, upgrade later when it earns.

## 4. Demo admin login

```
email:    (ADMIN_EMAIL in .env)
password: (ADMIN_PASSWORD in .env)
```

`POST /api/auth/login` → returns `{ token, user }`. Send the token as
`Authorization: Bearer <token>` on every admin-only request.

## 5. API summary

| Method | Path                        | Auth  | Notes |
|--------|-----------------------------|-------|-------|
| POST   | /api/auth/login             | —     | email + password → JWT |
| GET    | /api/auth/me                | admin | current session |
| GET    | /api/movies                 | —     | ?category=&search=&trending=&featured=&page=&limit= |
| GET    | /api/movies/:id             | —     | |
| POST   | /api/movies                 | admin | create |
| PUT    | /api/movies/:id             | admin | update |
| DELETE | /api/movies/:id             | admin | delete |
| POST   | /api/movies/:id/view        | —     | increments view count |
| POST   | /api/movies/:id/like        | —     | increments like count |
| POST   | /api/movies/:id/comments    | —     | { author, text } |
| PUT    | /api/movies/bulk-sync       | admin | admin panel "save all" |
| GET    | /api/categories             | —     | |
| POST/PUT/DELETE /api/categories/:slug | admin | |
| PUT    | /api/categories/bulk-sync   | admin | |
| GET    | /api/narrators              | —     | |
| POST/PUT/DELETE /api/narrators/:slug | admin | |
| PUT    | /api/narrators/bulk-sync    | admin | |

## 6. Why this stack

- **Fastify** — newer-generation, schema-validated, one of the fastest
  Node.js frameworks (faster than Express under load) — scales well as
  traffic grows without a rewrite.
- **MongoDB/Mongoose** — flexible schema fits the movie/series/parts shape,
  and Atlas's free tier + built-in indexes (text search, category, trending)
  keep queries fast even with a large catalog.
- **JWT + bcrypt** — stateless auth (no server-side session store needed,
  so it scales horizontally for free), industry-standard password hashing.
- **helmet + rate-limit + cors** — production security defaults out of the box.

Still to wire up: connecting this to the MeryFilms frontend (replacing
localStorage calls with API calls) — next step once you're ready.
