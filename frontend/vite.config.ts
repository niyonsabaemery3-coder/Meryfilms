import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // Auto-generates a service worker that caches the app shell (JS/CSS)
    // and posters after the first visit, so a returning viewer's browser
    // loads the UI instantly from cache instead of re-downloading it —
    // this is the "feels like an app, not a slow website" gap that makes
    // returning visitors bounce on a plain frontend. Free, no backend
    // needed, and it keeps working the same way once a real API exists.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: false, // we already ship public/manifest.webmanifest
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
        runtimeCaching: [
          {
            // Cache movie posters/backdrops as they're viewed, so browsing
            // back to a title already seen this session loads instantly.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'meryfilms-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split the rarely-changing vendor libs into their own chunk so
    // browsers cache them across deploys — only the app's own (small)
    // chunk needs re-downloading when you ship a change.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
