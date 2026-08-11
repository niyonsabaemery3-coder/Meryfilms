# MeryFilms 🎬

Frontend y'urubuga rwo kureba filime, ikoresheje **React + Vite + TypeScript + Tailwind CSS**.
Nta database ihari — amakuru y'amafilime ari muri array (`src/data/movies.ts`), kandi Admin Panel
ihindura ibyo bikubiye muri `localStorage` kugira ngo bibikwe hagati y'ubwo ufunguye paje.

## Gutangira (Getting started)

```bash
npm install
npm run dev
```

Fungura http://localhost:5173

## Imiterere y'umushinga (structure)

- `src/data/movies.ts` — array y'amafilime na category (aha ni ho "database" iri)
- `src/context/MoviesContext.tsx` — state ihuriweho na Home na Admin (CRUD + localStorage)
- `src/components/` — Navbar (hamburger menu + search), Hero (carousel), MovieRow / MovieCard
  (hover-dim effect), Footer
- `src/pages/Home.tsx` — urupapuro rw'ibanze
- `src/pages/Admin.tsx` + `src/pages/admin/*` — Admin Panel ifite menu 4 gusa:
  Dashboard, Filime, Category, Igenamiterere

## Ibiranga design (design language)

"Golden Hour Cinema" — umukara ushyushye (`void`/`reel`) uhuza n'amabara ya amber/ember, font
`Bebas Neue` ku mitwe minini, `JetBrains Mono` ku mibare/amanota, na "sprocket rule" (umurongo
usa n'uw'amafilime ya 35mm) nk'ikimenyetso cyihariye kya MeryFilms.

## Kongera kubaka (build)

```bash
npm run build
npm run preview
```
