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
      host:'b604-70-51-218-149.ngrok.io'
    },
    watch: {
      usePolling: true
    }
  }
})
