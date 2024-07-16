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
      host: "f3f0-2605-b100-e003-3f94-516f-631a-2fef-a083.ngrok-free.app",
    },
    watch: {
      usePolling: true,
    },
  },
});
