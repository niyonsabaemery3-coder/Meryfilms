export type Lang = 'en' | 'rw'

export const categoryLabels: Record<string, { en: string; rw: string }> = {
  technology: { en: '🚀 Technology', rw: '🚀 Ikoranabuhanga' },
  funny: { en: '😂 Funny', rw: '😂 Urwenya' },
  horror: { en: '😱 Horror', rw: '😱 Ubwoba' },
  romance: { en: '❤️ Romance', rw: '❤️ Urukundo' },
  action: { en: '🔥 Action', rw: '🔥 Ibikorwa' },
  mystery: { en: '🧠 Mystery', rw: '🧠 Amayobera' },
}

export type TranslationSet = {
  nav_search_placeholder: string
  nav_admin: string
  nav_all: string
  hero_trending_badge: string
  hero_watch_now: string
  hero_more_info: string
  home_results_for: (q: string) => string
  home_no_results: string
  home_trending_row: string
  row_related: string
  card_movie: string
  card_season: string
  card_season_episode: (season: number, ep: number) => string
  card_parts: (parts: string[]) => string
  card_parts_count: (n: number) => string
  card_episodes_count: (n: number) => string
  card_uploader_fallback: string
  footer_built_in: string
  footer_disclaimer: string
  watch_back: string
  watch_demo_notice: string
  watch_episodes: string
  watch_episode: string
  watch_not_found: string
  watch_back_home: string
  watch_like: string
  watch_liked: string
  watch_comments: string
  watch_comment_name_placeholder: string
  watch_comment_placeholder: string
  watch_comment_submit: string
  watch_comment_reply: string
  watch_comment_reply_placeholder: string
  watch_comment_empty: string
  watch_download_section: string
  watch_watch_btn: string
  watch_download_btn: string
  watch_comments_more: (n: number) => string
  admin_nav_dashboard: string
  admin_nav_movies: string
  admin_nav_categories: string
  admin_nav_narrators: string
  admin_nav_settings: string
  admin_nav_back: string
  dash_title: string
  dash_subtitle: string
  dash_stat_total: string
  dash_stat_trending: string
  dash_stat_views: string
  dash_stat_categories: string
  dash_by_category: string
  movies_title: string
  movies_subtitle: string
  movies_add: string
  movies_table_movie: string
  movies_table_category: string
  movies_table_episodes: string
  movies_table_uploaded: string
  movies_table_views: string
  movies_table_actions: string
  movies_empty: string
  modal_add_title: string
  modal_edit_title: string
  field_title: string
  field_category: string
  field_description: string
  is_series: string
  is_series_hint: string
  upload_movie: string
  upload_movie_placeholder: string
  movie_parts_label: string
  field_season_number: string
  field_status: string
  status_ongoing: string
  status_finished: string
  episodes_label: string
  add_episode: string
  episode_placeholder: (n: number) => string
  episodes_note: (n: number) => string
  episode_number_label: string
  renumber_episodes: string
  parts_label: string
  add_part: string
  part_name_placeholder: string
  part_file_placeholder: (n: number) => string
  parts_note: (n: number) => string
  cover_label: string
  cover_choose: string
  cover_url_placeholder: string
  cover_hint: string
  trending_checkbox: string
  featured_checkbox: string
  save: string
  saving: string
  cancel: string
  edit: string
  remove: string
  categories_title: string
  categories_subtitle: string
  categories_new_placeholder: string
  categories_add: string
  categories_empty: string
  categories_count: (n: number) => string
  narrators_title: string
  narrators_subtitle: string
  narrators_new_placeholder: string
  narrators_add: string
  narrators_empty: string
  narrators_count: (n: number) => string
  field_narrator: string
  narrator_none: string
  settings_movies_per_page: string
  settings_movies_per_page_hint: string
  pagination_prev: string
  pagination_next: string
  pagination_page_of: (page: number, total: number) => string
  settings_title: string
  settings_subtitle: string
  settings_site_name: string
  settings_tagline: string
  settings_support_email: string
  settings_save: string
  settings_reset: string
  settings_saved: string
}

