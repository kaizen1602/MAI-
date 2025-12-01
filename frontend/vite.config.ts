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
        // En desarrollo local: proxy a Laravel en puerto 8000
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantener /api en la ruta
      },
      "/storage": {
        // En desarrollo local: proxy a Laravel en puerto 8000
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantener /storage en la ruta
      },
    },
  },
});
