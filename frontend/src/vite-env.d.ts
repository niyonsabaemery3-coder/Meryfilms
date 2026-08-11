/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Frontend-only admin gate password — see src/pages/AdminGate.tsx for why
  // this is NOT real security. Set in a local .env file; never commit one.
  readonly VITE_ADMIN_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

