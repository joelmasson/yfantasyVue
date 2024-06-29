import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    proxy: {
      "/auth": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
        ws: true,
      },
      "/api": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
      host: "35cb-2607-fea8-92de-6e00-d984-1409-4bc7-4a6f.ngrok-free.app",
    },
    watch: {
      usePolling: true,
    },
  },
});
