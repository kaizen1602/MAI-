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
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
