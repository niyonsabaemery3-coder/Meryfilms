export type SeriesStatus = 'ongoing' | 'finished'

export type MovieComment = {
  id: string
  author: string
  text: string
  createdAt: number
  replies?: MovieComment[]
}

export type Movie = {
  id: string
  title: string
  category: string
  synopsis: string
  poster: string
  backdrop: string
  // Set automatically the moment an admin adds/uploads the movie — this is
  // what drives the "X min/days/months ago" label. Once a real backend
  // exists, this should simply be the server-side created_at timestamp.
  uploadedAt: number
  // Display name shown under the title (card + Watch page). Falls back to
  // the site name in the UI when not set — no account system exists yet.
  uploadedBy?: string
  // Total watch count — incremented client-side (via localStorage) whenever
  // someone opens the Watch page. A real backend would own this counter.
  views: number
  // Engagement shown on the Watch page in place of the raw view count.
  likes?: number
  comments?: MovieComment[]
  trending?: boolean
  featured?: boolean
  episodeCurrent?: number
  episodeTotal?: number
  videoFileName?: string
  episodeFileNames?: string[]
  // Series-only metadata. seasonNumber is the season this batch of
  // episodes belongs to. status distinguishes a still-airing season
  // (admin keeps adding/renumbering episodes) from a finished one, which
  // instead gets split into downloadable "parts" (Part 1, Part 2, ...).
  seasonNumber?: number
  status?: SeriesStatus
  parts?: string[]
}

export type Category = {
  id: string
  label: string
}

// "Umusobanuzi" — the narrator/uploader credited on a title. Kept as a
// first-class list (managed in Admin) so search can match by name and the
// same person can be picked across many movies, instead of retyping text.
export type Narrator = {
  id: string
  name: string
}

export const narrators: Narrator[] = [
  { id: "moses", name: "Moses" },
  { id: "sankara-da", name: "Sankara Da" },
]

export const categories: Category[] = [
  { id: "technology", label: "🚀 Technology" },
  { id: "funny", label: "😂 Funny" },
  { id: "horror", label: "😱 Horror" },
  { id: "romance", label: "❤️ Romance" },
  { id: "action", label: "🔥 Action" },
  { id: "mystery", label: "🧠 Mystery" },
]

// Poster/backdrop art is served from a placeholder image CDN since this
// build intentionally has no database — everything lives in this array.
const poster = (seed: string) => `https://picsum.photos/seed/${seed}/500/750`
const backdrop = (seed: string) => `https://picsum.photos/seed/${seed}-wide/1600/900`

