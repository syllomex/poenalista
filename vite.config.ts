import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      devOptions: { enabled: true },
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
      },
      manifest: {
        name: 'Põe na Lista',
        short_name: 'Põe na Lista',
        description:
          'Crie suas listas para qualquer coisa e compartilhe com quem quiser!',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        "theme_color": "#242424",
        "background_color": "#FFFFFF",
        display: 'standalone',
        orientation: 'portrait',
      },
    }),
  ],
})