export const dict: Record<Lang, TranslationSet> = {
  en: {
    nav_search_placeholder: 'Search by title or narrator...',
    nav_admin: 'ADMIN',
    nav_all: 'All',
    hero_trending_badge: 'Trending Now',
    hero_watch_now: 'Watch Now',
    hero_more_info: 'More Info',
    home_results_for: (q: string) => `Results for "${q}"`,
    home_no_results: 'No movies found. Try another search or category.',
    home_trending_row: 'Trending Now',
    row_related: 'You may also like',
    card_movie: 'Movie',
    card_season: 'Season',
    card_season_episode: (season: number, ep: number) => `Season ${season} · EP ${ep}`,
    card_parts: (parts: string[]) => parts.join(' · '),
    card_parts_count: (n: number) => `${n} Part${n === 1 ? '' : 's'}`,
    card_episodes_count: (n: number) => `${n} Episode${n === 1 ? '' : 's'}`,
    card_uploader_fallback: 'MeryFilms',
    footer_built_in: 'Built in Kigali, Rwanda',
    footer_disclaimer:
      "MeryFilms is a frontend demo with no database — movie data lives in an array in the code. All posters are placeholders.",
    watch_back: 'Back',
    watch_demo_notice: 'Demo video — no backend yet, the real video will be wired in here later.',
    watch_episodes: 'Episodes',
    watch_episode: 'Episode',
    watch_not_found: 'This movie could not be found.',
    watch_back_home: '\u2190 Back to home',
    watch_like: 'Like',
    watch_liked: 'Liked',
    watch_comments: 'Comments',
    watch_comment_name_placeholder: 'Your name',
    watch_comment_placeholder: 'Add a comment...',
    watch_comment_submit: 'Post',
    watch_comment_reply: 'Reply',
    watch_comment_reply_placeholder: 'Write a reply...',
    watch_comment_empty: 'No comments yet — be the first to say something.',
    watch_download_section: 'Watch / Download',
    watch_watch_btn: 'Watch',
    watch_download_btn: 'Download',
    watch_comments_more: (n: number) => `+${n} more comment${n === 1 ? '' : 's'}`,
    admin_nav_dashboard: 'Dashboard',
    admin_nav_movies: 'Movies',
    admin_nav_categories: 'Categories',
    admin_nav_narrators: 'Narrators',
    admin_nav_settings: 'Settings',
    admin_nav_back: 'Back to site',
    dash_title: 'Dashboard',
    dash_subtitle: "A quick overview of what's on MeryFilms right now.",
    dash_stat_total: 'Total movies',
    dash_stat_trending: 'Trending',
    dash_stat_views: 'Total views',
    dash_stat_categories: 'Categories',
    dash_by_category: 'Movies per category',
    movies_title: 'Movies',
    movies_subtitle: 'Add, edit, or remove movies in the array.',
    movies_add: 'Add Movie',
    movies_table_movie: 'Movie',
    movies_table_category: 'Category',
    movies_table_episodes: 'Episodes',
    movies_table_uploaded: 'Uploaded',
    movies_table_views: 'Views',
    movies_table_actions: 'Actions',
    movies_empty: 'No movies yet. Click "Add Movie" to get started.',
    modal_add_title: 'Add New Movie',
    modal_edit_title: 'Edit Movie',
    field_title: 'Movie title',
    field_category: 'Category',
    field_description: 'Description',
    is_series: 'This is a Series (multiple episodes)',
    is_series_hint: 'You can upload several video files at once',
    upload_movie: 'Upload Movie',
    upload_movie_placeholder: 'Choose a video file (.mp4, .mkv...)',
    movie_parts_label: 'Video parts — add several if the movie is split into files',
    field_season_number: 'Season number',
    field_status: 'Status',
    status_ongoing: 'Ongoing — not finished yet',
    status_finished: 'Finished',
    episodes_label: 'Episodes — upload several at once',
    add_episode: 'Add episode',
    episode_placeholder: (n: number) => `Choose video for episode ${n}`,
    episodes_note: (n: number) => `Total episodes will show as 1/${n} on the card.`,
    episode_number_label: 'Ep #',
    renumber_episodes: 'Renumber sequentially',
    parts_label: 'Parts — add once the season is complete',
    add_part: 'Add part',
    part_name_placeholder: 'Part name (e.g. Part 1)',
    part_file_placeholder: (n: number) => `Choose file for part ${n}`,
    parts_note: (n: number) => `${n} part(s) will show under the title.`,
    cover_label: 'Cover image',
    cover_choose: 'Choose an image (optional)',
    cover_url_placeholder: 'Or paste an image link (optional)',
    cover_hint:
      "If you don't provide a cover, we'll automatically search the iTunes Search API using the movie title.",
    trending_checkbox: 'Trending',
    featured_checkbox: 'Show on Hero',
    save: 'Save',
    saving: 'Fetching cover...',
    cancel: 'Cancel',
    edit: 'Edit',
    remove: 'Remove',
    categories_title: 'Categories',
    categories_subtitle: 'Manage the genres used across the site.',
    categories_new_placeholder: 'New category name...',
    categories_add: 'Add',
    categories_empty: 'No categories yet.',
    categories_count: (n: number) => `${n} movies`,
    narrators_title: 'Narrators',
    narrators_subtitle: "Manage the people credited as \"umusobanuzi\" on titles — searchable by name.",
    narrators_new_placeholder: 'New narrator name...',
    narrators_add: 'Add',
    narrators_empty: 'No narrators yet.',
    narrators_count: (n: number) => `${n} movies`,
    field_narrator: 'Narrator (Umusobanuzi)',
    narrator_none: 'No narrator',
    settings_movies_per_page: 'Movies per page (admin list)',
    settings_movies_per_page_hint: 'How many rows show at once in the admin movies table before Next/Previous paging kicks in.',
    pagination_prev: 'Previous',
    pagination_next: 'Next',
    pagination_page_of: (page: number, total: number) => `Page ${page} of ${total}`,
    settings_title: 'Settings',
    settings_subtitle: 'Stored in localStorage since there is no database.',
    settings_site_name: 'Site name',
    settings_tagline: 'Tagline',
    settings_support_email: 'Support email',
    settings_save: 'Save',
    settings_reset: 'Reset to default',
    settings_saved: 'Saved ✓',
  },
  rw: {
    nav_search_placeholder: 'Shakisha izina cyangwa umusobanuzi...',
    nav_admin: 'ADMIN',
    nav_all: 'Byose',
    hero_trending_badge: 'Birimo kureba cyane',
    hero_watch_now: 'Reba Nonaha',
    hero_more_info: 'Amakuru Arambuye',
    home_results_for: (q: string) => `Ibisubizo bya "${q}"`,
    home_no_results: 'Nta filime yabonetse. Gerageza ijambo rindi cyangwa uhitemo indi category.',
    home_trending_row: 'Birimo kureba cyane',
    row_related: 'Izindi zisa n\u2019iyi',
    card_movie: 'Filime',
    card_season: 'Season',
    card_season_episode: (season: number, ep: number) => `Season ${season} · Igice ${ep}`,
    card_parts: (parts: string[]) => parts.join(' · '),
    card_parts_count: (n: number) => `${n} Ibice`,
    card_episodes_count: (n: number) => `${n} Ibice`,
    card_uploader_fallback: 'MeryFilms',
    footer_built_in: 'Byakorewe i Kigali, u Rwanda',
    footer_disclaimer:
      "MeryFilms ni frontend igerageza, idafite database — amakuru y'amafilime aturuka mu array yo muri code. Poster zose ni izigerageza gusa.",
    watch_back: 'Subira inyuma',
    watch_demo_notice: 'Demo video — nta backend ihari, video nyayo izajya ishyirwa hano nyuma.',
    watch_episodes: 'Ibice',
    watch_episode: 'Igice',
    watch_not_found: 'Iyi filime ntibonetse.',
    watch_back_home: '\u2190 Subira ku rubuga',
    watch_like: 'Kunda',
    watch_liked: 'Wabikunze',
    watch_comments: 'Ibitekerezo',
    watch_comment_name_placeholder: 'Amazina yawe',
    watch_comment_placeholder: 'Andika igitekerezo...',
    watch_comment_submit: 'Ohereza',
    watch_comment_reply: 'Subiza',
    watch_comment_reply_placeholder: 'Andika igisubizo...',
    watch_comment_empty: 'Nta gitekerezo kirimo — ba uwa mbere utanga igitekerezo.',
    watch_download_section: 'Reba / Kuramo',
    watch_watch_btn: 'Reba',
    watch_download_btn: 'Kuramo',
    watch_comments_more: (n: number) => `+${n} ibindi bitekerezo`,
    admin_nav_dashboard: 'Dashboard',
    admin_nav_movies: 'Filime',
    admin_nav_categories: 'Category',
    admin_nav_narrators: 'Abasobanuzi',
    admin_nav_settings: 'Igenamiterere',
    admin_nav_back: 'Subira ku rubuga',
    dash_title: 'Dashboard',
    dash_subtitle: "Incamake y'ibiri kuri MeryFilms nonaha.",
    dash_stat_total: 'Filime zose',
    dash_stat_trending: 'Zirimo gukurikiranwa',
    dash_stat_views: 'Abarebye bose',
    dash_stat_categories: 'Category',
    dash_by_category: 'Filime kuri buri Category',
    movies_title: 'Filime',
    movies_subtitle: 'Ongera, hindura cyangwa usibe filime muri array.',
    movies_add: 'Ongeramo Filime',
    movies_table_movie: 'Filime',
    movies_table_category: 'Category',
    movies_table_episodes: 'Ibice',
    movies_table_uploaded: 'Yashyizweho',
    movies_table_views: 'Abarebye',
    movies_table_actions: 'Ibikorwa',
    movies_empty: 'Nta filime irahari. Kanda "Ongeramo Filime" utangire.',
    modal_add_title: 'Ongeramo Filime Nshya',
    modal_edit_title: 'Hindura Filime',
    field_title: 'Movie title',
    field_category: 'Category',
    field_description: 'Description',
    is_series: 'Ni Series (ifite ibice byinshi)',
    is_series_hint: 'Ushobora kohereza videwo nyinshi icyarimwe',
    upload_movie: 'Upload Movie',
    upload_movie_placeholder: "Hitamo dosiye ya video (.mp4, .mkv...)",
    movie_parts_label: "Ibice bya video — ongeramo byinshi niba film igabanyijemo amadosiye menshi",
    field_season_number: 'Nimero ya Season',
    field_status: 'Uko bimeze',
    status_ongoing: 'Biracyagenda — ntiburarangira',
    status_finished: 'Byarangiye',
    episodes_label: 'Ibice — ohereza byinshi icyarimwe',
    add_episode: 'Ongeramo igice',
    episode_placeholder: (n: number) => `Hitamo video y'igice ${n}`,
    episodes_note: (n: number) => `Total episode izagaragara nka 1/${n} kuri card.`,
    episode_number_label: 'Igice #',
    renumber_episodes: 'Ongera unumure uko bikurikirana',
    parts_label: 'Parts — ongeraho igihe season yarangiye',
    add_part: 'Ongeramo Part',
    part_name_placeholder: "Izina rya Part (urugero: Part 1)",
    part_file_placeholder: (n: number) => `Hitamo dosiye ya Part ${n}`,
    parts_note: (n: number) => `Parts ${n} zizagaragara munsi y'izina.`,
    cover_label: 'Cover image',
    cover_choose: 'Hitamo ifoto (optional)',
    cover_url_placeholder: "Cyangwa shyiramo link y'ifoto (optional)",
    cover_hint:
      "Niba nta cover watanze, tuzayishakisha automatiquement kuri iTunes Search API ukurikije izina ry'ifilime.",
    trending_checkbox: 'Trending',
    featured_checkbox: 'Erekana kuri Hero',
    save: 'Bika',
    saving: 'Dushakisha ifoto...',
    cancel: 'Hagarika',
    edit: 'Hindura',
    remove: 'Siba',
    categories_title: 'Category',
    categories_subtitle: "Genzura amoko y'amafilime akoreshwa ku rubuga.",
    categories_new_placeholder: 'Izina rya category nshya...',
    categories_add: 'Ongeraho',
    categories_empty: 'Nta category irahari.',
    categories_count: (n: number) => `${n} filime`,
    narrators_title: 'Abasobanuzi',
    narrators_subtitle: 'Genzura abantu basobanura amafilime — bashobora gushakishwa n\'amazina yabo.',
    narrators_new_placeholder: "Izina ry'umusobanuzi mushya...",
    narrators_add: 'Ongeraho',
    narrators_empty: 'Nta musobanuzi urahari.',
    narrators_count: (n: number) => `${n} filime`,
    field_narrator: 'Umusobanuzi',
    narrator_none: 'Nta musobanuzi',
    settings_movies_per_page: 'Umubare wa filime kuri paje (admin)',
    settings_movies_per_page_hint: 'Umubare wa filime zigaragara icyarimwe ku meza y\'ubuyobozi mbere y\'uko hakoreshwa buto za Next/Previous.',
    pagination_prev: 'Isubiye inyuma',
    pagination_next: 'Ikurikira',
    pagination_page_of: (page: number, total: number) => `Paje ${page} kuri ${total}`,
    settings_title: 'Igenamiterere',
    settings_subtitle: 'Ibi bibikwa muri localStorage, kuko nta database ihari.',
    settings_site_name: "Izina ry'urubuga",
    settings_tagline: 'Interruro (tagline)',
    settings_support_email: 'Email yo gufasha',
    settings_save: 'Bika',
    settings_reset: 'Subiza uko byari bimeze',
    settings_saved: 'Byabitswe ✓',
  },
}
