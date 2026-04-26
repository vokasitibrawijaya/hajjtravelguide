import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Panduan Haji Interaktif',
        short_name: 'Panduan Haji',
        description: 'Aplikasi Panduan Haji Interaktif berbasis Sirah dan Hadits Shahih',
        theme_color: '#F4F5F0',
        background_color: '#F4F5F0',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3596/3596091.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3596/3596091.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
