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
      host:'e9b3-2607-fea8-92df-8f00-cc32-1e17-6a4d-9b2f.ngrok.io'
    },
    watch: {
      usePolling: true
    }
  }
})
