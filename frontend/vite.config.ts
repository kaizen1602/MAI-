import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite para desarrollo local
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantener /api en la ruta
      },
      "/storage": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantener /storage en la ruta
      },
    },
  },
});
