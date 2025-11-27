import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite para desarrollo local
// NOTA: En Docker, el frontend se sirve estáticamente desde nginx,
// y el proxy se configura en frontend/nginx.conf
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Permitir acceso desde otros contenedores
    proxy: {
      "/api": {
        // En desarrollo local: proxy a nginx en Docker (puerto 80)
        // O si Laravel corre directamente: http://localhost:8000
        target: process.env.VITE_API_URL || "http://localhost:80",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantener /api en la ruta
      },
      "/storage": {
        target: process.env.VITE_API_URL || "http://localhost:80",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantener /storage en la ruta
      },
    },
  },
});
