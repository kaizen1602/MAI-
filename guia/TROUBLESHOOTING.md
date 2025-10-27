# 🚨 Troubleshooting - Errores Comunes en MAI

## 📋 Errores Frecuentes al Clonar el Repositorio

### 🔴 Error 1: "Resource not found" y 404 en Consola

**Síntomas**:
```
GET http://localhost:5173/api/my-favorites 404 (Not Found)
GET http://localhost:5173/api/auth/profile 404 (Not Found)
interceptors.ts:77 Resource not found
```

**Causa**: El backend no está corriendo o no está configurado correctamente.

**Solución**:
```bash
# 1. Verificar que Docker esté corriendo
docker ps

# 2. Si no hay contenedores, levantarlos
docker-compose up -d

# 3. Verificar que el backend responda
curl http://localhost/api/auth/profile
# Debería devolver 401 (no autenticado), no 404
```

### 🔴 Error 2: "The POST method is not supported for route api/auth/profile"

**Síntomas**:
```
POST http://localhost:5173/api/auth/profile 500 (Internal Server Error)
Server error: The POST method is not supported for route api/auth/profile. Supported methods: GET, HEAD, PUT.
```

**Causa**: El frontend está enviando POST en lugar de PUT para actualizar el perfil.

**Solución**: Verificar que `AuthService.ts` use PUT:
```typescript
// Correcto:
await this.client.put(ENDPOINTS.AUTH.PROFILE, data);

// Incorrecto:
await this.client.post(ENDPOINTS.AUTH.PROFILE, data);
```

### 🔴 Error 3: "my-favorites 404"

**Síntomas**:
```
GET http://localhost:5173/api/my-favorites 404 (Not Found)
Error loading favorites: AxiosError
```

**Causa**: El endpoint de favoritos no existe en el backend.

**Solución**: Verificar si el endpoint existe:
```bash
docker exec php_fpm php artisan route:list | grep favorites
```

Si no existe, es normal que falle. El componente `UserFavorites` mostrará un error pero no afecta la funcionalidad principal.

### 🔴 Error 4: "Estado inicial formData" repetido

**Síntomas**:
```
PublishPostModal.tsx:26 Estado inicial formData: Object
PublishPostModal.tsx:26 Estado inicial formData: Object
PublishPostModal.tsx:26 Estado inicial formData: Object
```

**Causa**: Logs de debug que se repiten por re-renders.

**Solución**: Estos logs son normales en desarrollo. Se pueden eliminar removiendo el `console.log` del componente.

### 🔴 Error 5: "Wall component rendering" repetido

**Síntomas**:
```
wall.tsx:31 Wall component rendering
wall.tsx:31 Wall component rendering
wall.tsx:31 Wall component rendering
```

**Causa**: Logs de debug que se repiten por re-renders.

**Solución**: Estos logs son normales en desarrollo. Se pueden eliminar removiendo el `console.log` del componente.

## 🔧 Comandos de Diagnóstico

### Verificar Estado del Sistema
```bash
# Ver todos los contenedores
docker ps

# Ver logs del backend
docker-compose logs php_fpm

# Ver logs del frontend
docker-compose logs frontend

# Ver logs de MySQL
docker-compose logs mysql
```

### Verificar Base de Datos
```bash
# Ver estado de migraciones
docker exec php_fpm php artisan migrate:status

# Ver rutas disponibles
docker exec php_fpm php artisan route:list

# Acceder a MySQL
docker exec mysql_db mysql -u mai_user -pmai_pass mai_db
```

### Verificar API
```bash
# Probar endpoint de autenticación
curl http://localhost/api/auth/profile

# Probar endpoint de publicaciones
curl http://localhost/api/posts

# Probar endpoint de productos
curl http://localhost/api/products
```

## 🚀 Solución Completa para Clonación Nueva

Si acabas de clonar el repositorio y tienes errores, sigue estos pasos:

### Paso 1: Verificar Prerrequisitos
```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar Node.js
node --version
npm --version
```

### Paso 2: Configurar Backend
```bash
# Levantar servicios
docker-compose up -d

# Esperar a que MySQL esté listo (30 segundos)
sleep 30

# Ejecutar migraciones
docker exec php_fpm php artisan migrate

# Ejecutar seeders
docker exec php_fpm php artisan db:seed
```

### Paso 3: Configurar Frontend
```bash
# Instalar dependencias
cd frontend
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Paso 4: Verificar Funcionamiento
```bash
# Verificar que el backend responda
curl http://localhost/api/auth/profile
# Debería devolver 401 (no autenticado)

# Verificar que el frontend cargue
curl http://localhost:5173
# Debería devolver HTML del frontend
```

### Paso 5: Probar Login
1. Ir a http://localhost:5173
2. Hacer login con `vendedor@test.com` / `password`
3. Verificar que no hay errores en consola

## 🔍 Debugging Avanzado

### Ver Logs en Tiempo Real
```bash
# Backend
docker-compose logs -f php_fpm

# Frontend
docker-compose logs -f frontend

# MySQL
docker-compose logs -f mysql
```

### Reiniciar Servicios
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo backend
docker-compose restart php_fpm

# Reiniciar solo frontend
docker-compose restart frontend
```

### Limpiar Cache
```bash
# Limpiar cache de Laravel
docker exec php_fpm php artisan cache:clear
docker exec php_fpm php artisan config:clear
docker exec php_fpm php artisan route:clear

# Limpiar cache de Docker
docker system prune -f
```

## 📞 Soporte

Si sigues teniendo problemas:

1. **Revisa los logs**: `docker-compose logs -f`
2. **Verifica el estado**: `docker ps`
3. **Reinicia todo**: `docker-compose down && docker-compose up -d`
4. **Ejecuta migraciones**: `docker exec php_fpm php artisan migrate:fresh --seed`

---

**MAI** - Troubleshooting completo 🚀
