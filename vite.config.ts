import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifestForPlugin: Partial<VitePWAOptions['manifest']> = {
  name: 'AeroScheme PWA',
  short_name: 'AeroScheme',
  description: 'Application de création de schémas aériens.',
  theme_color: '#4A90E2',
  background_color: '#ffffff',
  display: 'standalone',
  scope: '/',
  start_url: '/',
  icons: [
    {
      src: 'icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: 'icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any'
    }
  ],
};

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: manifestForPlugin,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webmanifest}']
      }
    })
  ]
});