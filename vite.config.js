import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/agent": {
        target: "https://newapi.alumnx.com/agrigpt/agent",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/agent/, ""),
      },
      "/api/fastapi": {
        target: "https://newapi.alumnx.com/agrigpt/fastapi",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fastapi/, ""),
      },
      "/api/cv": {
        target: "https://newapi.alumnx.com/agrigpt/cv",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cv/, ""),
      },
      "/api/speech": {
        target: "https://newapi.alumnx.com/agrigpt/speech",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/speech/, ""),
      },
    },
  },
});
