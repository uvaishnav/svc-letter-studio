import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Make 'global' and 'process' available for packages that expect a Node-like env.
  // @react-pdf/renderer (pdfkit) checks for global.Buffer and process.env.
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.browser': 'true',
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo/logo.svg', 'logo/logo.png'],
      manifest: {
        name: 'SVC Letter Studio',
        short_name: 'SVC Letters',
        description: 'Premium branded letterhead generator for Sri Vaishnav Constructions',
        theme_color: '#3B2A1F',
        background_color: '#F5F1E8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // navigateFallback only applies to HTML navigation requests.
        // Deny asset paths so the SW never returns index.html for a .js/.css request
        // (WebKit/Safari rejects any JS served as text/html).
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^\/assets\//,   // Vite build output chunks
          /\.js$/,
          /\.css$/,
          /\.png$/,
          /\.svg$/,
          /\.ico$/,
          /\.woff2$/,
          /\.webmanifest$/,
        ],
        runtimeCaching: [
          {
            // JS and CSS assets — network first so fresh deploys propagate,
            // fall back to cache when offline.
            urlPattern: /\.(?:js|css)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            // Fonts and images — cache first (rarely change).
            urlPattern: /\.(?:png|svg|ico|woff2)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-media',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
})