const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY
const now = Date.now()
const ago = (ms: number) => now - ms

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Umutima w'Ikirunga",
    category: "mystery",
    synopsis:
      "Umukobwa uvuka mu Birunga agomba guhitamo hagati y'umuryango we n'inzozi ze, mu gihe igihugu cye kigenda gihinduka.",
    poster: poster("umutima"),
    backdrop: backdrop("umutima"),
    uploadedAt: ago(4 * MIN),
    uploadedBy: "Moses",
    views: 12480,
    trending: true,
    featured: true,
    episodeCurrent: 1,
    episodeTotal: 6,
    seasonNumber: 1,
    status: "ongoing",
  },
  {
    id: "m2",
    title: "Umujinya wa Kivu",
    category: "action",
    synopsis: "Umupolisi wiyemeje kurwanya ubugizi bwa nabi bwabaye ku nkombe za Kivu, akoresheje ubwenge n'amaboko.",
    poster: poster("kivu"),
    backdrop: backdrop("kivu"),
    uploadedAt: ago(5 * HOUR),
    views: 8420,
    trending: true,
  },
  {
    id: "m3",
    title: "Inzozi za Kigali",
    category: "romance",
    synopsis: "Babiri baturutse mu miryango itandukanye bahura mu kabari ka Kigali, ubukwe bubasaba guhitamo urukundo cyangwa umuco.",
    poster: poster("kigali"),
    backdrop: backdrop("kigali"),
    uploadedAt: ago(1 * DAY),
    views: 512,
  },
  {
    id: "m4",
    title: "Amayira y'Ubuzima",
    category: "mystery",
    synopsis: "Inkuru y'umuryango w'abahinzi bahangana n'ubukungu bugoye, bashaka inzira nshya yo kubaho.",
    poster: poster("amayira"),
    backdrop: backdrop("amayira"),
    uploadedAt: ago(4 * DAY),
    uploadedBy: "Sankara Da",
    views: 15320,
    trending: true,
    episodeCurrent: 3,
    episodeTotal: 8,
    seasonNumber: 2,
    status: "finished",
    parts: ["Part 1", "Part 2"],
  },
  {
    id: "m5",
    title: "Igitaramo cy'Ibiseka",
    category: "funny",
    synopsis: "Itsinda ry'inshuti rigerageza gutunganya ubukwe bw'incuti yabo, ariko buri gikorwa kirananirana mu buryo butunguranye.",
    poster: poster("igitaramo"),
    backdrop: backdrop("igitaramo"),
    uploadedAt: ago(14 * DAY),
    views: 301,
  },
  {
    id: "m6",
    title: "Ubukonje bw'Amajyaruguru",
    category: "action",
    synopsis: "Umusirikare wahoze arwana agarutse mu gihugu, agomba kurengera umudugudu we ku mupaka.",
    poster: poster("ubukonje"),
    backdrop: backdrop("ubukonje"),
    uploadedAt: ago(2 * MONTH),
    views: 4210,
  },
  {
    id: "m7",
    title: "Impamvu Nyakuri",
    category: "technology",
    synopsis: "Documentary igaragaza uburyo abanyarwanda bakiri bato bahanze udushya twafashije abaturage benshi.",
    poster: poster("impamvu"),
    backdrop: backdrop("impamvu"),
    uploadedAt: ago(5 * MONTH),
    views: 730,
    trending: true,
  },
  {
    id: "m8",
    title: "Urukundo Rutagira Ipfundo",
    category: "romance",
    synopsis: "Umwarimu n'umuganga bahurira mu mujyi muto, urukundo rwabo rugerageza kwihanganira intera n'ibindi bibazo.",
    poster: poster("urukundo"),
    backdrop: backdrop("urukundo"),
    uploadedAt: ago(1 * YEAR),
    views: 2104,
  },
  {
    id: "m9",
    title: "Amasaha y'Umwijima",
    category: "horror",
    synopsis: "Nyuma y'ijoro rimwe rigoye, itsinda ry'abasore rigomba guhunga ku bw'ubuzima bwabo mu mujyi utazi.",
    poster: poster("amasaha"),
    backdrop: backdrop("amasaha"),
    uploadedAt: ago(30 * MIN),
    views: 612,
  },
  {
    id: "m10",
    title: "Ijambo ry'Umukecuru",
    category: "mystery",
    synopsis: "Umukecuru asigaye wenyine mu mudugudu asangira ubwenge bwe n'umwuzukuru we uje kumusura.",
    poster: poster("ijambo"),
    backdrop: backdrop("ijambo"),
    uploadedAt: ago(2 * YEAR),
    views: 254,
  },
  {
    id: "m11",
    title: "Amakuru Meza",
    category: "funny",
    synopsis: "Umunyamakuru mushya agerageza kwandika inkuru ye ya mbere nini, ariko buri wese amuha inama zinyuranye.",
    poster: poster("amakuru"),
    backdrop: backdrop("amakuru"),
    uploadedAt: ago(1 * MONTH),
    views: 3305,
  },
  {
    id: "m12",
    title: "Ubutumwa bw'Isi",
    category: "technology",
    synopsis: "Urugendo rwo kureba uburyo ibihugu bito byo muri Afurika bihangana n'imihindagurikire y'ikirere.",
    poster: poster("ubutumwa"),
    backdrop: backdrop("ubutumwa"),
    uploadedAt: ago(8 * MONTH),
    views: 897,
  },
]
