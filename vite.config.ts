// vite.config.ts
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifestForPlugin: Partial<VitePWAOptions['manifest']> = {
  // ... (votre manifeste reste inchangé)
  name: 'AeroScheme PWA',
  short_name: 'AeroScheme',
  description: 'Application de création de schémas aériens.',
  theme_color: '#4A90E2',
  background_color: '#ffffff',
  display: 'standalone',
  scope: '/<TARGET2>/', // Adaptez si votre start_url est différent
  start_url: '/<TARGET2>/', // Adaptez si besoin, ou laissez '/' et gérez le base path
  icons: [
    { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
  ],
};

export default defineConfig({
  base: '/<TARGET2>/',

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
        enabled: true, // Vous pouvez le mettre à false si vous testez la PWA uniquement après build
        type: 'module',
      },
      manifest: manifestForPlugin,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webmanifest}'],
        // Important pour GitHub Pages si servi depuis un sous-dossier
        // Cela aide Workbox à comprendre où se trouve la racine de l'application.
        modifyURLPrefix: {
          '': '/<TARGET2>/' // Assurez-vous que cela correspond à votre 'base'
        }
      }
    })
  ]
});