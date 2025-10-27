# 🌾 MAI - Mercado Agro Inteligente

Una plataforma web para conectar productores y compradores de productos agrícolas en Honduras.

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+
- PHP 8.1+ (para desarrollo local)

### Instalación
```bash
# 1. Clonar repositorio
git clone <tu-repositorio>
cd MAI-

# 2. Levantar servicios
docker-compose up -d

# 3. Configurar base de datos
docker exec php_fpm php artisan migrate
docker exec php_fpm php artisan db:seed

# 4. Instalar frontend
cd frontend && npm install && npm run dev
```

### Acceso
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/api
- **PhpMyAdmin**: http://localhost:8080

### Credenciales de Prueba
- **Vendedor**: `vendedor@test.com` / `password`
- **Comprador**: `comprador@test.com` / `password`

## 📚 Documentación Completa

### 🏗️ Arquitectura
- **[Backend](./guia/BACKEND.md)** - Laravel 10, API RESTful, MySQL
- **[Frontend](./guia/FRONTEND.md)** - React 18, TypeScript, Tailwind CSS
- **[Capa de Datos](./guia/DATA_LAYER.md)** - Servicios, Context API, Tipos

### 🛠️ Instalación Detallada
- **[Guía Completa](./guia/INSTALACION_COMPLETA.md)** - Paso a paso desde cero
- **[Troubleshooting](./guia/TROUBLESHOOTING.md)** - Solución de errores comunes

## ✨ Características

### 🔐 Autenticación
- Login/Registro con validación
- Perfiles de usuario completos
- Roles (Vendedor/Comprador)

### 📝 Publicaciones
- Crear publicaciones (Oferta/Demanda)
- Subir imágenes
- Filtros avanzados
- Búsqueda en tiempo real

### 🛒 Compras
- Historial de compras
- Sistema de calificaciones
- Contacto por WhatsApp

### 🎨 UI/UX
- Diseño responsive
- Dark mode
- Notificaciones toast
- Carga optimizada

## 🏛️ Arquitectura Técnica

### Backend (Laravel)
- **API RESTful** con Laravel Sanctum
- **Base de datos** MySQL con Eloquent ORM
- **Autenticación** basada en tokens
- **Validación** de datos con Form Requests

### Frontend (React)
- **Componentes** modulares y reutilizables
- **Estado global** con Context API
- **Tipado estático** con TypeScript
- **Estilos** con Tailwind CSS

### Infraestructura
- **Docker** para desarrollo y producción
- **Nginx** como proxy reverso
- **MySQL** para persistencia
- **PhpMyAdmin** para administración

## 🔧 Comandos Útiles

```bash
# Backend
docker exec php_fpm php artisan migrate
docker exec php_fpm php artisan db:seed
docker exec php_fpm php artisan cache:clear

# Frontend
cd frontend && npm run dev
cd frontend && npm run build

# Docker
docker-compose up -d
docker-compose logs -f
docker-compose restart
```

## 🚨 Solución de Problemas

### Error de conexión a BD
```bash
docker-compose restart mysql
```

### Frontend no carga
```bash
cd frontend && npm install && npm run dev
```

### Problemas de permisos
```bash
docker exec php_fpm chmod -R 775 storage bootstrap/cache
```

## 📊 Estado del Proyecto

### ✅ Completado
- Autenticación completa
- CRUD de publicaciones
- Sistema de filtros
- Gestión de imágenes
- Favoritos de usuarios
- Perfil de usuario
- Historial de compras
- Responsive design
- Dark mode

### 🔄 En Desarrollo
- Sistema de transacciones
- Notificaciones push
- Chat integrado
- Reportes de ventas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

**MAI** - Conectando el campo con el mercado 🚀