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
      host: "49fe-2607-fea8-92e2-af00-11d7-3fb-2cf9-37bb.ngrok.io",
    },
    watch: {
      usePolling: true,
    },
  },
});
