import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA as pwa } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 5173
  },
  plugins: [vue(), vueJsx(), pwa({ registerType: 'autoUpdate' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
