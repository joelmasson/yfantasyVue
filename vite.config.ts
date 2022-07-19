import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port:8080,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        ws: true,
      }
    },
    hmr: {
      clientPort: 443,
      host:'9c28-2607-fea8-92c0-1000-f181-9ba2-a0e7-8224.ngrok.io'
    },
    watch: {
      usePolling: true
    }
  }
})
