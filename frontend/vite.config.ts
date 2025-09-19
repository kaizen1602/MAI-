import { defineConfig } from 'vite';

// Configuración de Vite para desarrollo local
// - Proxy: redirige las solicitudes que empiezan por "/api" al backend (Nginx+PHP) en http://localhost
//   Esto evita problemas de CORS y permite usar rutas relativas en el frontend: fetch('/api/...')
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost', // Nginx expone Laravel en http://localhost
        changeOrigin: true,
        secure: false,
        // opcional: eliminar el prefijo /api si Nginx no lo maneja
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Si usas Laravel Sanctum, descomenta para la ruta de CSRF
      // '/sanctum': {
      //   target: 'http://localhost',
      //   changeOrigin: true,
      //   secure: false,
      // },
    },
  },
});

